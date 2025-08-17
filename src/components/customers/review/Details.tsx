'use client';

import useAuth from '@/hooks/useAuth';
import { useState, useEffect, useCallback } from 'react';
import StatusChip from '@/components/general/StatusChip';
import {
  HandThumbDownIcon,
  HandThumbUpIcon,
  LockClosedIcon,
  ArrowRightIcon,
   ArrowLeftIcon,
  CheckIcon,
  UserIcon,
  ClockIcon,
} from '@heroicons/react/24/solid';
import Tooltip from '@/components/general/Tooltip';
import { 
  FileOutputIcon,
  Loader2
} from 'lucide-react';
import {
  LoanResponse,
  LoanService,
  SelectOption,
} from '@/services/loanService';
import { API_CONFIG, AuthService } from '@/services/authService';
import {
  fetchSystemParameter,
  INTEREST_RATE_PARAMETER_ID,
} from '@/services/apiQueries/systemParametersApi';
import UploadDocument from '@/components/modals/UploadDocument';
import LoanDeclineModal from '@/components/modals/LoanDeclineModal';
import { toast } from 'react-toastify';
import Select from '@/components/forms/Select';

interface DetailsProps {
  loanData: LoanResponse | null;
  isLoading: boolean;
  onActivityCreated?: () => void; // Optional callback when activity is created
}

