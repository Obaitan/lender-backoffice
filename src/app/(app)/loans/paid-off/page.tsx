import { columns } from '@/components/loans/loanColumns';
import { DataTable } from '@/components/loans/loanDataTable';
import { FormattedLoanData } from '@/types';

export default function PaidOffLoansPage() {
  // Dummy data for paid-off loans
  const paidOffLoans: FormattedLoanData[] = [
    {
      id: 1,
      customerID: 'CUST011',
      name: 'Elizabeth Taylor',
      loanAmount: '₦500,000',
      disbursementDate: '2023-06-15',
      tenure: 12,
      paid: '₦575,000',
      outstanding: '₦0',
      loanNumber: 'LN001244',
      phoneNumber: '+234-811-123-4567',
      email: 'elizabeth.taylor@email.com',
      status: 'Paid',
    },
    {
      id: 2,
      customerID: 'CUST012',
      name: 'Daniel Brown',
      loanAmount: '₦300,000',
      disbursementDate: '2023-07-20',
      tenure: 6,
      paid: '₦345,000',
      outstanding: '₦0',
      loanNumber: 'LN001245',
      phoneNumber: '+234-812-234-5678',
      email: 'daniel.brown@email.com',
      status: 'Paid',
    },
    {
      id: 3,
      customerID: 'CUST013',
      name: 'Jennifer Wilson',
      loanAmount: '₦800,000',
      disbursementDate: '2023-05-10',
      tenure: 18,
      paid: '₦920,000',
      outstanding: '₦0',
      loanNumber: 'LN001246',
      phoneNumber: '+234-813-345-6789',
      email: 'jennifer.wilson@email.com',
      status: 'Paid',
    },
  ];

  return (
    <div className="2xl:px-2 mt-8">
      <DataTable
        columns={columns}
        data={paidOffLoans}
        emptyMessage="No paid off loans found."
        columnFileName="PaidoffLoansColumns"
      />
    </div>
  );
}
