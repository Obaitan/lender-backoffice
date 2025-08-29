import { columns } from '@/components/loans/loanColumns';
import { DataTable } from '@/components/loans/loanDataTable';
import { FormattedLoanData } from '@/types';

export default function OverdueLoansPage() {
  // Dummy data for overdue loans
  const overdueLoans: FormattedLoanData[] = [
    {
      id: 1,
      customerID: 'CUST006',
      name: 'Robert Wilson',
      loanAmount: '₦800,000',
      disbursementDate: '2023-10-15',
      tenure: 12,
      paid: '₦300,000',
      outstanding: '₦650,000',
      loanNumber: 'LN001239',
      phoneNumber: '+234-806-123-4567',
      email: 'robert.wilson@email.com',
      status: 'Overdue',
    },
    {
      id: 2,
      customerID: 'CUST007',
      name: 'Mary Johnson',
      loanAmount: '₦600,000',
      disbursementDate: '2023-11-20',
      tenure: 18,
      paid: '₦150,000',
      outstanding: '₦520,000',
      loanNumber: 'LN001240',
      phoneNumber: '+234-807-234-5678',
      email: 'mary.johnson@email.com',
      status: 'Overdue',
    },
    {
      id: 3,
      customerID: 'CUST008',
      name: 'James Anderson',
      loanAmount: '₦1,000,000',
      disbursementDate: '2023-09-05',
      tenure: 24,
      paid: '₦200,000',
      outstanding: '₦950,000',
      loanNumber: 'LN001241',
      phoneNumber: '+234-808-345-6789',
      email: 'james.anderson@email.com',
      status: 'Overdue',
    },
  ];

  return (
    <div className="2xl:px-2 mt-8">
      <DataTable
        columns={columns}
        data={overdueLoans}
        emptyMessage="No overdue loans found."
        columnFileName="OverdueLoansColumns"
      />
    </div>
  );
}