const Details = ({ loanData, onActivityCreated }: DetailsProps) => {
  const { user } = useAuth();
  const [adjustedValue, setAdjustedValue] = useState<string>('0');
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [tenureMonths, setTenureMonths] = useState<string>('1');
  const [tenureDays, setTenureDays] = useState<number>(30);
  const [monthlyRepayment, setMonthlyRepayment] = useState<string>('');
  const [displayInterestRate, setDisplayInterestRate] = useState<string>('0'); // Monthly rate for display
  const [interestRate, setInterestRate] = useState<string>('0');
  const [isLoadingInterestRate, setIsLoadingInterestRate] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [isUpdatingWorkflow, setIsUpdatingWorkflow] = useState(false);
  const [loanTenureOptions, setLoanTenureOptions] = useState<string[]>([]);

  const [loans, setLoans] = useState<SelectOption[]>([]);
  const [selectedLoan, setSelectedLoan] = useState<string>('');
  const [isLoadingLoans, setIsLoadingLoans] = useState(false);
  const [error, setError] = useState<string | null>(null);


  // Fetch loans for the customer when loanData.customerID changes
  useEffect(() => {
    const fetchLoans = async () => {
      if (!loanData?.customerID) {
        setError('Valid customer ID is required to fetch loans');
        setLoans([]);
        return;
      }
      setIsLoadingLoans(true);
      setError(null);
      try {
        const customerLoans = await LoanService.getLoansByCustomerID(
          loanData.customerID
        );
        if (customerLoans && customerLoans.length > 0) {
          const loanOptions =
            LoanService.convertLoansToSelectOptions(customerLoans);
          setLoans(loanOptions);
          setSelectedLoan(loanOptions[0]?.value || ''); // Set first loan as selected
        } else {
          setLoans([]);
          setError('No loans found for this customer');
        }
      } catch {
        setError('Failed to load customer loans');
        setLoans([]);
      } finally {
        setIsLoadingLoans(false);
      }
    };
    fetchLoans();
  }, [loanData?.customerID]);

  // Handle loan selection change
  const handleLoanChange = (loanNumber: string) => {
    setSelectedLoan(loanNumber);

    // Find the selected loan from cache
    const loanDetails = LoanService.getLoanDetailsByNumber(loanNumber);
    if (loanDetails) {
      // Update all dynamic form values to reflect the selected loan
      const formattedAmount =
        loanDetails.amount !== undefined
          ? Number(loanDetails.amount).toLocaleString('en-US')
          : '0';
      setAdjustedValue(formattedAmount);

      // Set tenure (convert days to months if duration is in days)
      if (loanDetails.duration) {
        const durationInDays = Number(loanDetails.duration);
        const monthsFromDays = Math.ceil(durationInDays / 30); // Convert days to months
        setTenureMonths(Math.min(Math.max(monthsFromDays, 1), 36).toString()); // Clamp between 1-36
      } else {
        setTenureMonths('1');
      }

      // Set interest rate only if it exists in the loan data
      if (loanDetails.interestRate !== undefined) {
        const dailyRate = Number(loanDetails.interestRate);
        const monthlyRate = dailyRate * 30;
        setInterestRate(dailyRate.toString());
        setDisplayInterestRate(monthlyRate.toFixed(2));
      } else if (
        loanDetails.interest !== undefined &&
        loanDetails.amount !== undefined
      ) {
        const totalInterestRate =
          (Number(loanDetails.interest) / Number(loanDetails.amount)) * 100;
        const calculatedDailyRate = (totalInterestRate / 30).toFixed(4);
        const monthlyRate = Number(calculatedDailyRate) * 30;
        setInterestRate(calculatedDailyRate);
        setDisplayInterestRate(monthlyRate.toFixed(2));
      }

      // Set monthly repayment
      const monthly =
        loanDetails.installmentAmount !== undefined
          ? Number(loanDetails.installmentAmount).toLocaleString('en-US')
          : '0';
      setMonthlyRepayment(monthly);
    } else {
      setError(`Could not find details for loan ${loanNumber}`);
    }
  };

  // Calculate monthly payment function
  const calculateMonthlyPayment = useCallback(
    (tenureInMonths: string) => {
      if (!tenureInMonths) return;

      const principal = Number(adjustedValue.replace(/,/g, ''));
      const dailyRatePercent = Number(interestRate); // This is the daily rate as percentage (e.g., 0.5%)
      const dailyRateDecimal = dailyRatePercent / 100; // Convert to decimal (e.g., 0.005)
      const monthlyRateDecimal = dailyRateDecimal * 30; // Convert daily to monthly rate as decimal
      const months = Number(tenureInMonths);

      if (principal > 0 && months > 0) {
        // Simple calculation: total amount / number of months
        const totalAmount = principal + principal * monthlyRateDecimal * months;
        const monthly = totalAmount / months;

        setMonthlyRepayment(monthly.toLocaleString('en-US'));
      }
    },
    [adjustedValue, interestRate]
  );

  // Fetch default interest rate from system parameters
  useEffect(() => {
    const fetchDefaultInterestRate = async () => {
      try {
        setIsLoadingInterestRate(true);
        const parameter = await fetchSystemParameter(
          INTEREST_RATE_PARAMETER_ID
        );

        // Only set the default interest rate if no loan data is available yet
        // or if the loan data doesn't have an interest rate
        if (!loanData || loanData.interestRate === undefined) {
          // Use the exact value from system parameter (daily rate as percentage value)
          const dailyRate = parseFloat(parameter.value); // e.g., 0.5 (represents 0.5% daily)
          const monthlyRate = dailyRate * 30; // e.g., 0.5 * 30 = 15.0 (15.0% monthly)
          setInterestRate(dailyRate.toString()); // Keep daily rate for calculations
          setDisplayInterestRate(monthlyRate.toFixed(2)); // Display monthly rate: 15.00
        }
      } catch (error) {
        console.error('Error fetching default interest rate:', error);
      } finally {
        setIsLoadingInterestRate(false);
      }
    };

    fetchDefaultInterestRate();
  }, [loanData]);

  // Fetch loan tenure options from system parameters
  useEffect(() => {
    const fetchLoanTenureOptions = async () => {
      try {
        const token = await AuthService.getValidToken();
        const response = await fetch(
          `${API_CONFIG.baseUrl}/api/V2/SystemParameter/getSystemParameterByName?name=Loan Tenure`,
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log('Loan tenure parameter response:', data);
          
          // Parse the comma-separated values
          if (data.value) {
            const tenureValues = data.value.split(',').map((v: string) => v.trim());
            setLoanTenureOptions(tenureValues);
            
            // If current tenure is not in the options, set the first option
            if (!tenureValues.includes(tenureMonths)) {
              setTenureMonths(tenureValues[0] || '1');
            }
          }
        } else {
          console.error('Failed to fetch loan tenure options:', response.statusText);
          // Fallback to default options
          setLoanTenureOptions(['3', '6', '9', '11', '12']);
        }
      } catch (error) {
        console.error('Error fetching loan tenure options:', error);
        // Fallback to default options
        setLoanTenureOptions(['3', '6', '9', '11', '12']);
      }
    };

    fetchLoanTenureOptions();
  }, [tenureMonths]);

  // Calculate days from months
  const calculateDaysFromMonths = useCallback((months: string) => {
    const monthsNum = Number(months);
    return monthsNum * 30; // Assuming 30 days per month
  }, []);

  // Update days when months change
  useEffect(() => {
    const days = calculateDaysFromMonths(tenureMonths);
    setTenureDays(days);
  }, [tenureMonths, calculateDaysFromMonths]);

  // Update monthly display rate when daily rate changes
  useEffect(() => {
    const dailyRate = parseFloat(interestRate) || 0;
    const monthlyRate = dailyRate * 30;
    setDisplayInterestRate(monthlyRate.toFixed(2));
  }, [interestRate]);

  // Recalculate monthly payment when interest rate or adjusted value changes
  useEffect(() => {
    if (tenureMonths) {
      calculateMonthlyPayment(tenureMonths);
    }
  }, [interestRate, adjustedValue, calculateMonthlyPayment, tenureMonths]);

  // Initialize form values when loan data changes
  useEffect(() => {
    if (loanData) {
      console.log('Loan data received in Details component:', loanData);

      // Convert loan amount to formatted string
      const formattedAmount =
        loanData.amount !== undefined
          ? Number(loanData.amount).toLocaleString('en-US')
          : '0';
      setAdjustedValue(formattedAmount);

      // Set tenure (convert days to months if duration is in days)
      if (loanData.duration) {
        const durationInDays = Number(loanData.duration);
        const monthsFromDays = Math.ceil(durationInDays / 30); // Convert days to months
        setTenureMonths(Math.min(Math.max(monthsFromDays, 1), 36).toString()); // Clamp between 1-36
      }

      // Set interest rate only if it exists in the loan data
      if (loanData.interestRate !== undefined) {
        // Use the exact value from loan data (daily rate as percentage value)
        const dailyRate = Number(loanData.interestRate); // e.g., 0.5 (represents 0.5% daily)
        const monthlyRate = dailyRate * 30; // e.g., 0.5 * 30 = 15.0 (15.0% monthly)
        setInterestRate(dailyRate.toString()); // Keep daily rate
        setDisplayInterestRate(monthlyRate.toFixed(2)); // Display monthly rate: 15.00
      } else if (
        loanData.interest !== undefined &&
        loanData.amount !== undefined
      ) {
        // Calculate daily rate as percentage value
        const totalInterestRate =
          (Number(loanData.interest) / Number(loanData.amount)) * 100; // Total interest as percentage
        const calculatedDailyRate = (totalInterestRate / 30).toFixed(4); // Daily rate as percentage
        const monthlyRate = Number(calculatedDailyRate) * 30;
        setInterestRate(calculatedDailyRate);
        setDisplayInterestRate(monthlyRate.toFixed(2));
      }
      // If no interest rate in loan data, we'll use the system parameter (already set in the other useEffect)

      // Set monthly repayment
      const monthly =
        loanData.installmentAmount !== undefined
          ? Number(loanData.installmentAmount).toLocaleString('en-US')
          : '0';
      setMonthlyRepayment(monthly);
    }
  }, [loanData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
    const formattedValue = rawValue
      ? Number(rawValue).toLocaleString('en-US')
      : '';
    setAdjustedValue(formattedValue);
  };

  const handleTenureMonthsChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const months = e.target.value;
    setTenureMonths(months);

    // Recalculate monthly payment
    calculateMonthlyPayment(months);
  };


  // Helper to get status for StatusChip
  const getLoanStatus = (
    status: string = ''
  ): 'active' | 'pending' | 'reviewing' | 'suspended' => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'active') return 'active';
    if (statusLower === 'paid') return 'active';
    if (statusLower === 'suspended') return 'suspended';
    if (statusLower === 'pending') return 'pending';
    return 'reviewing';
  };

  // Format currency for display
  const formatCurrency = (value: string | number | undefined): string => {
    if (value === undefined) return 'NGN 0';
    const numValue =
      typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;
    return `NGN ${numValue.toLocaleString('en-US')}`;
  };

  const handleFileUpload = async (files: File[]) => {
    if (!files || files.length === 0) {
      toast.error('No files selected for upload');
      return;
    }

    if (!loanData?.customerID) {
      toast.error('No customer ID available for file upload');
      return;
    }

    try {
      console.log('Uploading files:', files.map(f => ({ name: f.name, size: f.size, type: f.type })));
      
      // Create FormData for multipart/form-data request
      const formData = new FormData();
      formData.append('subject', 'Document Upload');
      formData.append('comments', `Uploaded ${files.length} document${files.length > 1 ? 's' : ''}: ${files.map(f => f.name).join(', ')}`);
      formData.append('activityType', 'LoanApplication');
      formData.append('activityParam', loanData.customerID);
      formData.append('createdBy', user?.email || '');
      
      // Add all files as attachments
      files.forEach((file) => {
        formData.append('attachments', file);
      });
      
      console.log('Creating activity with file uploads...');
      
      // Get auth token for headers
      const token = await AuthService.getValidToken();
      
      const response = await fetch(
        `${API_CONFIG.baseUrl}/api/V2/ActivityHistory/createActivity`,
        {
          method: 'POST',
          headers: {
            'Accept': 'text/plain',
            'Authorization': `Bearer ${token}`
          },
          body: formData
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('File upload error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        
        toast.error(`Failed to upload files: ${response.statusText}`);
        return;
      }
      
      const result = await response.json();
      console.log('Files uploaded successfully:', result);
      
      toast.success(`Successfully uploaded ${files.length} file${files.length > 1 ? 's' : ''}!`);
      
      // Trigger callback to refresh ActivityHistory
      if (onActivityCreated) {
        onActivityCreated();
      }
      
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('An error occurred while uploading files');
    }
  };

  const handleDeclineConfirm = async (reasons: string[], comment?: string) => {
    // Handle the decline action here
    console.log('Decline reasons:', reasons);
    console.log('Comment:', comment);
    
    // Compose the decline comment from reasons and optional comment
    let declineComment = `Declined due to: ${reasons.join(', ')}`;
    if (comment && reasons.includes('Others')) {
      declineComment += `. Additional comment: ${comment}`;
    }
    
    // Create FormData for multipart/form-data request
    const formData = new FormData();
    formData.append('subject', 'Declined');
    formData.append('comments', declineComment);
    formData.append('activityType', 'LoanApplication');
    formData.append('activityParam', loanData?.customerID || '');
    formData.append('createdBy', user?.email || '');
    formData.append('attachments', 'string');
    
    try {
      const token = await AuthService.getValidToken();
      const response = await fetch(
        `${API_CONFIG.baseUrl}/api/V2/ActivityHistory/createActivity`,
        {
          method: 'POST',
          headers: {
            'Accept': 'text/plain',
            'Authorization': `Bearer ${token}`
          },
          body: formData
        }
      );
      
      if (response.ok) {
        console.log('Decline activity recorded successfully');
        toast.success('Loan application declined successfully');
        
        // Trigger callback to refresh ActivityHistory
        if (onActivityCreated) {
          onActivityCreated();
        }
      } else {
        console.error('Failed to record decline activity');
        toast.error('Failed to decline loan application. Please try again.');
      }
    } catch (error) {
      console.error('Error recording decline activity:', error);
      toast.error('An error occurred while declining the loan application');
    }
  };


  const updateLoanWorkflow = async (workflowAction: 'forward' | 'backward', targetStatus: string, customComment?: string): Promise<boolean> => {
    if (!loanData) {
      toast.error('No loan data available');
      return false;
    }

    try {
      setIsUpdatingWorkflow(true);
      console.log(`Updating loan workflow: ${workflowAction} to ${targetStatus}`);
      
      // Prepare the loan application data with updated workflow status
      // Parse the adjusted amount to get the numeric value
      const adjustedAmount = parseFloat(adjustedValue.replace(/,/g, '')) || loanData.amount;
      const dailyInterestRate = parseFloat(interestRate) || loanData.interestRate || 0;
      const durationInMonths = parseInt(tenureMonths) || 1;
      const monthlyPayment = parseFloat(monthlyRepayment.replace(/,/g, '')) || 0;
      
      const updatedLoanData = {
        id: loanData.id,
        loanApplicationNumber: loanData.loanNumber,
        customerID: loanData.customerID,
        customerName: loanData.customerName,
        currency: loanData.currency || 'NGN',
        amount: adjustedAmount,
        adjusteAmount: adjustedAmount,
        interestRate: dailyInterestRate,
        duration: durationInMonths, // Duration in months
        installmentAmount: monthlyPayment, // Monthly repayment amount
        phoneNumber: loanData.phoneNumber,
        email: loanData.email,
        status: targetStatus,
        workFlowStatus: targetStatus,
        rmCode: loanData.rmCode || '', // Will be populated by backend if needed
        guarantorOrgID: loanData.guarantorOrgID || '', // Will be populated by backend if needed
        guarantorOrg: loanData.guarantorOrg || '', // Will be populated by backend if needed
        loanGateApprovalStatus: loanData.loanGateApprovalStatus || targetStatus,
        createDate: loanData.createDate,
        approvalDate: loanData.approvalDate || loanData.createDate,
        createdBy: loanData.createdBy || '',
        lastModifiedDate: new Date().toISOString(),
        lastModifiedBy: user?.email || '',
        comment: customComment || `Workflow ${workflowAction} action by ${user?.roleCode || 'User'} - ${user?.email || ''}. Updated Amount: ${formatCurrency(adjustedAmount)}, Interest Rate: ${dailyInterestRate}% daily, Duration: ${tenureMonths} months, Monthly Payment: ${formatCurrency(monthlyPayment)}`,
        assignedUserEmail: loanData.assignedUserEmail || user?.email || ''
      };

      console.log('Sending loan update data:', updatedLoanData);

      const response = await AuthService.makeAuthenticatedRequest(
        `${API_CONFIG.baseUrl}/api/V2/Loan/updateLoanApplication?workflowAction=${workflowAction}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/plain'
          },
          body: JSON.stringify(updatedLoanData)
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Workflow update error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        toast.error(`Failed to update workflow: ${response.statusText}`);
        return false;
      }
      
      const result = await response.text();
      console.log('Workflow updated successfully:', result);
      
      // Create activity record for push forward/backward action
      try {
        const activityComment = customComment || `Workflow ${workflowAction} action: ${workflowAction === 'forward' ? 'Pushed forward' : 'Pushed backward'} by ${user?.roleCode || 'User'} (${user?.email || ''})`;
        
        const formData = new FormData();
        formData.append('subject', workflowAction === 'forward' ? 'Push Forward' : 'Push Backward');
        formData.append('comments', activityComment);
        formData.append('activityType', 'LoanApplication');
        formData.append('activityParam', loanData.customerID);
        formData.append('createdBy', user?.email || '');
        formData.append('attachments', 'string');
        
        const token = await AuthService.getValidToken();
        const activityResponse = await fetch(
          `${API_CONFIG.baseUrl}/api/V2/ActivityHistory/createActivity`,
          {
            method: 'POST',
            headers: {
              'Accept': 'text/plain',
              'Authorization': `Bearer ${token}`
            },
            body: formData
          }
        );
        
        if (activityResponse.ok) {
          console.log('Activity record created successfully for workflow action');
        } else {
          console.error('Failed to create activity record:', activityResponse.statusText);
        }
      } catch (error) {
        console.error('Error creating activity record:', error);
      }
      
      toast.success(`Loan application ${workflowAction}ed successfully`);
      
      // Trigger callback to refresh data
      if (onActivityCreated) {
        onActivityCreated();
      }
      
      return true;
    } catch (error) {
      console.error('Error updating workflow:', error);
      toast.error('An error occurred while updating the workflow');
      return false;
    } finally {
      setIsUpdatingWorkflow(false);
    }
  };

  const handleApprovalConfirm = async (comment: string) => {
    // Handle the approval action here
    console.log('Approval comment:', comment);
    console.log('SSO submitting loan for approval with comment');
    
    // Create FormData for multipart/form-data request
    const formData = new FormData();
    formData.append('subject', 'Recommend for Approval');
    formData.append('comments', comment || 'Loan Application SSO Comment');
    formData.append('activityType', 'LoanApplication');
    formData.append('activityParam', loanData?.customerID || '');
    formData.append('createdBy', user?.email || '');
    formData.append('attachments', 'string');
    
    try {
      const token = await AuthService.getValidToken();
      const response = await fetch(
        `${API_CONFIG.baseUrl}/api/V2/ActivityHistory/createActivity`,
        {
          method: 'POST',
          headers: {
            'Accept': 'text/plain',
            'Authorization': `Bearer ${token}`
          },
          body: formData
        }
      );
      
      if (response.ok) {
        console.log('Approval activity recorded successfully');
        toast.success('Loan application submitted for approval successfully');
        
        // Trigger callback to refresh ActivityHistory
        if (onActivityCreated) {
          onActivityCreated();
        }
      } else {
        console.error('Failed to record approval activity');
        toast.error('Failed to submit loan application for approval. Please try again.');
      }
    } catch (error) {
      console.error('Error recording approval activity:', error);
      toast.error('An error occurred while submitting the loan application for approval');
    }
  };


  // Determine workflow progress based on workFlowStatus and user role
  const getWorkflowStages = () => {
    const workFlowStatus = loanData?.workFlowStatus?.toLowerCase() || '';
    const loanStatus = loanData?.status?.toLowerCase() || '';
    const userRole = user?.roleCode || '';
    
    console.log('Getting workflow stages:', { workFlowStatus, loanStatus, userRole });
    
    const stages = [
      {
        id: 'sso',
        name: 'SSO',
        role: 'Credit Support Officer',
        icon: UserIcon,
        state: 'locked' as 'completed' | 'active' | 'locked',
      },
      {
        id: 'cro',
        name: 'CRO',
        role: 'Credit Risk Officer', 
        icon: UserIcon,
        state: 'locked' as 'completed' | 'active' | 'locked',
      },
      {
        id: 'cam',
        name: 'CAM',
        role: 'Credit Administration Manager',
        icon: UserIcon,
        state: 'locked' as 'completed' | 'active' | 'locked',
      }
    ];

    // Check both workFlowStatus and status fields for workflow state
    const isNew = workFlowStatus === 'new' || loanStatus === 'new';
    const isInProgress = workFlowStatus === 'Inprogress' || workFlowStatus === 'inprogress' || 
                        loanStatus === 'Inprogress' || loanStatus === 'in-progress';
    const isReadyToDisburse = workFlowStatus === 'ready to disburse' || workFlowStatus === 'readytodisburse' ||
                             loanStatus === 'ready to disburse' || loanStatus === 'ready';
    const isApproved = workFlowStatus === 'approved' || loanStatus === 'approved' || loanStatus === 'disbursed';
    const isDeclined = workFlowStatus === 'declined' || loanStatus === 'declined';

    // Determine stage states based on status and current user
    if (isNew) {
      // NEW: SSO is active, others are locked
      stages[0].state = userRole === 'SSO' ? 'active' : 'locked';
      stages[1].state = 'locked';
      stages[2].state = 'locked';
    } else if (isInProgress) {
      // IN PROGRESS: SSO has pushed forward (completed), CRO or CAM is active
      stages[0].state = 'completed'; // SSO has completed their part
      
      // Determine if we're at CRO or CAM stage based on role access
      // When CRO pushes forward, both SSO and CRO should show as completed
      if (userRole === 'SSO') {
        // SSO sees their stage as completed and CRO as active/locked
        stages[1].state = 'locked';
        stages[2].state = 'locked';
      } else if (userRole === 'CRO') {
        // CRO is active if they haven't pushed forward yet
        stages[1].state = 'active';
        stages[2].state = 'locked';
      } else if (userRole === 'CAM') {
        // If CAM can see it, CRO must have pushed forward
        stages[1].state = 'completed'; // CRO has completed
        stages[2].state = 'active'; // CAM is now active
      } else {
        // For other roles
        stages[1].state = 'locked';
        stages[2].state = 'locked';
      }
    } else if (isReadyToDisburse) {
      // READY TO DISBURSE: All approval stages completed
      stages[0].state = 'completed';
      stages[1].state = 'completed';
      stages[2].state = 'completed';
    } else if (isApproved) {
      // APPROVED: All stages completed
      stages[0].state = 'completed';
      stages[1].state = 'completed';
      stages[2].state = 'completed';
    } else if (isDeclined) {
      // DECLINED: Show completed stages up to decline point
      stages[0].state = 'completed';
      // Determine which stage declined
      if (userRole === 'CRO' || userRole === 'CAM') {
        stages[1].state = 'completed';
      } else {
        stages[1].state = 'locked';
      }
      stages[2].state = 'locked';
    } else {
      // Default: NEW state for SSO
      stages[0].state = userRole === 'SSO' ? 'active' : 'locked';
      stages[1].state = 'locked';
      stages[2].state = 'locked';
    }

    return stages;
  };

  const WorkflowProgress = () => {
    const stages = getWorkflowStages();
    const workFlowStatus = loanData?.workFlowStatus?.toLowerCase() || '';
    const loanStatus = loanData?.status?.toLowerCase() || '';
    const userRole = user?.roleCode || '';
    
    // Get current workflow stage description
    const getCurrentStageDescription = () => {
      const isNew = workFlowStatus === 'new' || loanStatus === 'new';
      const isInProgress = workFlowStatus === 'in progress' || workFlowStatus === 'inprogress' || 
                          loanStatus === 'in progress' || loanStatus === 'in-progress';
      const isReadyToDisburse = workFlowStatus === 'ready to disburse' || workFlowStatus === 'readytodisburse' ||
                               loanStatus === 'ready to disburse' || loanStatus === 'ready';
      const isApproved = workFlowStatus === 'approved' || loanStatus === 'approved' || loanStatus === 'disbursed';
      const isDeclined = workFlowStatus === 'declined' || loanStatus === 'declined';
      
      if (isNew) return userRole === 'SSO' ? 'Awaiting Your Review (SSO)' : 'Awaiting SSO Review';
      if (isInProgress) {
        if (userRole === 'CRO') return 'Under Your Review (CRO)';
        if (userRole === 'CAM') return 'Under Your Review (CAM)';
        return 'Under Review';
      }
      if (isReadyToDisburse) return userRole === 'SSO' ? 'Ready for Your Disbursement' : 'Ready for Disbursement';
      if (isApproved) return 'Loan Approved';
      if (isDeclined) return 'Application Declined';
      return 'Processing';
    };
    
    const getStatusBadgeColor = () => {
      const isApproved = workFlowStatus === 'approved' || loanStatus === 'approved' || loanStatus === 'disbursed';
      const isDeclined = workFlowStatus === 'declined' || loanStatus === 'declined';
      const isReadyToDisburse = workFlowStatus === 'ready to disburse' || workFlowStatus === 'readytodisburse' ||
                               loanStatus === 'ready to disburse' || loanStatus === 'ready';
      
      if (isApproved) return 'bg-green-100 text-green-700';
      if (isDeclined) return 'bg-red-100 text-red-700';
      if (isReadyToDisburse) return 'bg-blue-100 text-blue-700';
      return 'bg-yellow-100 text-yellow-700';
    };
    
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 mt-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-gray-800">Application Workflow</h3>
          <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeColor()}`}>
            {getCurrentStageDescription()}
          </span>
        </div>
        <div className="relative">
          {/* Progress Lines Container */}
          <div className="absolute top-5 left-0 right-0 flex items-center px-5">
            {/* First connecting line (SSO to CRO) */}
            <div className="flex-1 flex items-center">
              <div className="w-5" /> {/* Half of circle width */}
              <div className={`flex-1 h-0.5 transition-all ${
                stages[0].state === 'completed' ? 'bg-green-500' : 'bg-gray-200'
              }`} />
              <div className="w-5" /> {/* Half of circle width */}
            </div>
            {/* Second connecting line (CRO to CAM) */}
            <div className="flex-1 flex items-center">
              <div className="w-5" /> {/* Half of circle width */}
              <div className={`flex-1 h-0.5 transition-all ${
                stages[1].state === 'completed' ? 'bg-green-500' : 'bg-gray-200'
              }`} />
              <div className="w-5" /> {/* Half of circle width */}
            </div>
          </div>
          
          {/* Progress Indicators */}
          <div className="relative flex items-center justify-between">
            {stages.map((stage) => (
              <div key={stage.id} className="flex flex-col items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center transition-all relative z-10
                  ${stage.state === 'completed' 
                    ? 'bg-green-500 text-white' 
                    : stage.state === 'active'
                    ? 'bg-secondary-200 text-white animate-pulse'
                    : 'bg-gray-200 text-gray-400'
                  }
                `}>
                  {stage.state === 'completed' ? (
                    <CheckIcon className="w-5 h-5" />
                  ) : stage.state === 'active' ? (
                    <ClockIcon className="w-5 h-5" />
                  ) : (
                    <LockClosedIcon className="w-4 h-4" />
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p className={`text-xs font-medium ${
                    stage.state === 'completed' ? 'text-green-600' :
                    stage.state === 'active' ? 'text-secondary-200' : 'text-gray-400'
                  }`}>
                    {stage.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Show message if no loan data
  if (!loanData) {
    return (
      <div className="bg-[#f9f9f9] mt-5 p-4 md:p-5 flex justify-center items-center h-40">
        <p className="text-gray-500">No application details to display</p>
      </div>
    );
  }

  // Check if current user can edit based on workflow stage
  const canEditApplication = () => {
    const workFlowStatus = loanData?.workFlowStatus?.toLowerCase() || '';
    const loanStatus = loanData?.status?.toLowerCase() || '';
    const userRole = user?.roleCode || '';
    
    console.log('Checking edit permissions:', { workFlowStatus, loanStatus, userRole });
    
    // Check both workFlowStatus and status fields
    const isNew = workFlowStatus === 'new' || loanStatus === 'new';
    const isInProgress = workFlowStatus === 'in progress' || workFlowStatus === 'inprogress' || 
                        loanStatus === 'in progress' || loanStatus === 'in-progress';
    const isReadyToDisburse = workFlowStatus === 'ready to disburse' || workFlowStatus === 'readytodisburse' ||
                             loanStatus === 'ready to disburse' || loanStatus === 'ready';
    const isDeclined = workFlowStatus === 'declined' || loanStatus === 'declined';
    const isApproved = workFlowStatus === 'approved' || loanStatus === 'approved' || loanStatus === 'disbursed';
    
    if (isNew) return userRole === 'SSO';
    if (isInProgress) {
      // Once in progress (CRO has pushed forward), lock all parameter editing
      // SSO and CRO cannot edit parameters once workflow is in progress
      return false;
    }
    if (isReadyToDisburse) return false; // All fields locked at this stage
    if (isDeclined) return userRole === 'SSO'; // Only SSO can rework
    if (isApproved) return false; // No edits after approval
    
    // Default to locked
    return false;
  };

  const getActionButtons = () => {
    const workFlowStatus = loanData?.workFlowStatus?.toLowerCase() || '';
    const loanStatus = loanData?.status?.toLowerCase() || '';
    const userRole = user?.roleCode || '';
    
    console.log('Getting action buttons - Raw data:', { 
      rawWorkFlowStatus: loanData?.workFlowStatus, 
      rawStatus: loanData?.status, 
      rawUserRole: user?.roleCode 
    });
    console.log('Getting action buttons - Processed:', { workFlowStatus, loanStatus, userRole });
    
    // Check both workFlowStatus and status fields
    const isNew = workFlowStatus === 'new' || loanStatus === 'new' || 
                  workFlowStatus === 'pending' || loanStatus === 'pending' ||
                  workFlowStatus === 'submitted' || loanStatus === 'submitted';
    const isInProgress = workFlowStatus === 'in progress' || workFlowStatus === 'inprogress' || 
                        loanStatus === 'in progress' || loanStatus === 'in-progress';
    
    console.log('Status checks:', { 
      isNew, 
      isInProgress,
      workFlowStatusMatch: workFlowStatus === 'new',
      loanStatusMatch: loanStatus === 'new',
      userRoleMatch: userRole === 'SSO'
    });
    
    const isReadyToDisburse = workFlowStatus === 'ready to disburse' || workFlowStatus === 'readytodisburse' ||
                             loanStatus === 'ready to disburse' || loanStatus === 'ready';
    const isDeclined = workFlowStatus === 'declined' || loanStatus === 'declined';
    const isApproved = workFlowStatus === 'approved' || loanStatus === 'approved' || loanStatus === 'disbursed';
    
    // WorkFlowStatus: NEW - Only SSO can act
    if (isNew) {
      if (userRole === 'SSO') {
        const buttons = [
          {
            id: 'approval',
            icon: <HandThumbUpIcon className="w-5 h-5" />,
            tooltip: 'Submit for Approval',
            enabled: true,
          },
          {
            id: 'decline',
            icon: <HandThumbDownIcon className="w-5 h-5" />,
            tooltip: 'Decline Application',
            enabled: true,
          },
          {
            id: 'push-forward',
            icon: <ArrowRightIcon className="w-[18px] h-[18px]" />,
            tooltip: 'Push Forward to CRO',
            enabled: true,
          }
        ];
        console.log('Returning SSO buttons for NEW status:', buttons);
        return buttons;
      }
      // CRO and CAM see locked buttons
      return [
        {
          id: 'locked-approval',
          icon: <LockClosedIcon className="w-4 h-4" />,
          tooltip: 'Locked - SSO Stage',
          enabled: false,
        },
        {
          id: 'locked-decline',
          icon: <LockClosedIcon className="w-4 h-4" />,
          tooltip: 'Locked - SSO Stage',
          enabled: false,
        },
        {
          id: 'locked-forward',
          icon: <LockClosedIcon className="w-4 h-4" />,
          tooltip: 'Locked - SSO Stage',
          enabled: false,
        }
      ];
    }
    
    // WorkFlowStatus: IN PROGRESS - Depends on current workflow stage
    if (isInProgress) {
      if (userRole === 'CRO') {
        return [
          {
            id: 'push-forward',
            icon: <ArrowRightIcon className="w-5 h-5" />,
            tooltip: 'Push Forward to CAM',
            enabled: true,
          },
          {
            id: 'push-backward',
            icon: <ArrowLeftIcon className="w-[18px] h-[18px]" />,
            tooltip: 'Push Backward to SSO',
            enabled: true,
          },
          {
            id: 'decline',
            icon: <HandThumbDownIcon className="w-5 h-5" />,
            tooltip: 'Decline Application',
            enabled: true,
          }
        ];
      }
      
      if (userRole === 'CAM') {
        return [
          {
            id: 'push-forward',
            icon: <ArrowRightIcon className="w-5 h-5" />,
            tooltip: 'Push Forward (Approve for Disbursement)',
            enabled: true,
          },
          {
            id: 'push-backward',
            icon: <ArrowLeftIcon className="w-[18px] h-[18px]" />,
            tooltip: 'Push Backward to CRO',
            enabled: true,
          },
          {
            id: 'decline',
            icon: <HandThumbDownIcon className="w-5 h-5" />,
            tooltip: 'Decline Application',
            enabled: true,
          }
        ];
      }
      
      // SSO sees locked buttons during CRO/CAM review
      return [
        {
          id: 'locked-review',
          icon: <LockClosedIcon className="w-4 h-4" />,
          tooltip: `Locked - Under ${userRole === 'SSO' ? 'CRO/CAM' : 'Other Role'} Review`,
          enabled: false,
        }
      ];
    }
    
    // WorkFlowStatus: READY TO DISBURSE - Only SSO can disburse
    if (isReadyToDisburse) {
      if (userRole === 'SSO') {
        return [
          {
            id: 'disburse',
            icon: <HandThumbUpIcon className="w-5 h-5" />,
            tooltip: 'Disburse Loan',
            enabled: true,
          },
          {
            id: 'decline-disbursement',
            icon: <HandThumbDownIcon className="w-5 h-5" />,
            tooltip: 'Decline Disbursement',
            enabled: true,
          }
        ];
      }
      // CRO and CAM see locked buttons
      return [
        {
          id: 'locked-disburse',
          icon: <LockClosedIcon className="w-4 h-4" />,
          tooltip: 'Locked - Awaiting SSO Disbursement',
          enabled: false,
        }
      ];
    }
    
    // WorkFlowStatus: DECLINED - Only SSO can rework
    if (isDeclined) {
      if (userRole === 'SSO') {
        return [
          {
            id: 'rework',
            icon: <HandThumbUpIcon className="w-5 h-5" />,
            tooltip: 'Rework and Resubmit',
            enabled: true,
          }
        ];
      }
      // CRO and CAM see locked buttons
      return [
        {
          id: 'locked-rework',
          icon: <LockClosedIcon className="w-4 h-4" />,
          tooltip: 'Locked - SSO Rework Required',
          enabled: false,
        }
      ];
    }
    
    // WorkFlowStatus: APPROVED - All locked
    if (isApproved) {
      return [
        {
          id: 'locked-approved',
          icon: <LockClosedIcon className="w-4 h-4" />,
          tooltip: 'Loan Approved - No Further Actions',
          enabled: false,
        }
      ];
    }
    
    // Default fallback - show SSO actions for unclear status
    if (userRole === 'SSO') {
      console.log('Fallback: Returning default SSO buttons');
      return [
        {
          id: 'approval',
          icon: <HandThumbUpIcon className="w-5 h-5" />,
          tooltip: 'Submit for Approval',
          enabled: true,
        },
        {
          id: 'decline',
          icon: <HandThumbDownIcon className="w-5 h-5" />,
          tooltip: 'Decline Application',
          enabled: true,
        },
        {
          id: 'push-forward',
          icon: <FileOutputIcon className="w-[18px] h-[18px]" />,
          tooltip: 'Push Forward to CRO',
          enabled: true,
        }
      ];
    }
    
    const defaultButtons = [
      {
        id: 'locked-default',
        icon: <LockClosedIcon className="w-4 h-4" />,
        tooltip: 'No Actions Available',
        enabled: false,
      }
    ];
    
    console.log('Final fallback: Returning locked buttons');
    return defaultButtons;
  };

  return (
    <>
      <div className="my-6">
        {isLoadingLoans && loans.length === 0 ? (
          <div className="flex justify-center py-4">
            <Loader2 className="animate-spin w-6 h-6 text-secondary-200" />
          </div>
        ) : error && loans.length === 0 ? (
          <div className="p-3 bg-warning-50 text-warning-400 rounded text-sm">
            {error}
          </div>
        ) : (
          <Select
            options={loans}
            selectedValue={selectedLoan}
            placeholder="Select Application"
            onChange={handleLoanChange}
            buttonStyle="!border-[#eee]"
          />
        )}
      </div>

      <div className={`mt-5 p-3 md:p-5 ${canEditApplication() ? 'bg-[#f9f9f9]' : 'bg-gray-50'}`}>
        <div className="flex items-center justify-between mb-3">
          <StatusChip status={getLoanStatus(loanData.status)} />
          {!canEditApplication() && (
            <div className="flex items-center gap-1.5 text-gray-500 text-xs">
              <LockClosedIcon className="w-3.5 h-3.5" />
              <span>Read Only</span>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-3.5">
          <div className="space-y-0.5">
            <p className="text-xs text-gray-400">Loan Application Amount</p>
            <p className="font-semibold text-gray-800">
              {formatCurrency(loanData.amount)}
            </p>
          </div>
          <div className="space-y-1.5">
            <p className="text-xs text-gray-400">Adjusted Loan Amount</p>
            <div className="relative text-sm md:text-[15px]">
              <input
                type="text"
                className={`w-full border text-gray-800 border-[#eee] rounded-lg px-3.5 py-2 text-base outline-none ${
                  !canEditApplication() ? 'disabled:bg-white disabled:cursor-not-allowed' : ''
                }`}
                inputMode="numeric"
                pattern="\d*"
                value={adjustedValue}
                onChange={handleChange}
                disabled={!canEditApplication()}
                readOnly={!canEditApplication()}
              />
              <span className="absolute text-sm md:text-base top-3 md:top-2 right-3.5 text-gray-600 font-medium">
                NGN
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-4 mt-5">
          <div className="col-span-2 grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex gap-1.5 items-center text-gray-400">
                {!canEditApplication() && <LockClosedIcon className="w-3.5 h-3.5" />}
                <p className="text-xs">Daily Rate %</p>
              </div>
              <div className="flex items-center gap-1.5">
                {isLoadingInterestRate ? (
                  <div className="w-full border text-gray-800 border-[#eee] rounded-lg px-3.5 py-2 text-base outline-none flex items-center justify-center">
                    <Loader2 className="animate-spin w-6 h-6 text-secondary-200" />
                  </div>
                ) : (
                  <input
                    type="text"
                    className={`w-full border text-gray-800 border-[#eee] rounded-lg px-3.5 py-2 text-base outline-none ${
                      !canEditApplication() ? 'disabled:bg-white disabled:cursor-not-allowed' : ''
                    }`}
                    inputMode="decimal"
                    value={interestRate}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow only numbers and decimal point
                      if (/^\d*\.?\d*$/.test(value)) {
                        setInterestRate(value);
                      }
                    }}
                    disabled={!canEditApplication()}
                    readOnly={!canEditApplication()}
                  />
                )}
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex gap-1.5 items-center text-gray-400">
                <LockClosedIcon className="w-3.5 h-3.5" />
                <p className="text-xs">Monthly Rate %</p>
              </div>
              <div className="flex items-center gap-1.5">
                {isLoadingInterestRate ? (
                  <div className="w-full border text-gray-800 border-[#eee] rounded-lg px-3.5 py-2 text-base outline-none flex items-center justify-center">
                    <Loader2 className="animate-spin w-6 h-6 text-secondary-200" />
                  </div>
                ) : (
                  <input
                    type="text"
                    className="w-full border text-gray-800 border-[#eee] rounded-lg px-3.5 py-2 text-base outline-none disabled:bg-white disabled:cursor-not-allowed"
                    inputMode="decimal"
                    value={displayInterestRate}
                    disabled
                    readOnly
                  />
                )}
              </div>
            </div>
          </div>
          <div className="col-span-2 grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <p className="text-xs text-gray-400">Tenure (Months)</p>
              <select
                className={`w-full border text-gray-800 border-[#eee] rounded-lg px-3.5 py-2 text-base outline-none text-[15px] ${
                  !canEditApplication() ? 'disabled:bg-white disabled:cursor-not-allowed' : ''
                }`}
                value={tenureMonths}
                onChange={handleTenureMonthsChange}
                disabled={!canEditApplication()}
              >
                {loanTenureOptions.length > 0 ? (
                  loanTenureOptions.map((month) => (
                    <option key={month} value={month}>
                      {month} {Number(month) === 1 ? 'Month' : 'Months'}
                    </option>
                  ))
                ) : (
                  // Fallback if no options loaded
                  Array.from({ length: 36 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={month}>
                      {month} {month === 1 ? 'Month' : 'Months'}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs text-gray-400">Tenure (Days)</p>
              <input
                type="text"
                className="w-full border text-gray-800 border-[#eee] rounded-lg px-3.5 py-2 text-base outline-none disabled:bg-white disabled:cursor-not-allowed"
                value={tenureDays}
                disabled
                readOnly
              />
            </div>
          </div>
          <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <p className="text-xs text-gray-400">Monthly Repayment Amount</p>
              <div className="relative text-[15px]">
                <input
                  type="text"
                  className="w-full border text-gray-800 border-[#eee] rounded-lg px-3.5 py-2 text-base outline-none disabled:bg-white disabled:cursor-not-allowed"
                  inputMode="numeric"
                  pattern="\d*"
                  value={monthlyRepayment}
                  readOnly
                />
                <span className="absolute top-2 right-3.5 text-gray-600 font-medium">
                  NGN
                </span>
              </div>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs text-gray-400">Number of Installments</p>
              <input
                type="text"
                className="w-full border text-gray-800 border-[#eee] rounded-lg px-3.5 py-2 text-base outline-none disabled:bg-white disabled:cursor-not-allowed"
                value={tenureMonths}
                disabled
                readOnly
              />
            </div>
          </div>
        </div>
      </div>

      <WorkflowProgress />

      <div className="flex flex-col gap-4 items-end my-5">
        <div className="flex gap-3 flex-wrap justify-end">
          {getActionButtons().map(({ id, icon, tooltip, enabled }) => (
            <Tooltip key={id} content={tooltip}>
              <button
                className={`text-sm w-10 h-10 flex items-center justify-center rounded-full outline-0 transition-all 
                ${
                  !enabled || isUpdatingWorkflow
                    ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                    : activeButton === id
                    ? 'bg-secondary-200 text-white'
                    : 'bg-[#f4f4f4] text-gray-200 hover:bg-secondary-50 hover:text-secondary-200'
                }`}
                onClick={async () => {
                  console.log('Button clicked:', { id, enabled, isUpdatingWorkflow });
                  if (!enabled || isUpdatingWorkflow) {
                    console.log('Button click blocked:', { enabled, isUpdatingWorkflow });
                    return;
                  }
                  
                  // Handle decline actions
                  if (id === 'decline' || id === 'decline-disbursement') {
                    setIsDeclineModalOpen(true);
                  }
                  // Handle approval action
                  else if (id === 'approval') {
                    // Direct approval without modal
                    const approvalComment = `Loan Application for ${loanData?.customerName || 'Customer'} - Amount: ${formatCurrency(loanData?.amount)} recommended for approval by SSO`;
                    handleApprovalConfirm(approvalComment);
                  }
                  // Handle Push Forward actions
                  else if (id === 'push-forward') {
                    // Check if loanData exists
                    if (!loanData) {
                      console.error('No loan data available');
                      toast.error('No loan data available. Please refresh the page.');
                      return;
                    }
                    
                    const workFlowStatus = loanData.workFlowStatus?.toLowerCase() || '';
                    const userRole = user?.roleCode || '';
                    
                    console.log('Forward button clicked - Full Debug Info:', { 
                      loanData: loanData,
                      loanDataKeys: Object.keys(loanData || {}),
                      workFlowStatus, 
                      userRole, 
                      loanDataId: loanData.id,
                      rawWorkFlowStatus: loanData.workFlowStatus,
                      status: loanData.status,
                      hasUser: !!user,
                      userObject: user,
                      userRoleCode: user?.roleCode,
                      workFlowStatusLowercase: workFlowStatus,
                      isNewCheck: workFlowStatus === 'new',
                      isSSO: userRole === 'SSO',
                      shouldForwardWork: (workFlowStatus === 'new' && userRole === 'SSO')
                    });
                    
                    if ((workFlowStatus === 'new' || workFlowStatus === 'pending' || workFlowStatus === 'submitted') && userRole === 'SSO') {
                      console.log('SSO pushing forward to CRO (New → In Progress)');
                      const comment = `Loan Application for ${loanData.customerName || 'Customer'} - Amount: ${formatCurrency(loanData.amount)} pushed forward to CRO for review by SSO (${user?.email || ''})`;
                      const success = await updateLoanWorkflow('forward', 'InProgress', comment);
                      console.log('Forward workflow result:', success);
                    } else if ((workFlowStatus === 'inprogress' || workFlowStatus === 'in progress') && userRole === 'CRO') {
                      console.log('CRO pushing forward to CAM (stays In Progress but opens to CAM)');
                      const comment = `Loan Application for ${loanData.customerName || 'Customer'} - Amount: ${formatCurrency(loanData.amount)} pushed forward to CAM for final approval by CRO (${user?.email || ''})`;
                      const success = await updateLoanWorkflow('forward', 'InProgress', comment);
                      console.log('Forward workflow result:', success);
                    } else if ((workFlowStatus === 'inprogress' || workFlowStatus === 'in progress') && userRole === 'CAM') {
                      console.log('CAM pushing forward (Approve for Disbursement)');
                      const comment = `Loan Application for ${loanData.customerName || 'Customer'} - Amount: ${formatCurrency(loanData.amount)} approved for disbursement by CAM (${user?.email || ''})`;
                      const success = await updateLoanWorkflow('forward', 'ReadyToDisburse', comment);
                      console.log('Forward workflow result:', success);
                    } else {
                      console.log('No matching workflow condition found - Detailed Analysis:', { 
                        workFlowStatus, 
                        userRole,
                        rawWorkFlowStatus: loanData?.workFlowStatus,
                        rawStatus: loanData?.status,
                        conditions: {
                          isSSO: userRole === 'SSO',
                          isNewStatus: workFlowStatus === 'new',
                          isPendingStatus: workFlowStatus === 'pending',
                          isSubmittedStatus: workFlowStatus === 'submitted',
                          isInProgressStatus: workFlowStatus === 'inprogress',
                          isInProgressWithSpace: workFlowStatus === 'in progress',
                          condition1: (workFlowStatus === 'new' || workFlowStatus === 'pending' || workFlowStatus === 'submitted'),
                          condition1AndSSO: (workFlowStatus === 'new' || workFlowStatus === 'pending' || workFlowStatus === 'submitted') && userRole === 'SSO',
                          condition2: (workFlowStatus === 'inprogress' || workFlowStatus === 'in progress'),
                          condition2AndCRO: (workFlowStatus === 'inprogress' || workFlowStatus === 'in progress') && userRole === 'CRO',
                          condition3AndCAM: (workFlowStatus === 'inprogress' || workFlowStatus === 'in progress') && userRole === 'CAM'
                        }
                      });
                      const errorMsg = `Cannot forward loan. Current Role: ${userRole || 'No Role'}, WorkFlow Status: ${loanData?.workFlowStatus || 'No WorkFlow Status'}, Status: ${loanData?.status || 'No Status'}`;
                      toast.error(errorMsg);
                      console.error(errorMsg);
                    }
                    setActiveButton(null);
                  }
                  // Handle Push Backward actions
                  else if (id === 'push-backward') {
                    const userRole = user?.roleCode || '';
                    
                    if (userRole === 'CRO') {
                      console.log('CRO pushing backward to SSO (In Progress → New)');
                      const comment = `Loan Application for ${loanData?.customerName || 'Customer'} - Amount: ${formatCurrency(loanData?.amount)} pushed backward to SSO for review/revision by CRO (${user?.email || ''})`;
                      await updateLoanWorkflow('backward', 'New', comment);
                    } else if (userRole === 'CAM') {
                      console.log('CAM pushing backward to CRO (stays In Progress but opens to CRO)');
                      const comment = `Loan Application for ${loanData?.customerName || 'Customer'} - Amount: ${formatCurrency(loanData?.amount)} pushed backward to CRO for re-review by CAM (${user?.email || ''})`;
                      await updateLoanWorkflow('backward', 'InProgress', comment);
                    }
                    setActiveButton(null);
                  }
                  // Handle disbursement
                  else if (id === 'disburse') {
                    console.log('SSO disbursing loan');
                    // TODO: Implement disbursal modal/confirmation
                    setActiveButton(activeButton === id ? null : id);
                  }
                  // Handle rework
                  else if (id === 'rework') {
                    console.log('SSO reworking declined application');
                    const comment = `Loan Application for ${loanData?.customerName || 'Customer'} - Amount: ${formatCurrency(loanData?.amount)} reworked and resubmitted by SSO (${user?.email || ''})`;
                    await updateLoanWorkflow('forward', 'New', comment);
                    setActiveButton(null);
                  }
                  else {
                    // Default action
                    setActiveButton(activeButton === id ? null : id);
                  }
                }}
                disabled={!enabled || isUpdatingWorkflow}
              >
                {isUpdatingWorkflow && (id === 'push-forward' || id === 'push-backward' || id === 'rework') ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  icon
                )}
              </button>
            </Tooltip>
          ))}
        </div>
      </div>

      <UploadDocument
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleFileUpload}
      />
      
      <LoanDeclineModal
        isOpen={isDeclineModalOpen}
        onClose={() => setIsDeclineModalOpen(false)}
        onConfirm={handleDeclineConfirm}
      />
    </>
  );
};

export default Details;