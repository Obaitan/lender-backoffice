'use client';

import { useState } from 'react';
import { 
  PlusIcon,
  DocumentTextIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';
import LoanApplicationModal from './LoanApplicationModal';
import RequestStatementModal from './RequestStatementModal';

interface QuickActionsProps {
  customerData?: {
    customers: {
      customerID: string;
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
    };
  };
}

export default function QuickActions({ customerData }: QuickActionsProps) {
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [isStatementModalOpen, setIsStatementModalOpen] = useState(false);

  const quickActions = [
    {
      id: 'apply-loan',
      title: 'Apply for Loan',
      description: 'Submit a new loan application',
      icon: <PlusIcon className="h-6 w-6" />,
      color: 'bg-secondary-200 hover:bg-blue-600',
      action: () => {
        if (customerData) {
          setIsLoanModalOpen(true);
        } else {
          // Fallback to external page if no customer data
          window.location.href = '/loanapplication';
        }
      }
    },
    {
      id: 'make-payment',
      title: 'Make Payment',
      description: 'Pay your loan installment',
      icon: <CreditCardIcon className="h-6 w-6" />,
      color: 'bg-secondary-200 hover:bg-green-600',
      action: () => {
        // Handle payment action
        alert('Payment feature coming soon!');
      }
    },
    {
      id: 'view-statement',
      title: 'Account Statement',
      description: 'Request for statement',
      icon: <DocumentTextIcon className="h-6 w-6" />,
      color: 'bg-secondary-200 hover:bg-indigo-600',
      action: () => {
        if (customerData) {
          setIsStatementModalOpen(true);
        } else {
          alert('Customer data not available');
        }
      }
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-3 sm:p-4 lg:p-6">
       
      <div className="space-y-2 sm:space-y-3">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={action.action}
            className="w-full flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md transition-all duration-200 text-left min-h-[44px] bg-white"
          >
            <div className={`p-1.5 sm:p-2 rounded-lg text-white ${action.color} flex-shrink-0 shadow-sm`}>
              {action.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">{action.title}</p>
              <p className="text-xs sm:text-sm text-gray-700 truncate">{action.description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Featured Action */}
     

      {/* Help Section */}
      
      {/* Loan Application Modal */}
      {customerData && (
        <LoanApplicationModal
          isOpen={isLoanModalOpen}
          onClose={() => setIsLoanModalOpen(false)}
          customerData={customerData}
          onSuccess={() => {
            // Refresh the page or update state after successful application
            window.location.reload();
          }}
        />
      )}

      {/* Request Statement Modal */}
      {customerData && (
        <RequestStatementModal
          isOpen={isStatementModalOpen}
          onClose={() => setIsStatementModalOpen(false)}
          customerData={customerData}
          onSuccess={() => {
            // Optional: refresh or update state after successful request
            console.log('Statement request submitted successfully');
          }}
        />
      )}
    </div>
  );
}