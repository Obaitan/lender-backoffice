'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import MonoEmandateLoansTable from './MonoMandateLoansTable';
import { AuthService, API_CONFIG } from '@/services/authService';
import { MonoMandateLoan, MonoMandate } from '@/types';

// API Types
interface LoanData {
  id: number;
  loanApplicationNumber: string;
  customerID: string;
  customerName: string;
  currency: string;
  amount: number;
  adjusteAmount: number;
  interestRate: number;
  phoneNumber: string;
  email: string;
  status: string;
  workFlowStatus: string;
  rmCode: string;
  guarantorOrgID: string;
  guarantorOrg: string;
  loanGateApprovalStatus: string;
  createDate: string;
  approvalDate: string;
  createdBy: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
  comment: string;
  assignedUserEmail: string;
  hasBeenAbandoned: boolean;
  monthlyRepayment: number;
  installmentAmount: number;
  duration: number;
}

interface EmandateData {
  id: number;
  mandateID: string;
  accountNumber: string;
  accountName: string;
  bankName: string;
  bankCode: string;
  status: string;
  mandateAmount: number;
  totalMandateAmount: number;
  startDate: string;
  endDate: string | null;
  createDate: string;
  authorizationCode: string;
  last4Digits: string;
  readyToDebit: boolean;
  reference: string;
  source: string;
}

interface EmandateResponse {
  success: boolean;
  message: string;
  data: {
    customerID: string;
    customerName: string;
    totalEmandates: number;
    existingEmandates: number;
    newlyAddedEmandates: number;
    emandates: EmandateData[];
    processingSummary: {
      monoBankAccountsChecked: number;
      accountsAlreadyInEmandates: number;
      newAccountsAdded: number;
      processedAt: string;
    };
  };
}

// Transform API data to match existing table format
interface LocalMonoMandateLoan {
  id: number;
  loanID: string;
  customerName: string;
  amount: number;
  date: string;
  dateCreated: string;
  interest: number;
  status: 'Active' | 'Paid' | 'Overdue';
  applicationStatus: string;
  paymentMethod: string;
  totalRepayment: number;
  repaymentAmount: number;
  loanBalance: number;
  penalInterest: number;
  duration: number;
  loanTerm: number;
  monthlyRepayment: number;
  mandates: LocalMonoMandate[]; // Add mandates property to match the imported type
  [key: string]: unknown;
}

interface LocalMonoMandate {
  id: number;
  accountNumber: string;
  accountName: string;
  bankName: string;
  mandateReference: string;
  mandateID: string;
  amount: number;
  mandateAmount: number;
  status: string;
  frequency: string;
  startDate: string;
  endDate: string | null;
  dateCreated: string;
  bankCode?: string;
  source?: string;
  readyToDebit?: boolean;
  bank: string;
  debitAccount: string;
  loanID: string; // Add missing property from MonoMandate
  debitType: string; // Add missing property from MonoMandate  
  progress: number; // Add missing property from MonoMandate
  [key: string]: unknown;
}

interface MonoEmandateLoanDataTableProps {
  customerID: string;
}

