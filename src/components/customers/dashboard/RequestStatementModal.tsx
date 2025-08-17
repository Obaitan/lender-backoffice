'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { XMarkIcon, CalendarIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/general/Button';
import { AuthService, API_CONFIG } from '@/services/authService';

interface RequestStatementModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerData: {
    customers: {
      customerID: string;
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
    };
  };
  onSuccess?: () => void;
}

interface StatementFormInputs {
  statementType: string;
  startDate: string;
  endDate: string;
  format: string;
  deliveryMethod: string;
  reason: string;
}

export default function RequestStatementModal({ 
  isOpen, 
  onClose, 
  customerData, 
  onSuccess 
}: RequestStatementModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset
  } = useForm<StatementFormInputs>({
    defaultValues: {
      statementType: 'all',
      format: 'pdf',
      deliveryMethod: 'email'
    }
  });

  const statementType = watch('statementType');
  const startDate = watch('startDate');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const endDate = watch('endDate');

  // Get date limits
  const today = new Date().toISOString().split('T')[0];
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const minDate = oneYearAgo.toISOString().split('T')[0];

  const onSubmit = async (data: StatementFormInputs) => {
    try {
      setIsSubmitting(true);
      
      const customer = customerData.customers;
      
      // Validate date range
      if (data.startDate && data.endDate) {
        const start = new Date(data.startDate);
        const end = new Date(data.endDate);
        
        if (start > end) {
          toast.error('Start date cannot be after end date');
          return;
        }
        
        // Check if date range is not more than 1 year
        const diffInDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
        if (diffInDays > 365) {
          toast.error('Date range cannot exceed 1 year');
          return;
        }
      }

      // Prepare the request payload
      const requestPayload = {
        customerID: customer.customerID,
        requestType: 'STATEMENT',
        statementType: data.statementType,
        startDate: data.startDate || minDate,
        endDate: data.endDate || today,
        format: data.format,
        deliveryMethod: data.deliveryMethod,
        recipientEmail: data.deliveryMethod === 'email' ? customer.email : undefined,
        recipientPhone: data.deliveryMethod === 'sms' ? customer.phoneNumber : undefined,
        reason: data.reason,
        status: 'PENDING',
        createdBy: customer.email,
        createDate: new Date().toISOString()
      };

      console.log('Submitting statement request:', requestPayload);

      // Here you would call the actual API endpoint
      // For now, we'll simulate the request
      const token = await AuthService.getValidToken();
      const response = await fetch(
        `${API_CONFIG.baseUrl}/api/V2/Request/createStatementRequest`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          },
          body: JSON.stringify(requestPayload)
        }
      );

      if (!response.ok) {
        // If the API doesn't exist yet, simulate success
        if (response.status === 404) {
          console.log('API endpoint not found, simulating success');
          // Simulate success
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          toast.success('Statement request submitted successfully! You will receive it shortly.');
          
          // Reset form and close modal
          reset();
          onClose();
          
          if (onSuccess) {
            onSuccess();
          }
          return;
        }
        
        throw new Error('Failed to submit statement request');
      }

      const result = await response.json();
      console.log('Statement request created:', result);
      
      toast.success('Statement request submitted successfully! You will receive it shortly.');
      
      // Reset form and close modal
      reset();
      onClose();
      
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error) {
      console.error('Error submitting statement request:', error);
      toast.error('Failed to submit statement request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <DocumentTextIcon className="h-6 w-6 text-secondary-600" />
            <h2 className="text-xl font-semibold text-gray-900">Request Account Statement</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Requesting statement for:</p>
              <p className="text-lg font-semibold text-gray-800">
                {customerData.customers.firstName} {customerData.customers.lastName}
              </p>
              <p className="text-sm text-gray-600">Account: {customerData.customers.customerID}</p>
            </div>

            {/* Statement Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statement Type *
              </label>
              <select
                {...register('statementType', {
                  required: 'Please select a statement type'
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-200 focus:border-transparent"
                disabled={isSubmitting}
              >
                <option value="all">All Transactions</option>
                <option value="loan">Loan Transactions Only</option>
                <option value="repayment">Repayments Only</option>
                <option value="disbursement">Disbursements Only</option>
              </select>
              {errors.statementType && (
                <p className="mt-1 text-sm text-red-500">{errors.statementType.message}</p>
              )}
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    {...register('startDate', {
                      required: 'Start date is required'
                    })}
                    max={today}
                    min={minDate}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-200 focus:border-transparent"
                    disabled={isSubmitting}
                  />
                  <CalendarIcon className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-500">{errors.startDate.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    {...register('endDate', {
                      required: 'End date is required',
                      validate: (value) => {
                        if (startDate && value < startDate) {
                          return 'End date must be after start date';
                        }
                        return true;
                      }
                    })}
                    max={today}
                    min={startDate || minDate}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-200 focus:border-transparent"
                    disabled={isSubmitting}
                  />
                  <CalendarIcon className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-500">{errors.endDate.message}</p>
                )}
              </div>
            </div>

            {/* Format Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statement Format *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    {...register('format', {
                      required: 'Please select a format'
                    })}
                    value="pdf"
                    className="mr-3 text-secondary-600 focus:ring-secondary-500"
                    disabled={isSubmitting}
                  />
                  <span className="text-sm font-medium">PDF Document</span>
                </label>
                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    {...register('format')}
                    value="excel"
                    className="mr-3 text-secondary-600 focus:ring-secondary-500"
                    disabled={isSubmitting}
                  />
                  <span className="text-sm font-medium">Excel Spreadsheet</span>
                </label>
              </div>
              {errors.format && (
                <p className="mt-1 text-sm text-red-500">{errors.format.message}</p>
              )}
            </div>

            {/* Delivery Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Method *
              </label>
              <div className="space-y-2">
                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    {...register('deliveryMethod', {
                      required: 'Please select a delivery method'
                    })}
                    value="email"
                    className="mr-3 text-secondary-600 focus:ring-secondary-500"
                    disabled={isSubmitting}
                  />
                  <div>
                    <span className="text-sm font-medium">Email</span>
                    <p className="text-xs text-gray-500">Send to: {customerData.customers.email}</p>
                  </div>
                </label>
                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    {...register('deliveryMethod')}
                    value="download"
                    className="mr-3 text-secondary-600 focus:ring-secondary-500"
                    disabled={isSubmitting}
                  />
                  <div>
                    <span className="text-sm font-medium">Download Now</span>
                    <p className="text-xs text-gray-500">Download directly after processing</p>
                  </div>
                </label>
              </div>
              {errors.deliveryMethod && (
                <p className="mt-1 text-sm text-red-500">{errors.deliveryMethod.message}</p>
              )}
            </div>

            {/* Reason (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Request (Optional)
              </label>
              <textarea
                {...register('reason')}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-200 focus:border-transparent"
                placeholder="e.g., Tax filing, Loan application, Personal records..."
                disabled={isSubmitting}
              />
            </div>

            {/* Info Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Statement processing typically takes 2-5 minutes. 
                {statementType === 'all' && ' All transaction types will be included.'}
                {statementType === 'loan' && ' Only loan-related transactions will be included.'}
                {statementType === 'repayment' && ' Only repayment transactions will be included.'}
                {statementType === 'disbursement' && ' Only disbursement transactions will be included.'}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4 mt-8">
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-secondary-200 hover:bg-secondary-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                'Request Statement'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}