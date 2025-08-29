import { columns } from '@/components/loans/loanColumns';
import { DataTable } from '@/components/loans/loanDataTable';
import { FormattedLoanData } from '@/types';

export default function ActiveLoansPage() {
  // Dummy data for active loans
  const activeLoans: FormattedLoanData[] = [
    {
      id: 1,
      customerID: 'CUST001',
      name: 'John Doe',
      loanAmount: '₦500,000',
      disbursementDate: '2024-01-15',
      tenure: 12,
      paid: '₦200,000',
      outstanding: '₦300,000',
      loanNumber: 'LN001234',
      phoneNumber: '+234-801-234-5678',
      email: 'john.doe@email.com',
      status: 'Active',
    },
    {
      id: 2,
      customerID: 'CUST002',
      name: 'Jane Smith',
      loanAmount: '₦750,000',
      disbursementDate: '2024-02-20',
      tenure: 18,
      paid: '₦150,000',
      outstanding: '₦600,000',
      loanNumber: 'LN001235',
      phoneNumber: '+234-802-345-6789',
      email: 'jane.smith@email.com',
      status: 'Active',
    },
    {
      id: 3,
      customerID: 'CUST003',
      name: 'Michael Johnson',
      loanAmount: '₦1,200,000',
      disbursementDate: '2024-03-10',
      tenure: 24,
      paid: '₦400,000',
      outstanding: '₦800,000',
      loanNumber: 'LN001236',
      phoneNumber: '+234-803-456-7890',
      email: 'michael.johnson@email.com',
      status: 'Active',
    },
    {
      id: 4,
      customerID: 'CUST004',
      name: 'Sarah Williams',
      loanAmount: '₦300,000',
      disbursementDate: '2024-04-05',
      tenure: 6,
      paid: '₦100,000',
      outstanding: '₦200,000',
      loanNumber: 'LN001237',
      phoneNumber: '+234-804-567-8901',
      email: 'sarah.williams@email.com',
      status: 'Active',
    },
    {
      id: 5,
      customerID: 'CUST005',
      name: 'David Brown',
      loanAmount: '₦900,000',
      disbursementDate: '2024-05-12',
      tenure: 15,
      paid: '₦300,000',
      outstanding: '₦600,000',
      loanNumber: 'LN001238',
      phoneNumber: '+234-805-678-9012',
      email: 'david.brown@email.com',
      status: 'Active',
    },
  ];

  return (
    <div className="2xl:px-2 mt-8">
      <DataTable
        columns={columns}
        data={activeLoans}
        emptyMessage="No active loans found."
        columnFileName="ActiveLoansColumns"
      />
    </div>
  );
}
