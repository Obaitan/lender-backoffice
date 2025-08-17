'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { XMarkIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/general/Button';
import { AuthService, API_CONFIG } from '@/services/authService';
import { Customer } from '@/types';

interface BVNVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  customerData?: Customer | null;
}

interface BVNFormInputs {
  otp: string;
}

export default function BVNVerificationModal({ 
  isOpen, 
  onClose, 
  sessionId,
  customerData 
}: BVNVerificationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<BVNFormInputs>();

  const onSubmit = async (data: BVNFormInputs) => {
    try {
      setIsSubmitting(true);
      
      if (!customerData?.customerID) {
        toast.error('Customer ID not available');
        return;
      }
      
      const token = await AuthService.getValidToken();
      const payload = {
        sessionId: sessionId,
        otp: data.otp,
        customerID: customerData.customerID
      };

      console.log('Verifying BVN with OTP:', payload);

      const response = await fetch(
        `${API_CONFIG.baseUrl}/api/V2/DDSync/bvn-details`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('BVN verification failed:', errorText);
        
        // Try to parse error message
        try {
          const errorData = JSON.parse(errorText);
          toast.error(errorData.message || 'BVN verification failed');
        } catch {
          toast.error('BVN verification failed. Please check your OTP and try again.');
        }
        return;
      }

      const result = await response.json();
      console.log('BVN verification result:', result);
      
      if (result.success) {
        toast.success('BVN verification completed successfully!');
        
        // Reset form and close modal
        reset();
        onClose();
        
        // Optionally refresh the page or update state
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error(result.message || 'BVN verification failed');
      }
      
    } catch (error) {
      console.error('Error verifying BVN:', error);
      toast.error('An error occurred during BVN verification. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <ShieldCheckIcon className="h-6 w-6 text-secondary-600" />
            <h2 className="text-xl font-semibold text-gray-900">Mono BVN Verification</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="space-y-6">
            {/* Customer Info */}
            {customerData && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Verifying for:</p>
                <p className="text-lg font-semibold text-gray-800">
                  {customerData.firstName} {customerData.lastName}
                </p>
                <p className="text-sm text-gray-600">ID: {customerData.customerID}</p>
              </div>
            )}

            {/* Info Message */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Check your phone for an OTP.</strong> Enter the 6-digit code sent to your registered phone number to complete BVN verification.
              </p>
            </div>

            {/* Session Info */}
            <div className="text-center">
              <p className="text-xs text-gray-500">Session ID: {sessionId}</p>
            </div>

            {/* OTP Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP *
              </label>
              <input
                type="text"
                {...register('otp', {
                  required: 'OTP is required',
                  pattern: {
                    value: /^\d{6}$/,
                    message: 'OTP must be 6 digits'
                  }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-200 focus:border-transparent text-center text-lg font-mono tracking-widest"
                placeholder="000000"
                maxLength={6}
                disabled={isSubmitting}
                autoComplete="one-time-code"
              />
              {errors.otp && (
                <p className="mt-1 text-sm text-red-500">{errors.otp.message}</p>
              )}
            </div>

            {/* Help Text */}
            <div className="text-center">
              <p className="text-xs text-gray-600">
                Didn&apos;t receive the OTP? Check your phone or contact support.
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
                  <span>Verifying...</span>
                </div>
              ) : (
                'Verify'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}