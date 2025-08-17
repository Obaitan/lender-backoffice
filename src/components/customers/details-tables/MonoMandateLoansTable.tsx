'use client';

import { columns } from '@/components/customers/details-tables/customer-tables/MonoEmandatesLoansColumns';
import { DataTable } from '@/components/customers/details-tables/customer-tables/EmDataTable';
import MandateDetailsExpanded from '@/components/customers/details-tables/customer-tables/MandateDetailsExpanded';
import { MonoMandateLoan, MonoMandate } from '@/types';

// Create a type alias for the MandateDetailsExpanded LoanData
type MandateDetailsLoanData = {
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
};

interface MonoMandateLoansTableProps {
  record: MonoMandateLoan[];
  mandatesData?: Record<string, MonoMandate[]>; // Add mandates data prop keyed by loanID
  customerID?: string;
}

export default function MonoEmandateLoansTable({
  record,
  mandatesData = {},
  customerID,
}: MonoMandateLoansTableProps) {
  // Function to get mandates for a specific loan
  const getMandatesForLoan = (loanID: string) => {
    return mandatesData[loanID] || [];
  };

  return (
    <DataTable<MonoMandateLoan, unknown>
      columns={columns}
      data={record}
      getRowCanExpand={() => true} // Allow all rows to expand
      renderSubComponent={({ row }) => {
        const mandates = getMandatesForLoan(row.original.loanID);
        return <MandateDetailsExpanded mandates={mandates} customerID={customerID} loanData={row.original as unknown as MandateDetailsLoanData} />;
      }}
    />
  );
}
