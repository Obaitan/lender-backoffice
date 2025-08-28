import {
  columns,
  OverdueLoan,
} from '@/components/recovery/overdue/OverdueLoansColumns';
import { DataTable } from '@/components/recovery/overdue/OverdueLoansDataTable';

export default function OverdueLoansPage() {
  const overdueLoans: OverdueLoan[] = [
    {
      id: 1,
      repaymentId: 101,
      customerID: 'CUST001',
      customerName: 'John Smith',
      email: 'john.smith@email.com',
      phoneNumber: '+1234567890',
      loanID: 'LOAN001',
      loanNumber: 'LN001',
      repaymentNumber: 'RP001',
      amountDue: 15000,
      principalAmount: 12000,
      interestAmount: 2500,
      lateFee: 500,
      outstandingAmount: 15000,
      outstandingRepayment: 1,
      amountPaid: 0,
      dateDisbursed: '2023-12-01',
      dueDate: '2024-01-15',
      repaymentDate: '2024-01-15',
      createDate: '2023-12-01',
      loanBalance: 35000,
      status: 'Overdue',
      repaymentChannel: 'Bank Transfer',
      customerStatus: 'Active',
      loanAmount: 50000,
      loanDuration: 24,
      loanStatus: 'Active',
      vendorName: 'ABC Bank',
    },
    {
      id: 2,
      repaymentId: 102,
      customerID: 'CUST002',
      customerName: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phoneNumber: '+1234567891',
      loanID: 'LOAN002',
      loanNumber: 'LN002',
      repaymentNumber: 'RP002',
      amountDue: 8500,
      principalAmount: 7000,
      interestAmount: 1200,
      lateFee: 300,
      outstandingAmount: 8500,
      outstandingRepayment: 1,
      amountPaid: 0,
      dateDisbursed: '2023-11-15',
      dueDate: '2024-01-20',
      repaymentDate: '2024-01-20',
      createDate: '2023-11-15',
      loanBalance: 18500,
      status: 'Overdue',
      repaymentChannel: 'Direct Debit',
      customerStatus: 'Active',
      loanAmount: 25000,
      loanDuration: 18,
      loanStatus: 'Active',
      vendorName: 'XYZ Finance',
    },
    {
      id: 3,
      repaymentId: 103,
      customerID: 'CUST003',
      customerName: 'Michael Brown',
      email: 'michael.brown@email.com',
      phoneNumber: '+1234567892',
      loanID: 'LOAN003',
      loanNumber: 'LN003',
      repaymentNumber: 'RP003',
      amountDue: 22000,
      principalAmount: 18000,
      interestAmount: 3200,
      lateFee: 800,
      outstandingAmount: 22000,
      outstandingRepayment: 2,
      amountPaid: 0,
      dateDisbursed: '2023-10-01',
      dueDate: '2024-01-10',
      repaymentDate: '2024-01-10',
      createDate: '2023-10-01',
      loanBalance: 55000,
      status: 'Severely Overdue',
      repaymentChannel: 'Cash',
      customerStatus: 'Delinquent',
      loanAmount: 75000,
      loanDuration: 36,
      loanStatus: 'Overdue',
      vendorName: 'DEF Credit',
    },
  ];

  return (
    <div className="2xl:px-2 mt-8">
      <DataTable
        columns={columns}
        data={overdueLoans}
        columnFileName="OverduePaymentsColumns"
        emptyMessage="No overdue payments found."
      />
    </div>
  );
}
