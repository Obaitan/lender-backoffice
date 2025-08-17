'use client';

import { useState, useEffect } from 'react';
import { AuthService, API_CONFIG } from '@/services/authService';
import { 
  ClockIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  XCircleIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/general/Button';

interface LoanStatusProps {
  customerData: {
    customers: {
      customerID: string;
    };
  };
}

interface Loan {
  id: number;
  loanNumber: string;
  amount: number;
  status: string;
  interestRate: number;
  duration: number;
  installmentAmount: number;
  disbursementDate: string;
  nextPaymentDate: string;
  outstandingBalance: number;
  paidAmount: number;
}

export default function LoanStatus({ customerData }: LoanStatusProps) {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        // Try with auth token first, fallback without
        let response;
        try {
          const token = await AuthService.getValidToken();
          response = await fetch(
            `${API_CONFIG.baseUrl}/api/V2/Loan/getCustomerLoans?customerID=${customerData.customers.customerID}`,
            {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
        } catch {
          // If auth fails, try without token
          response = await fetch(
            `${API_CONFIG.baseUrl}/api/V2/Loan/getCustomerLoans?customerID=${customerData.customers.customerID}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
        }

        if (response.ok) {
          const data = await response.json();
          setLoans(data.loans || []);
          if (data.loans && data.loans.length > 0) {
            setSelectedLoan(data.loans[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching loans:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoans();
  }, [customerData.customers.customerID]);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'disbursed':
        return <ClockIcon className="h-5 w-5 text-blue-500" />;
      case 'paid off':
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-success-500" />;
      case 'overdue':
        return <ExclamationTriangleIcon className="h-5 w-5 text-warning-500" />;
      case 'defaulted':
      case 'declined':
        return <XCircleIcon className="h-5 w-5 text-error-500" />;
      default:
        return <DocumentTextIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'disbursed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'paid off':
      case 'completed':
        return 'bg-success-100 text-success-800 border-success-200';
      case 'overdue':
        return 'bg-warning-100 text-warning-800 border-warning-200';
      case 'defaulted':
      case 'declined':
        return 'bg-error-100 text-error-800 border-error-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const calculateProgress = (loan: Loan) => {
    if (loan.amount === 0) return 0;
    return Math.min(100, (loan.paidAmount / loan.amount) * 100);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-center h-32">
          <Loader2 className="h-8 w-8 animate-spin text-secondary-500" />
        </div>
      </div>
    );
  }

  if (loans.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Loan Status</h2>
        <div className="text-center py-8">
          <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No loans found</p>
          <Button className="bg-secondary-200">
            Apply for a Loan
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Loan Status</h2>
        <span className="text-sm text-gray-600">{loans.length} loan{loans.length > 1 ? 's' : ''}</span>
      </div>

      {/* Loan Tabs */}
      {loans.length > 1 && (
        <div className="flex space-x-1 mb-4 sm:mb-6 p-1 bg-gray-100 rounded-lg overflow-x-auto">
          {loans.map((loan, index) => (
            <button
              key={loan.id}
              onClick={() => setSelectedLoan(loan)}
              className={`flex-shrink-0 py-2 px-3 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap min-h-[36px] ${
                selectedLoan?.id === loan.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Loan #{index + 1}
            </button>
          ))}
        </div>
      )}

      {selectedLoan && (
        <div className="space-y-6">
          {/* Loan Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon(selectedLoan.status)}
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedLoan.loanNumber}
                </h3>
                <p className="text-sm text-gray-600">
                  ₦{selectedLoan.amount.toLocaleString()} • {selectedLoan.duration} months
                </p>
              </div>
            </div>
            <span className={`px-3 py-1 text-xs font-medium border rounded-full ${getStatusColor(selectedLoan.status)}`}>
              {selectedLoan.status}
            </span>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Repayment Progress</span>
              <span>{calculateProgress(selectedLoan).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-secondary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${calculateProgress(selectedLoan)}%` }}
              />
            </div>
          </div>

          {/* Loan Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Outstanding</p>
              <p className="text-sm sm:text-lg font-semibold text-gray-900">
                ₦{selectedLoan.outstandingBalance.toLocaleString()}
              </p>
            </div>
            <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Paid Amount</p>
              <p className="text-sm sm:text-lg font-semibold text-success-600">
                ₦{selectedLoan.paidAmount.toLocaleString()}
              </p>
            </div>
            <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Monthly Payment</p>
              <p className="text-sm sm:text-lg font-semibold text-gray-900">
                ₦{selectedLoan.installmentAmount.toLocaleString()}
              </p>
            </div>
            <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Interest Rate</p>
              <p className="text-sm sm:text-lg font-semibold text-gray-900">
                {selectedLoan.interestRate}%
              </p>
            </div>
          </div>

          {/* Next Payment */}
          {selectedLoan.nextPaymentDate && selectedLoan.status.toLowerCase() === 'active' && (
            <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-800">Next Payment Due</p>
                  <p className="text-lg font-semibold text-secondary-900">
                    {new Date(selectedLoan.nextPaymentDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <Button className="bg-secondary-200">
                  Make Payment
                </Button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <Button className="flex-1 bg-gray-200 text-gray-700 text-sm sm:text-base min-h-[44px]">
              View Statement
            </Button>
            <Button className="flex-1 bg-secondary-200 text-sm sm:text-base min-h-[44px]">
              Contact Support
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}