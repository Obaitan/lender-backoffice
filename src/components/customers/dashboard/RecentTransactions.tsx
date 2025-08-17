'use client';

import { useState, useEffect } from 'react';
import { AuthService, API_CONFIG } from '@/services/authService';
import { 
  ArrowDownIcon, 
  ArrowUpIcon, 
  CreditCardIcon
} from '@heroicons/react/24/outline';
import { Loader2 } from 'lucide-react';

interface RecentTransactionsProps {
  customerData: {
    customers: {
      customerID: string;
    };
  };
}

interface Transaction {
  id: number;
  type: string;
  amount: number;
  description: string;
  status: string;
  date: string;
  reference: string;
  method?: string;
}

export default function RecentTransactions({ customerData }: RecentTransactionsProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'credit' | 'debit'>('all');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Try to get auth token, but continue without if it fails
        const headers: HeadersInit = {
          'Content-Type': 'application/json'
        };
        
        try {
          const token = await AuthService.getValidToken();
          headers['Authorization'] = `Bearer ${token}`;
        } catch {
          console.log('Auth token not available, proceeding without authentication');
        }
        
        // Fetch repayment history (credits)
        const repaymentsResponse = await fetch(
          `${API_CONFIG.baseUrl}/api/V2/Repayment/getCustomerRepayments?customerID=${customerData.customers.customerID}&page=1&pageSize=10`,
          {
            method: 'GET',
            headers
          }
        );

        // Fetch loan disbursements (debits)
        const loansResponse = await fetch(
          `${API_CONFIG.baseUrl}/api/V2/Loan/getCustomerLoans?customerID=${customerData.customers.customerID}`,
          {
            method: 'GET',
            headers
          }
        );

        const transactionList: Transaction[] = [];

        if (repaymentsResponse.ok) {
          const repaymentsData = await repaymentsResponse.json();
          if (repaymentsData.repayments) {
            repaymentsData.repayments.forEach((repayment: Record<string, unknown>) => {
              transactionList.push({
                id: repayment.id as number,
                type: 'credit',
                amount: repayment.amount as number,
                description: 'Loan Repayment',
                status: repayment.status as string || 'completed',
                date: repayment.paymentDate as string || repayment.createDate as string,
                reference: repayment.reference as string || repayment.transactionRef as string,
                method: repayment.paymentMethod as string
              });
            });
          }
        }

        if (loansResponse.ok) {
          const loansData = await loansResponse.json();
          if (loansData.loans) {
            loansData.loans.forEach((loan: Record<string, unknown>) => {
              if (loan.disbursementDate) {
                transactionList.push({
                  id: loan.id as number,
                  type: 'debit',
                  amount: loan.amount as number,
                  description: 'Loan Disbursement',
                  status: 'completed',
                  date: loan.disbursementDate as string,
                  reference: loan.loanNumber as string,
                  method: 'Bank Transfer'
                });
              }
            });
          }
        }

        // Sort by date (most recent first)
        transactionList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        setTransactions(transactionList.slice(0, 10)); // Show only latest 10
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [customerData.customers.customerID]);

  const getTransactionIcon = (type: string) => {
    if (type === 'credit') {
      return <ArrowDownIcon className="h-5 w-5 text-success-500" />;
    } else {
      return <ArrowUpIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'successful':
        return 'text-success-600';
      case 'pending':
        return 'text-warning-600';
      case 'failed':
        return 'text-error-600';
      default:
        return 'text-gray-600';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.type === filter;
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 sm:p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 space-y-3 sm:space-y-0">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Recent Transactions</h2>
        
        {/* Filter Buttons */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-2 sm:px-3 py-1.5 sm:py-1 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap min-h-[36px] ${
              filter === 'all'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('credit')}
            className={`px-2 sm:px-3 py-1.5 sm:py-1 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap min-h-[36px] ${
              filter === 'credit'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Credits
          </button>
          <button
            onClick={() => setFilter('debit')}
            className={`px-2 sm:px-3 py-1.5 sm:py-1 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap min-h-[36px] ${
              filter === 'debit'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Debits
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="h-8 w-8 animate-spin text-secondary-500" />
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="text-center py-8">
          <CreditCardIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No transactions found</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {filteredTransactions.map((transaction, index) => (
            <div
              key={`${transaction.id}-${index}`}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors space-y-2 sm:space-y-0"
            >
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className={`p-1.5 sm:p-2 rounded-full flex-shrink-0 ${
                  transaction.type === 'credit' ? 'bg-success-100' : 'bg-blue-100'
                }`}>
                  {getTransactionIcon(transaction.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base font-medium text-gray-900 truncate">{transaction.description}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 text-xs sm:text-sm text-gray-600">
                    <span className="truncate">{transaction.reference}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>{transaction.method}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center sm:block sm:text-right">
                <p className={`text-sm sm:text-base font-semibold ${
                  transaction.type === 'credit' ? 'text-success-600' : 'text-blue-600'
                }`}>
                  {transaction.type === 'credit' ? '+' : '-'}₦{transaction.amount.toLocaleString()}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  {new Date(transaction.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View All Link */}
      <div className="mt-6 text-center">
        <button className="text-secondary-500 hover:text-secondary-600 font-medium text-sm">
          View All Transactions
        </button>
      </div>
    </div>
  );
}