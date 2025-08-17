'use client';

import { useState } from 'react';
import { Loader2, X, CreditCard, Building2 } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { AuthService, API_CONFIG } from '@/services/authService';
import { formatCurrency } from '@/utils/functions';

interface TransferDestination {
  bank_name: string;
  account_number: number;
  icon: string;
  primary_color: string;
}

interface CreateMandateResponse {
  status: string;
  message: string;
  data: {
    id: string;
    status: string;
    mandate_type: string;
    debit_type: string;
    ready_to_debit: boolean;
    nibss_code: string;
    approved: boolean;
    reference: string;
    account_name: string;
    account_number: string;
    bank: string;
    bank_code: string;
    customer: string;
    fee_bearer: string;
    description: string;
    live_mode: boolean;
    start_date: string;
    end_date: string;
    date: string;
    initial_debit_date: string;
    transfer_destinations: TransferDestination[];
    amount: number;
    initial_debit_amount: number;
  };
}

interface CreateMandateModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerID: string;
  mandate: {
    id: number;
    accountNumber: string;
    accountName: string;
    bankName: string;
    bankCode: string;
    status: string;
  };
  installmentAmount?: number;
  loanAmount?: number;
  interestRate?: number;
  tenure?: number; // in months
}

const CreateMandateModal: React.FC<CreateMandateModalProps> = ({
  isOpen,
  onClose,
  customerID,
  mandate,
  installmentAmount = 0,
  loanAmount = 0,
  interestRate = 0,
  tenure = 0,
}) => {
  // Calculate compound interest values
  const calculateCompoundInterest = () => {
    if (loanAmount && interestRate && tenure) {
      const principal = loanAmount;
      const dailyRate = interestRate / 100; // Convert percentage to decimal
      const totalDays = tenure * 30; // Convert months to days
      const totalRepayment = principal * Math.pow(1 + dailyRate, totalDays);
      const monthlyRepayment = totalRepayment / tenure;
      return { totalRepayment, monthlyRepayment };
    }
    return { totalRepayment: loanAmount, monthlyRepayment: installmentAmount };
  };

  const { totalRepayment, monthlyRepayment } = calculateCompoundInterest();

  // Calculate end date: tenure * 3 months from today
  const today = new Date();
  const endDate = new Date(today);
  endDate.setMonth(endDate.getMonth() + (tenure * 3));

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    installmentAmount: monthlyRepayment,
    description: `E-mandate for ${mandate.accountName} - ${mandate.bankName}`,
    startDate: today.toISOString().split('T')[0], // Today
    endDate: endDate.toISOString().split('T')[0], // Tenure * 3 months from today
  });
  const [transferDestinations, setTransferDestinations] = useState<TransferDestination[]>([]);
  const [mandateCreated, setMandateCreated] = useState(false);
  const [mandateDetails, setMandateDetails] = useState<CreateMandateResponse['data'] | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.installmentAmount || formData.installmentAmount <= 0) {
      toast.error('Please enter a valid installment amount');
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      toast.error('Please select both start and end dates');
      return;
    }

    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      toast.error('End date must be after start date');
      return;
    }

    try {
      setIsLoading(true);

      const requestBody = {
        customerID,
        accountNumber: mandate.accountNumber,
        bankCode: mandate.bankCode,
        installmentAmount: formData.installmentAmount,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        description: formData.description,
      };

      console.log('Creating mandate with payload:', requestBody);
      console.log('CustomerID value:', customerID);
      console.log('CustomerID type:', typeof customerID);

      const token = await AuthService.getValidToken();
      const response = await fetch(
        `${API_CONFIG.baseUrl}/api/V2/DDSync/createEmandate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          },
          body: JSON.stringify(requestBody)
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Create mandate failed:', errorText);
        throw new Error('Failed to create mandate');
      }

      const result: CreateMandateResponse = await response.json();
      console.log('Mandate created successfully:', result);

      if (result.status === 'successful' && result.data) {
        setMandateDetails(result.data);
        setTransferDestinations(result.data.transfer_destinations || []);
        setMandateCreated(true);
        toast.success(result.message || 'Mandate created successfully!');
      } else {
        throw new Error(result.message || 'Failed to create mandate');
      }
    } catch (error) {
      console.error('Error creating mandate:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create mandate');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setMandateCreated(false);
    setTransferDestinations([]);
    setMandateDetails(null);
    // Reset with recalculated values
    const resetEndDate = new Date(today);
    resetEndDate.setMonth(resetEndDate.getMonth() + (tenure * 3));
    setFormData({
      installmentAmount: monthlyRepayment,
      description: `E-mandate for ${mandate.accountName} - ${mandate.bankName}`,
      startDate: today.toISOString().split('T')[0],
      endDate: resetEndDate.toISOString().split('T')[0],
    });
    onClose();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {mandateCreated ? 'Mandate Authorization Required' : 'Create E-Mandate'}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {!mandateCreated ? (
            // Create Mandate Form
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Loan Summary */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-3">Loan Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-blue-700">Loan Amount</label>
                    <p className="font-medium text-blue-900">₦ {loanAmount.toLocaleString('en-US')}</p>
                  </div>
                  <div>
                    <label className="text-sm text-blue-700">Interest Rate (Daily)</label>
                    <p className="font-medium text-blue-900">{interestRate}%</p>
                  </div>
                  <div>
                    <label className="text-sm text-blue-700">Tenure</label>
                    <p className="font-medium text-blue-900">{tenure} months</p>
                  </div>
                  <div>
                    <label className="text-sm text-blue-700">Total Repayment</label>
                    <p className="font-medium text-blue-900">₦ {totalRepayment.toLocaleString('en-US')}</p>
                  </div>
                  <div>
                    <label className="text-sm text-blue-700">Monthly Repayment</label>
                    <p className="font-medium text-blue-900">₦ {monthlyRepayment.toLocaleString('en-US')}</p>
                  </div>
                </div>
              </div>

              {/* Account Details */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Account Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Account Name</label>
                    <p className="font-medium text-gray-900">{mandate.accountName}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Account Number</label>
                    <p className="font-medium text-gray-900">{mandate.accountNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Bank</label>
                    <p className="font-medium text-gray-900">{mandate.bankName}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Bank Code</label>
                    <p className="font-medium text-gray-900">{mandate.bankCode}</p>
                  </div>
                </div>
              </div>

              {/* Mandate Configuration */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-900 mb-3">Mandate Configuration</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-green-700">Total Amount</label>
                    <p className="font-medium text-green-900">₦ {totalRepayment.toLocaleString('en-US')}</p>
                    <p className="text-xs text-green-600">Loan Total Repayment Amount</p>
                  </div>
                  <div>
                    <label className="text-sm text-green-700">Start Date</label>
                    <p className="font-medium text-green-900">{new Date().toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                    <p className="text-xs text-green-600">Automatically set to today</p>
                  </div>
                  <div>
                    <label className="text-sm text-green-700">End Date</label>
                    <p className="font-medium text-green-900">{endDate.toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                    <p className="text-xs text-green-600">Set to {tenure * 3} months from start (tenure × 3)</p>
                  </div>
                  <div>
                    <label className="text-sm text-green-700">Description</label>
                    <p className="font-medium text-green-900">{formData.description}</p>
                    <p className="text-xs text-green-600">Auto-generated</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-primary-200 text-white rounded-md hover:bg-primary-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Continue'
                  )}
                </button>
              </div>
            </form>
          ) : (
            // Transfer Destinations Display
            <div className="space-y-6">
              {/* Mandate Details */}
              {mandateDetails && (
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <CreditCard className="h-5 w-5 text-green-600" />
                    <h4 className="font-medium text-green-900">Mandate Created Successfully</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-green-700">Reference:</span>
                      <span className="ml-2 font-mono bg-white px-2 py-1 rounded">
                        {mandateDetails.reference}
                      </span>
                    </div>
                    <div>
                      <span className="text-green-700">NIBSS Code:</span>
                      <span className="ml-2 font-mono bg-white px-2 py-1 rounded">
                        {mandateDetails.nibss_code}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Authorization Instructions */}
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Authorization Required</h4>
                <p className="text-blue-800 text-sm mb-3">
                  To proceed, please authorize this mandate by transferring{' '}
                  <span className="font-semibold">
                    {mandateDetails?.amount ? formatCurrency(mandateDetails.amount / 100) : '₦50.00'}
                  </span>{' '}
                  to any of the banks listed below:
                </p>
              </div>

              {/* Transfer Destinations */}
              {transferDestinations.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Bank Transfer Destinations
                  </h4>
                  <div className="grid gap-4">
                    {transferDestinations.map((destination, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {destination.icon && (
                              <Image
                                src={destination.icon}
                                alt={destination.bank_name}
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded"
                              />
                            )}
                            <div>
                              <h5 className="font-medium text-gray-900">
                                {destination.bank_name}
                              </h5>
                              <p className="text-sm text-gray-600 font-mono">
                                {destination.account_number}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => copyToClipboard(destination.account_number.toString())}
                            className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Close Button */}
              <div className="pt-4">
                <button
                  onClick={handleClose}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateMandateModal;