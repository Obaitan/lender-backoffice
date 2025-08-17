'use client';

import { useState, useEffect, useRef } from 'react';
import { PaperClipIcon, FunnelIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { Loader2, Download } from 'lucide-react';
import { ActivityItem } from '@/types';
import Image from 'next/image';
import { formatDate, truncateString } from '@/utils/functions';
import { LoanService, ActivityHistoryResponse } from '@/services/loanService';
import PeriodFilter from '@/components/general/PeriodFilter';
import { parseISO, isAfter, isBefore, isEqual } from 'date-fns';
import { AuthService, API_CONFIG } from '@/services/authService';
import useAuth from '@/hooks/useAuth';
import { toast } from 'react-toastify';

// Interface for activity attachments
interface ActivityAttachment {
  id: number;
  fileName: string;
  originalFileName: string;
  fileExtension: string;
  fileSize: number;
  contentType: string;
  uploadDate: string;
  uploadedBy: string;
  downloadUrl: string;
}

// Extended ActivityItem with additional properties
interface ExtendedActivityItem extends ActivityItem {
  hasAttachment?: boolean;
  isApproval?: boolean;
  isDecline?: boolean;
  attachments?: ActivityAttachment[];
}

// Convert activity history response to ActivityItem format
const convertActivityHistoryToItems = (
  history: ActivityHistoryResponse[]
): ExtendedActivityItem[] => {
  return history.map((item) => ({
    id: item.id,
    actionType: item.subject,
    actionBy: item.createdBy,
    role: item.role,
    date: item.dateCreated,
    comment: item.comments,
    attachments: item.attachments || [],
    // Only mark as having attachment if there are actual file attachments
    hasAttachment: item.attachments && item.attachments.length > 0,
    isApproval: item.subject.toLowerCase().includes('approval') || 
                item.subject.toLowerCase().includes('recommend') ||
                item.subject.toLowerCase().includes('approve'),
    isDecline: item.subject.toLowerCase().includes('decline') || 
               item.subject.toLowerCase().includes('rejected') ||
               item.subject.toLowerCase().includes('reject'),
  }));
};

// function to fetch activity history
const fetchActivityHistory = async (
  customerID: string
): Promise<ExtendedActivityItem[]> => {
  try {
    console.log(`Fetching activity history for customer: ${customerID}`);

    const history = await LoanService.getActivityHistory(customerID);
    console.log('Raw activity history from API:', history);
    
    const converted = convertActivityHistoryToItems(history);
    console.log('Converted activity history:', converted.map(item => ({
      id: item.id,
      actionType: item.actionType,
      hasAttachment: item.hasAttachment,
      attachments: item.attachments?.length || 0
    })));
    
    return converted;
  } catch (error) {
    console.error('Error fetching activity history:', error);
    return [];
  }
};

interface ActivityHistoryProps {
  loanNumber: string;
  customerID?: string; // Add customerID as optional prop
  refreshTrigger?: number; // Add refresh trigger prop
}

type SortBy = 'date' | 'actionType' | 'actionBy';
type SortOrder = 'asc' | 'desc';
type FilterBy = 'all' | 'approval' | 'decline' | 'withAttachment';

const ActivityHistory = ({ loanNumber, customerID, refreshTrigger }: ActivityHistoryProps) => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ExtendedActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState<string>('');
  // Period filter state
  const [appliedRange, setAppliedRange] = useState<{ from?: Date; to?: Date }>(
    {}
  );
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  // Sort and filter state
  const [sortBy, setSortBy] = useState<SortBy>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc'); // Latest first
  const [filterBy, setFilterBy] = useState<FilterBy>('all');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  
  // Preview modal state
  const [previewFile, setPreviewFile] = useState<{ url: string; name: string; type: string } | null>(null);
  
  // Loading states for individual attachments
  const [downloadingAttachments, setDownloadingAttachments] = useState<Set<number>>(new Set());
  const [previewingAttachments, setPreviewingAttachments] = useState<Set<number>>(new Set());

  // Filter and sort activities
  const processedActivities = (() => {
    // Filter by type
    let filtered = activities.filter((activity) => {
      switch (filterBy) {
        case 'approval':
          return activity.isApproval;
        case 'decline':
          return activity.isDecline;
        case 'withAttachment':
          return activity.hasAttachment;
        default:
          return true;
      }
    });

    // Filter by date range
    filtered = filtered.filter((activity) => {
      if (!appliedRange.from && !appliedRange.to) return true;
      const activityDate = parseISO(activity.date);
      if (appliedRange.from && appliedRange.to) {
        return (
          (isAfter(activityDate, appliedRange.from) ||
            isEqual(activityDate, appliedRange.from)) &&
          (isBefore(activityDate, appliedRange.to) ||
            isEqual(activityDate, appliedRange.to))
        );
      } else if (appliedRange.from) {
        return (
          isAfter(activityDate, appliedRange.from) ||
          isEqual(activityDate, appliedRange.from)
        );
      } else if (appliedRange.to) {
        return (
          isBefore(activityDate, appliedRange.to) ||
          isEqual(activityDate, appliedRange.to)
        );
      }
      return true;
    });

    // Sort activities
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'actionType':
          comparison = a.actionType.localeCompare(b.actionType);
          break;
        case 'actionBy':
          comparison = a.actionBy.localeCompare(b.actionBy);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  })();

  // Export function
  const exportActivities = () => {
    const csvContent = [
      // Header
      ['Date', 'Action Type', 'Action By', 'Role', 'Comment'].join(','),
      // Data rows
      ...processedActivities.map(activity => [
        formatDate(activity.date),
        activity.actionType,
        activity.actionBy,
        activity.role,
        `"${activity.comment?.replace(/"/g, '""') || ''}"` // Escape quotes in comments
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-history-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  useEffect(() => {
    const getActivityHistory = async () => {
      // Priority: use customerID if available, otherwise extract from loanNumber if possible
      let targetCustomerID = customerID;

      if (!targetCustomerID && loanNumber) {
        // Try to extract customerID from loanNumber if it follows a pattern
        // This is a fallback - ideally customerID should be passed directly
        console.log('No customerID provided, using loanNumber:', loanNumber);
        // For now, we'll use loanNumber as customerID - this may need adjustment based on actual data structure
        targetCustomerID = loanNumber;
      }

      if (!targetCustomerID) {
        setError('No customer ID or loan number provided');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const history = await fetchActivityHistory(targetCustomerID);
        setActivities(history);
      } catch (err) {
        console.error('Error fetching activity history:', err);
        setError('Failed to load activity history');
      } finally {
        setIsLoading(false);
      }
    };

    getActivityHistory();
  }, [loanNumber, customerID]);

  // Add effect to refresh when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      console.log('Refresh triggered by external component:', refreshTrigger);
      refreshActivityHistory();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin w-6 h-6 text-secondary-200" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-3 rounded-md mt-5">{error}</div>
    );
  }

  if (!loanNumber && !customerID) {
    return (
      <div className="bg-[#f9f9f9] mt-5 p-4 md:p-5 flex justify-center items-center h-40">
        <p className="text-gray-500">No loan or customer selected</p>
      </div>
    );
  }

  // Create new activity with comment and attachments
  const createActivity = async (comment: string, files: File[]): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      
      // Priority: use customerID if available, otherwise use loanNumber
      const targetCustomerID = customerID || loanNumber;
      
      if (!targetCustomerID) {
        toast.error('No customer ID available');
        return false;
      }
      
      // Validate user data
      if (!user?.email || user.email.trim() === '') {
        toast.error('User email not available. Please login again.');
        return false;
      }
      
      // Validate comment
      if (!comment || comment.trim().length === 0) {
        toast.error('Comment cannot be empty');
        return false;
      }
      
      // Create FormData for multipart/form-data request
      const formData = new FormData();
      
      // Validate all required data before creating FormData
      const subjectValue = 'Custom Comment';
      const commentsValue = comment.trim();
      const activityTypeValue = 'LoanApplication';
      const activityParamValue = targetCustomerID;
      const createdByValue = user.email;
      
      console.log('Pre-validation check:', {
        subject: subjectValue,
        comments: commentsValue,
        activityType: activityTypeValue,
        activityParam: activityParamValue,
        createdBy: createdByValue,
        commentsLength: commentsValue.length,
        userEmail: user.email,
        targetCustomerID: targetCustomerID
      });
      
      // Ensure all values are non-empty strings
      if (!subjectValue || subjectValue.trim() === '') {
        toast.error('Subject cannot be empty');
        return false;
      }
      if (!commentsValue || commentsValue === '') {
        toast.error('Comments cannot be empty');
        return false;
      }
      if (!activityTypeValue || activityTypeValue.trim() === '') {
        toast.error('Activity type cannot be empty');
        return false;
      }
      if (!activityParamValue || activityParamValue.trim() === '') {
        toast.error('Activity param cannot be empty');
        return false;
      }
      if (!createdByValue || createdByValue.trim() === '') {
        toast.error('Created by cannot be empty');
        return false;
      }
      
      formData.append('subject', subjectValue);
      formData.append('comments', commentsValue);
      formData.append('activityType', activityTypeValue);
      formData.append('activityParam', activityParamValue);
      formData.append('createdBy', createdByValue);
      
      // Add attachments if any, otherwise add empty string to match API expectation
      if (files.length > 0) {
        files.forEach((file) => {
          formData.append('attachments', file);
        });
      } else {
        formData.append('attachments', 'string');
      }
      
      console.log('Creating activity with validated data:', {
        subject: subjectValue,
        comments: commentsValue,
        activityType: activityTypeValue,
        activityParam: activityParamValue,
        createdBy: createdByValue,
        attachments: files.map(f => ({ name: f.name, size: f.size, type: f.type }))
      });
      
      // Log FormData contents for debugging
      console.log('FormData entries:');
      for (const [key, value] of formData.entries()) {
        console.log(`FormData - ${key}:`, value instanceof File ? `File: ${value.name}` : `"${value}"`);
      }
      
      // Validate FormData before sending
      const requiredFields = ['subject', 'comments', 'activityType', 'activityParam', 'createdBy'];
      for (const field of requiredFields) {
        const value = formData.get(field);
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          console.error(`Missing required field: ${field}`, value);
          toast.error(`Missing required field: ${field}`);
          return false;
        }
      }
      
      // Get auth token for headers
      const token = await AuthService.getValidToken();
      
      const response = await fetch(
        `${API_CONFIG.baseUrl}/api/V2/ActivityHistory/createActivity`,
        {
          method: 'POST',
          headers: {
            'Accept': 'text/plain',
            'Authorization': `Bearer ${token}`
            // Note: Don't set Content-Type for FormData, let the browser set it with boundary
          },
          body: formData
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Create activity error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          headers: Object.fromEntries(response.headers.entries()),
          url: response.url
        });
        
        // Try to parse error message and show validation errors
        try {
          const errorData = JSON.parse(errorText);
          console.error('Parsed error data:', errorData);
          
          if (errorData.errors) {
            // Show validation errors
            const errorMessages = Object.entries(errorData.errors)
              .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
              .join('\n');
            toast.error(`Validation errors:\n${errorMessages}`);
          } else {
            toast.error(errorData.message || errorData.title || 'Failed to create activity. Please try again.');
          }
        } catch {
          toast.error(`Failed to create activity: ${response.statusText}`);
        }
        
        return false;
      }
      
      const result = await response.json();
      console.log('Activity created successfully:', {
        ...result,
        attachments: result.attachments?.map((att: { id: string; fileName: string; originalFileName: string; fileSize: number; mimeType: string; uploadDate: string; fileUrl?: string; downloadUrl?: string }) => ({
          id: att.id,
          fileName: att.fileName,
          originalFileName: att.originalFileName,
          fileSize: att.fileSize,
          downloadUrl: att.downloadUrl
        })) || []
      });
      
      toast.success('Comment added successfully!');
      
      // Add the newly created activity to the state immediately
      if (result && result.id) {
        const newActivity: ExtendedActivityItem = {
          id: result.id,
          actionType: result.subject,
          actionBy: result.createdBy,
          role: result.role,
          date: result.dateCreated,
          comment: result.comments,
          attachments: result.attachments || [],
          hasAttachment: result.attachments && result.attachments.length > 0,
          isApproval: result.subject.toLowerCase().includes('approval') || 
                      result.subject.toLowerCase().includes('recommend') ||
                      result.subject.toLowerCase().includes('approve'),
          isDecline: result.subject.toLowerCase().includes('decline') || 
                     result.subject.toLowerCase().includes('rejected') ||
                     result.subject.toLowerCase().includes('reject'),
        };
        
        // Add to the beginning of the activities list (latest first)
        setActivities(prev => [newActivity, ...prev]);
      }
      
      // Also refresh from API to ensure consistency (wait a bit for API to process)
      setTimeout(async () => {
        console.log('Doing delayed refresh after activity creation...');
        await refreshActivityHistory();
      }, 2000);
      
      return true;
    } catch (error) {
      console.error('Error creating activity:', error);
      toast.error('An error occurred while creating the activity');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Refresh activity history
  const refreshActivityHistory = async () => {
    const targetCustomerID = customerID || loanNumber;
    if (!targetCustomerID) return;
    
    try {
      console.log('Refreshing activity history...');
      const history = await fetchActivityHistory(targetCustomerID);
      console.log('Setting new activities:', history.length, 'items');
      setActivities(history);
    } catch (err) {
      console.error('Error refreshing activity history:', err);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submission - User data:', {
      user: user,
      email: user?.email,
      roleCode: user?.roleCode,
      isUserAvailable: !!user
    });
    
    if (comment.trim().length < 4) {
      toast.error('Comment must be at least 4 characters long');
      return;
    }
    
    const success = await createActivity(comment.trim(), selectedFiles);
    
    if (success) {
      // Clear form
      setComment('');
      setSelectedFiles([]);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  

  // Helper to truncate file name but preserve extension
  function truncateFileNamePreserveExt(
    filename: string,
    maxBaseLength: number = 10
  ) {
    const lastDot = filename.lastIndexOf('.');
    if (lastDot === -1 || lastDot === 0)
      return truncateString(filename, maxBaseLength); // no extension or hidden file
    const base = filename.slice(0, lastDot);
    const ext = filename.slice(lastDot);
    if (base.length > maxBaseLength) {
      return base.slice(0, maxBaseLength) + '...' + ext;
    }
    return base + ext;
  }
  
  // Helper to get file type and icon
  function getFileTypeInfo(fileName: string) {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    
    switch (ext) {
      case 'pdf':
        return { type: 'pdf', icon: '/shapes/pdf-icon.svg', canPreview: true };
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return { type: 'image', icon: '/shapes/pdf-icon.svg', canPreview: true };
      case 'docx':
      case 'doc':
        return { type: 'docx', icon: '/shapes/pdf-icon.svg', canPreview: false };
      case 'csv':
      case 'xlsx':
      case 'xls':
        return { type: 'spreadsheet', icon: '/shapes/pdf-icon.svg', canPreview: false };
      case 'txt':
        return { type: 'text', icon: '/shapes/pdf-icon.svg', canPreview: false };
      default:
        return { type: 'unknown', icon: '/shapes/pdf-icon.svg', canPreview: false };
    }
  }

  return (
    <>
      <div className="mt-4">
        <form className="mb-8" onSubmit={handleSubmit}>
          <p className="text-sm text-gray-800 font-medium mb-2">Comments</p>
          <div className="rounded border border-[#e5e5e5]">
            <textarea
              rows={3}
              className="p-3 text-sm text-gray-800 border-b border-b-[#eee] w-full outline-0"
              placeholder="Enter comments here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isSubmitting}
            ></textarea>
            <div className="px-3 pt-1 pb-1.5 flex justify-between items-center">
              <button
                type="submit"
                disabled={comment.trim().length < 4 || isSubmitting}
                className="bg-secondary-200 text-sm font-medium text-white rounded px-5 py-1 hover:opacity-90 hover:text-white disabled:text-gray-200 disabled:bg-[#f4f4f4] disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit'
                )}
              </button>
              <input
                type="file"
                multiple
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept=".pdf,.docx,.jpg,.jpeg,.png,.csv,.xlsx,.xls,.txt"
                onChange={(e) => {
                  const files = e.target.files
                    ? Array.from(e.target.files)
                    : [];
                  
                  // Validate file types and size
                  const allowedTypes = ['pdf', 'docx', 'doc', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'csv', 'xlsx', 'xls', 'txt'];
                  const maxFileSize = 10 * 1024 * 1024; // 10MB
                  const validFiles: File[] = [];
                  const invalidFiles: string[] = [];
                  const oversizedFiles: string[] = [];
                  
                  files.forEach(file => {
                    const ext = file.name.split('.').pop()?.toLowerCase();
                    
                    if (!ext || !allowedTypes.includes(ext)) {
                      invalidFiles.push(file.name);
                    } else if (file.size > maxFileSize) {
                      oversizedFiles.push(file.name);
                    } else {
                      validFiles.push(file);
                    }
                  });
                  
                  // Show appropriate error messages
                  if (invalidFiles.length > 0) {
                    toast.error(`Invalid file type(s): ${invalidFiles.join(', ')}. Only PDF, DOCX, JPG, PNG, CSV, XLSX, and TXT files are allowed.`);
                  }
                  if (oversizedFiles.length > 0) {
                    toast.error(`File(s) too large: ${oversizedFiles.join(', ')}. Maximum size is 10MB per file.`);
                  }
                  
                  console.log('File input change event:', {
                    totalFiles: files.length,
                    validFiles: validFiles.length,
                    invalidFiles: invalidFiles.length,
                    oversizedFiles: oversizedFiles.length,
                    files: validFiles.map(f => ({
                      name: f.name,
                      size: f.size,
                      type: f.type,
                      lastModified: f.lastModified
                    }))
                  });
                  
                  setSelectedFiles(validFiles);
                }}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-500 bg-white hover:bg-primary-300 rounded-md hover:text-secondary-200 transition-colors border border-[#eee] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PaperClipIcon className="h-4 w-4 text-secondary-200" />
                Attach File
              </button>
            </div>
            {selectedFiles.length > 0 && (
              <div className="px-3 py-1 pb-2">
                <div className="flex flex-wrap gap-2">
                  {selectedFiles.map((file, idx) => (
                    <span
                      key={idx}
                      className="flex items-center gap-1 text-xs text-gray-600 px-2 py-1.5 bg-primary-50 rounded border border-primary-100"
                    >
                      <PaperClipIcon className="w-3 h-3 text-gray-400" />
                      <span className="max-w-[150px] truncate">
                        {truncateFileNamePreserveExt(file.name, 15)}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        ({(file.size / 1024).toFixed(1)}KB)
                      </span>
                      <button
                        type="button"
                        aria-label="Remove file"
                        className="ml-1 text-gray-400 hover:text-red-500 focus:outline-none"
                        onClick={() => {
                          setSelectedFiles((prev) =>
                            prev.filter((_, i) => i !== idx)
                          );
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <p className="text-[10px] text-gray-400 mt-1">
                  {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
                </p>
              </div>
            )}
          </div>
        </form>

        <div className="flex flex-wrap justify-between gap-5 items-center px-1">
          <div className="flex flex-wrap gap-3 items-center">
            <button 
              onClick={exportActivities}
              className="text-secondary-200 flex text-[13px] gap-1 items-center underline hover:text-secondary-300 transition-colors"
            >
              <Download className="w-3 h-3" />
              Export All ({processedActivities.length})
            </button>
            
            {/* Filter Toggle */}
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1 px-2 py-1 text-xs rounded border transition-colors ${
                showFilters ? 'bg-secondary-50 border-secondary-200 text-secondary-200' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <FunnelIcon className="w-3 h-3" />
              Filters
            </button>
            
            {/* Sort Controls */}
            <div className="flex items-center gap-1">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="text-xs border border-gray-200 rounded px-2 py-1 outline-none focus:border-secondary-200"
              >
                <option value="date">Sort by Date</option>
                <option value="actionType">Sort by Action</option>
                <option value="actionBy">Sort by User</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-1 text-gray-600 hover:text-secondary-200 transition-colors"
                title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
              >
                {sortOrder === 'asc' ? 
                  <ArrowUpIcon className="w-3 h-3" /> : 
                  <ArrowDownIcon className="w-3 h-3" />
                }
              </button>
            </div>
          </div>
          
          <PeriodFilter
            appliedRange={appliedRange}
            setAppliedRange={setAppliedRange}
          />
        </div>
        
        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-3">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-gray-600 font-medium">Filter by:</span>
              <div className="flex gap-1">
                {(['all', 'approval', 'decline', 'withAttachment'] as FilterBy[]).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setFilterBy(filter)}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      filterBy === filter
                        ? 'bg-secondary-200 text-white'
                        : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {filter === 'all' ? 'All' : 
                     filter === 'approval' ? 'Approvals' : 
                     filter === 'decline' ? 'Declines' : 
                     'With Attachments'}
                  </button>
                ))}
              </div>
              <span className="text-xs text-gray-500 ml-2">
                Showing {processedActivities.length} of {activities.length} activities
              </span>
            </div>
          </div>
        )}
        <hr className="border-gray-50 mt-2.5 mb-5" />

        <div className="flex flex-col gap-5">
          {processedActivities.length > 0 ? (
            processedActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 md:gap-5 pb-6"
              >
                <div className="bg-primary-50 p-2 rounded-full border border-primary-100">
                  <Image
                    src={'/shapes/notification.svg'}
                    alt="Message icon"
                    width={20}
                    height={20}
                  />
                </div>

                <div className="text-[13px] flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-medium text-gray-800">
                      {activity.actionType}
                    </p>
                    
                    {/* Approval/Decline Badges */}
                    {activity.isApproval && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-medium rounded-full">
                        <CheckCircleIcon className="w-3 h-3" />
                        Approval
                      </span>
                    )}
                    {activity.isDecline && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-medium rounded-full">
                        <XCircleIcon className="w-3 h-3" />
                        Decline
                      </span>
                    )}
                    
                    {/* Conditional Attachment Icon */}
                    {activity.hasAttachment && (
                      <PaperClipIcon className="w-3 h-3 text-gray-400" title="Has attachment" />
                    )}
                  </div>
                  
                  <div className="flex flex-wrap justify-between items-center gap-x-5 gap-y-1">
                    <p className="text-xs font-medium text-secondary-200">
                      {activity.actionBy} ({activity.role})
                    </p>
                    <p className="text-xs text-gray-300">
                      {formatDate(activity.date)}
                    </p>
                  </div>
                  <div className="bg-[#f9f9f9] rounded p-3 mt-2.5 mb-3">
                    {activity.comment && (
                      <p className="text-xs text-gray-500">
                        {activity.comment}
                      </p>
                    )}
                  </div>

                  {/* Only show attachment section if activity has attachment */}
                  {activity.hasAttachment && (
                    <div className="flex flex-wrap gap-3">
                      {activity.attachments && activity.attachments.length > 0 ? (
                        activity.attachments.map((attachment) => {
                          const fileInfo = getFileTypeInfo(attachment.originalFileName);
                          return (
                            <div 
                              key={attachment.id}
                              className="group relative bg-gray-50 border border-gray-200 rounded-lg p-2 hover:border-secondary-200 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <Image
                                  src={fileInfo.icon}
                                  alt={`${attachment.originalFileName} attachment`}
                                  height={32}
                                  width={32}
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-gray-700 truncate max-w-[120px]">
                                    {attachment.originalFileName}
                                  </p>
                                  <p className="text-[10px] text-gray-500">
                                    {(attachment.fileSize / 1024).toFixed(1)} KB
                                  </p>
                                </div>
                              </div>
                              
                              {/* Action buttons */}
                              <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                {fileInfo.canPreview && (
                                  <button
                                    className="bg-white border border-gray-200 rounded-full p-1.5 hover:bg-gray-50 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Preview"
                                    disabled={previewingAttachments.has(attachment.id)}
                                    onClick={async () => {
                                      try {
                                        setPreviewingAttachments(prev => new Set([...prev, attachment.id]));
                                        console.log('Previewing attachment:', attachment.originalFileName);
                                        const token = await AuthService.getValidToken();
                                        
                                        if (!token) {
                                          toast.error('Authentication required to preview attachment');
                                          return;
                                        }
                                        
                                        const response = await fetch(`${API_CONFIG.baseUrl}${attachment.downloadUrl}`, {
                                          headers: {
                                            'Authorization': `Bearer ${token}`
                                          }
                                        });
                                        
                                        if (!response.ok) {
                                          console.error('Preview failed:', response.status, response.statusText);
                                          toast.error(`Failed to preview attachment: ${response.statusText}`);
                                          return;
                                        }
                                        
                                        const blob = await response.blob();
                                        
                                        // Validate that the blob has content
                                        if (blob.size === 0) {
                                          toast.error('The attachment appears to be empty');
                                          return;
                                        }
                                        
                                        const url = window.URL.createObjectURL(blob);
                                        setPreviewFile({
                                          url,
                                          name: attachment.originalFileName,
                                          type: fileInfo.type
                                        });
                                      } catch (error) {
                                        console.error('Error previewing attachment:', error);
                                        toast.error('Error previewing attachment. Please try downloading instead.');
                                      } finally {
                                        setPreviewingAttachments(prev => {
                                          const next = new Set(prev);
                                          next.delete(attachment.id);
                                          return next;
                                        });
                                      }
                                    }}
                                  >
                                    {previewingAttachments.has(attachment.id) ? (
                                      <Loader2 className="w-4 h-4 text-gray-600 animate-spin" />
                                    ) : (
                                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                      </svg>
                                    )}
                                  </button>
                                )}
                                <button
                                  className="bg-white border border-gray-200 rounded-full p-1.5 hover:bg-gray-50 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="Download"
                                  disabled={downloadingAttachments.has(attachment.id)}
                                  onClick={async () => {
                                    try {
                                      setDownloadingAttachments(prev => new Set([...prev, attachment.id]));
                                      console.log('Downloading attachment:', attachment.originalFileName);
                                      const token = await AuthService.getValidToken();
                                      
                                      if (!token) {
                                        toast.error('Authentication required to download attachment');
                                        return;
                                      }
                                      
                                      const response = await fetch(`${API_CONFIG.baseUrl}${attachment.downloadUrl}`, {
                                        headers: {
                                          'Authorization': `Bearer ${token}`
                                        }
                                      });
                                      
                                      if (!response.ok) {
                                        console.error('Download failed:', response.status, response.statusText);
                                        toast.error(`Failed to download attachment: ${response.statusText}`);
                                        return;
                                      }
                                      
                                      const blob = await response.blob();
                                      
                                      // Validate that the blob has content
                                      if (blob.size === 0) {
                                        toast.error('The attachment appears to be empty');
                                        return;
                                      }
                                      
                                      const url = window.URL.createObjectURL(blob);
                                      const link = document.createElement('a');
                                      link.href = url;
                                      link.download = attachment.originalFileName;
                                      link.style.display = 'none';
                                      document.body.appendChild(link);
                                      link.click();
                                      
                                      // Clean up
                                      setTimeout(() => {
                                        window.URL.revokeObjectURL(url);
                                        document.body.removeChild(link);
                                      }, 100);
                                      
                                      toast.success(`Downloaded: ${attachment.originalFileName}`);
                                    } catch (error) {
                                      console.error('Error downloading attachment:', error);
                                      toast.error('Error downloading attachment. Please try again.');
                                    } finally {
                                      setDownloadingAttachments(prev => {
                                        const next = new Set(prev);
                                        next.delete(attachment.id);
                                        return next;
                                      });
                                    }
                                  }}
                                >
                                  {downloadingAttachments.has(attachment.id) ? (
                                    <Loader2 className="w-4 h-4 text-gray-600 animate-spin" />
                                  ) : (
                                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                                    </svg>
                                  )}
                                </button>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="flex flex-col items-center gap-1 p-2">
                          <Image
                            src={'/shapes/pdf-icon.svg'}
                            alt="Document attachment"
                            height={40}
                            width={41}
                          />
                          <p className="text-[10px] text-gray-300">
                            {truncateString('Attachment', 10)}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-[#f9f9f9] p-4 md:p-5 flex justify-center items-center h-40">
              <p className="text-gray-500 text-sm">No activity to show.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Preview Modal */}
      {previewFile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            if (previewFile.url) {
              window.URL.revokeObjectURL(previewFile.url);
            }
            setPreviewFile(null);
          }}
        >
          <div 
            className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-medium text-gray-800 truncate">
                {previewFile.name}
              </h3>
              <button
                onClick={() => {
                  if (previewFile.url) {
                    window.URL.revokeObjectURL(previewFile.url);
                  }
                  setPreviewFile(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-4 overflow-auto max-h-[calc(90vh-120px)]">
              {previewFile.type === 'image' ? (
                <Image 
                  src={previewFile.url} 
                  alt={previewFile.name}
                  className="max-w-full h-auto mx-auto"
                  width={800}
                  height={600}
                  style={{ width: 'auto', height: 'auto' }}
                />
              ) : previewFile.type === 'pdf' ? (
                <iframe
                  src={previewFile.url}
                  title={previewFile.name}
                  className="w-full h-[600px] border-0"
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Preview not available for this file type</p>
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="flex justify-end gap-2 p-4 border-t">
              <button
                onClick={() => {
                  // Download the file
                  const link = document.createElement('a');
                  link.href = previewFile.url;
                  link.download = previewFile.name;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="px-4 py-2 bg-secondary-200 text-white rounded hover:bg-secondary-300 transition-colors"
              >
                Download
              </button>
              <button
                onClick={() => {
                  if (previewFile.url) {
                    window.URL.revokeObjectURL(previewFile.url);
                  }
                  setPreviewFile(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ActivityHistory;
