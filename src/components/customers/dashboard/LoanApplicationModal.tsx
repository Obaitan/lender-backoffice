'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/general/Button';
import { AuthService, API_CONFIG } from '@/services/authService';
import { fetchSystemParameter, INTEREST_RATE_PARAMETER_ID } from '@/services/apiQueries/systemParametersApi';
import TermsAndConditionsModal from './TermsAndConditionsModal';

interface LoanApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerData: {
    customers: {
      customerID: string;
      firstName: string;
      lastName: string;
      email: string;
    };
  };
  onSuccess?: () => void;
}

interface LoanApplicationFormInputs {
  loanAmount: string;
  loanTenure: string;
  termsAccepted: boolean;
}

export default function LoanApplicationModal({ 
  isOpen, 
  onClose, 
  customerData, 
  onSuccess 
}: LoanApplicationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [defaultInterestRate, setDefaultInterestRate] = useState(0.5); // Default 0.5% daily
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [calculatedData, setCalculatedData] = useState({
    monthlyPayment: 0,
    totalAmount: 0,
    totalInterest: 0
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset
  } = useForm<LoanApplicationFormInputs>();

  const loanAmount = watch('loanAmount');
  const loanTenure = watch('loanTenure');

  // Fetch default interest rate
  useEffect(() => {
    const fetchInterestRate = async () => {
      try {
        const rate = await fetchSystemParameter(INTEREST_RATE_PARAMETER_ID);
        if (rate && rate.value) {
          setDefaultInterestRate(parseFloat(rate.value));
        }
      } catch (error) {
        console.error('Error fetching interest rate:', error);
      }
    };

    if (isOpen) {
      fetchInterestRate();
    }
  }, [isOpen]);

  // Calculate loan details when amount or tenure changes
  useEffect(() => {
    if (loanAmount && loanTenure) {
      const amount = parseFloat(loanAmount.replace(/,/g, ''));
      const months = parseInt(loanTenure);
      
      if (!isNaN(amount) && !isNaN(months) && amount > 0 && months > 0) {
        // Convert daily rate to monthly rate and then to decimal
        const monthlyInterestRate = (defaultInterestRate * 30) / 100;
        const totalAmount = amount * (1 + (monthlyInterestRate * months));
        const monthlyPayment = totalAmount / months;
        const totalInterest = totalAmount - amount;

        setCalculatedData({
          monthlyPayment: Math.round(monthlyPayment * 100) / 100,
          totalAmount: Math.round(totalAmount * 100) / 100,
          totalInterest: Math.round(totalInterest * 100) / 100
        });
      }
    }
  }, [loanAmount, loanTenure, defaultInterestRate]);

  const onSubmit = async (data: LoanApplicationFormInputs) => {
    try {
      setIsSubmitting(true);
      
      const customer = customerData.customers;
      
      // Validate data
      if (!data.loanAmount || !data.loanTenure || !data.termsAccepted) {
        toast.error('Please complete all loan application details.');
        return;
      }
      
      const amount = parseFloat(data.loanAmount.replace(/,/g, ''));
      const duration = parseInt(data.loanTenure);
      
      // Calculate loan details
      const monthlyInterestRate = defaultInterestRate * 30 / 100;
      const totalAmount = amount * (1 + (monthlyInterestRate * duration));
      const installmentAmount = totalAmount / duration;

      const loanPayload = {
        customerID: customer.customerID,
        amount: amount,
        currency: "NGN",
        interestRate: defaultInterestRate,
        createdBy: customer.email,
        lastModifiedBy: customer.email,
        guarantorOrgID: "SYSTEM",
        guarantorOrg: "Lender",
        adjustedAmount: amount,
        comment: `Loan application for ${customer.firstName} ${customer.lastName} - Amount: ₦${data.loanAmount}, Tenure: ${data.loanTenure} months`,
        installmentAmount: Math.round(installmentAmount * 100) / 100,
        duration: duration
      };

      console.log('Submitting loan application:', loanPayload);

      const token = await AuthService.getValidToken();
      const response = await fetch(
        `${API_CONFIG.baseUrl}/api/V2/Loan/createLoanApplicationSimple`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          },
          body: JSON.stringify(loanPayload)
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Loan application failed:', errorText);
        toast.error('Failed to submit loan application. Please try again.');
        return;
      }

      const result = await response.json();
      console.log('Loan application created:', result);
      
      toast.success('Loan application submitted successfully!');
      
      // Reset form and close modal
      reset();
      onClose();
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error) {
      console.error('Error submitting loan application:', error);
      toast.error('Failed to submit loan application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const formattedValue = rawValue ? Number(rawValue).toLocaleString('en-US') : '';
    setValue('loanAmount', formattedValue);
  };


  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Apply for Loan</h2>
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
              <h3 className="text-sm font-medium text-gray-900 mb-2">Application for:</h3>
              <p className="text-lg font-semibold text-gray-800">
                {customerData.customers.firstName} {customerData.customers.lastName}
              </p>
              <p className="text-sm text-gray-600">{customerData.customers.customerID}</p>
            </div>

            {/* Loan Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loan Amount (NGN) *
              </label>
              <input
                type="text"
                {...register('loanAmount', {
                  required: 'Loan amount is required',
                  validate: (value) => {
                    const numValue = parseFloat(value.replace(/,/g, ''));
                    if (isNaN(numValue)) return 'Please enter a valid amount';
                    if (numValue < 1000) return 'Minimum loan amount is ₦1,000';
                    if (numValue > 10000000) return 'Maximum loan amount is ₦10,000,000';
                    return true;
                  }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-200 focus:border-transparent"
                placeholder="Enter loan amount"
                onChange={handleAmountChange}
                value={loanAmount || ''}
                disabled={isSubmitting}
              />
              {errors.loanAmount && (
                <p className="mt-1 text-sm text-red-500">{errors.loanAmount.message}</p>
              )}
            </div>

            {/* Loan Tenure */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loan Tenure (Months) *
              </label>
              <select
                {...register('loanTenure', {
                  required: 'Loan tenure is required'
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-200 focus:border-transparent"
                disabled={isSubmitting}
              >
                <option value="">Select tenure</option>
                <option value="3">3 months</option>
                <option value="6">6 months</option>
                <option value="9">9 months</option>
                <option value="12">12 months</option>
                <option value="18">18 months</option>
                <option value="24">24 months</option>
              </select>
              {errors.loanTenure && (
                <p className="mt-1 text-sm text-red-500">{errors.loanTenure.message}</p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                {...register('termsAccepted', {
                  required: 'You must accept the terms and conditions'
                })}
                className="mt-1 h-4 w-4 text-secondary-600 focus:ring-secondary-500 border-gray-300 rounded"
                disabled={isSubmitting}
              />
              <div className="text-sm">
                <label className="text-gray-700">
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowTermsModal(true);
                    }}
                    className="text-secondary-600 hover:text-secondary-700 underline"
                  >
                    terms and conditions
                  </button>{' '}
                  and{' '}
                  <a href="#" className="text-secondary-600 hover:text-secondary-700 underline">
                    privacy policy
                  </a>
                  .
                </label>
                {errors.termsAccepted && (
                  <p className="mt-1 text-red-500">{errors.termsAccepted.message}</p>
                )}
              </div>
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
                  <span>Submitting...</span>
                </div>
              ) : (
                'Submit Application'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>

    {/* Terms and Conditions Modal */}
    <TermsAndConditionsModal
      isOpen={showTermsModal}
      onClose={() => setShowTermsModal(false)}
      customerName={`${customerData.customers.firstName} ${customerData.customers.lastName}`}
      loanDetails={
        loanAmount && loanTenure
          ? {
              amount: parseFloat(loanAmount.replace(/,/g, '')),
              tenure: loanTenure,
              interestRate: defaultInterestRate,
              totalInterest: calculatedData.totalInterest,
              totalAmount: calculatedData.totalAmount,
              monthlyPayment: calculatedData.monthlyPayment
            }
          : undefined
      }
    />
  </>
  );
}