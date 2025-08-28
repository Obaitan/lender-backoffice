
import {
  columns,
  RecoveredPayment,
} from '@/components/recovery/recovered/RecoveredDebtsColumns';
import { DataTable } from '@/components/recovery/recovered/RecoveredDebtsDataTable';

export default function RecoveredDebtsPage() {
  const recoveredPayments: RecoveredPayment[] = [
    {
      id: 1,
      customerID: 'CUST004',
      customerName: 'Emily Davis',
      loanID: 'LOAN004',
      amountOwed: 12000,
      dueDate: '2024-01-20',
      amountRecovered: 12000,
      dateRecovered: '2024-01-25',
      phoneNumber: '+1234567893',
      email: 'emily.davis@email.com',
      repaymentNumber: 'RP004',
      recoveryChannel: 'Direct Payment',
      installmentsLeft: 0,
      loanBalance: 0,
      repaymentInstallment: 1,
      recoveryReference: 'REC001',
      loanNumber: 'LN004',
    },
    {
      id: 2,
      customerID: 'CUST005',
      customerName: 'David Wilson',
      loanID: 'LOAN005',
      amountOwed: 18500,
      dueDate: '2024-01-18',
      amountRecovered: 15000,
      dateRecovered: '2024-01-22',
      phoneNumber: '+1234567894',
      email: 'david.wilson@email.com',
      repaymentNumber: 'RP005',
      recoveryChannel: 'Settlement',
      installmentsLeft: 2,
      loanBalance: 3500,
      repaymentInstallment: 2,
      recoveryReference: 'REC002',
      loanNumber: 'LN005',
    },
    {
      id: 3,
      customerID: 'CUST006',
      customerName: 'Lisa Anderson',
      loanID: 'LOAN006',
      amountOwed: 9200,
      dueDate: '2024-01-25',
      amountRecovered: 9200,
      dateRecovered: '2024-01-28',
      phoneNumber: '+1234567895',
      email: 'lisa.anderson@email.com',
      repaymentNumber: 'RP006',
      recoveryChannel: 'Auto Debit',
      installmentsLeft: 0,
      loanBalance: 0,
      repaymentInstallment: 1,
      recoveryReference: 'REC003',
      loanNumber: 'LN006',
    },
  ];

  return (
    <div className="2xl:px-2 mt-8">
      <DataTable
        columns={columns}
        data={recoveredPayments}
        columnFileName="RecoveredDebtsColumns"
        emptyMessage="No recovered payments found."
      />
    </div>
  );
}