const MonoEmandateLoanDataTable: React.FC<MonoEmandateLoanDataTableProps> = ({
  customerID,
}) => {
  console.log('MonoEmandateLoanDataTable - CustomerID:', customerID);
  const [loanData, setLoanData] = useState<LocalMonoMandateLoan[]>([]);
  const [mandatesData, setMandatesData] = useState<Record<string, LocalMonoMandate[]>>({});
  const [isLoadingLoan, setIsLoadingLoan] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch loan data from API
  useEffect(() => {
    // Fetch emandate data
    const fetchEmandateData = async (loanID: string) => {
      try {
        const token = await AuthService.getValidToken();
        const response = await fetch(
          `${API_CONFIG.baseUrl}/api/V2/DDSync/EmandatesByCustomerID?customerID=${customerID}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch emandate data: ${response.statusText}`);
        }

        const data: EmandateResponse = await response.json();
        
        if (data.success) {
          // Transform emandates to match expected format
          const transformedMandates: LocalMonoMandate[] = data.data.emandates.map(emandate => ({
            id: emandate.id,
            accountNumber: emandate.accountNumber,
            accountName: emandate.accountName,
            bankName: emandate.bankName,
            mandateReference: emandate.mandateID || `REF-${emandate.id}`,
            mandateID: emandate.mandateID || `REF-${emandate.id}`,
            amount: emandate.mandateAmount,
            mandateAmount: emandate.mandateAmount,
            status: emandate.status,
            frequency: 'Monthly',
            startDate: emandate.startDate,
            endDate: emandate.endDate,
            dateCreated: emandate.createDate,
            bankCode: emandate.bankCode,
            source: emandate.source,
            readyToDebit: emandate.readyToDebit,
            bank: emandate.bankName,
            debitAccount: emandate.accountNumber,
            loanID: loanID, // Use the loanID passed to the function
            debitType: 'mandate', // Default debit type
            progress: 0 // Default progress value
          }));
          
          setMandatesData({
            [loanID]: transformedMandates
          });
        }
      } catch (error) {
        console.error('Error fetching emandate data:', error);
      }
    };

    const fetchLoanData = async () => {
      try {
        setIsLoadingLoan(true);
        setError(null);
        
        const token = await AuthService.getValidToken();
        const response = await fetch(
          `${API_CONFIG.baseUrl}/api/V2/Loan/getLoanApplicationByCustomerID?customerID=${customerID}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            setLoanData([]);
            return;
          }
          throw new Error(`Failed to fetch loan data: ${response.statusText}`);
        }

        const data: LoanData = await response.json();
        
        // Calculate repayment amount using compound interest formula
        // Formula: A = P(1 + r)^t where:
        // P = Principal (amount)
        // r = Daily interest rate (as decimal)
        // t = Total number of days (duration in months * 30 days)
        const principal = data.amount;
        const dailyRate = data.interestRate / 100; // Convert percentage to decimal
        const totalDays = data.duration * 30; // Convert months to days
        const totalAmountWithInterest = principal * Math.pow(1 + dailyRate, totalDays);
        const calculatedRepaymentAmount = totalAmountWithInterest / data.duration;

        // Transform to match expected format
        const transformedLoan: LocalMonoMandateLoan = {
          id: data.id,
          loanID: data.loanApplicationNumber,
          customerName: data.customerName,
          amount: data.amount,
          date: data.createDate,
          dateCreated: data.createDate,
          interest: data.interestRate,
          status: data.status === 'Approved' ? 'Active' : data.status === 'Declined' ? 'Overdue' : 'Active',
          applicationStatus: data.status,
          paymentMethod: 'Mono E-Mandate',
          totalRepayment: totalAmountWithInterest,
          repaymentAmount: calculatedRepaymentAmount,
          loanBalance: data.amount, // You might want to calculate this based on payments
          penalInterest: 0,
          duration: data.duration,
          loanTerm: data.duration,
          monthlyRepayment: calculatedRepaymentAmount,
          mandates: [] // Initialize empty mandates array, will be populated from mandatesData
        };
        
        setLoanData([transformedLoan]);
        
        // Fetch emandates for this loan
        await fetchEmandateData(data.loanApplicationNumber);
      } catch (error) {
        console.error('Error fetching loan data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load loan data');
      } finally {
        setIsLoadingLoan(false);
      }
    };

    if (customerID) {
      fetchLoanData();
    }
  }, [customerID]);

  if (isLoadingLoan) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader2 className="animate-spin w-6 h-6 text-secondary-200" />
        <span className="ml-2 text-gray-600">Loading loan data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
        <p className="text-red-800 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <MonoEmandateLoansTable
      record={loanData as MonoMandateLoan[]}
      mandatesData={mandatesData as Record<string, MonoMandate[]>}
      customerID={customerID}
    />
  );
};

export default MonoEmandateLoanDataTable;