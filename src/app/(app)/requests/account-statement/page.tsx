import { columns } from '@/components/requests/update/updateColumns';
import { DataTable } from '@/components/requests/update/updateDataTable';
import { CustomerRequest } from '@/types';

export default async function StatementRequestsPage() {
  const statementRequests: CustomerRequest[] = [
    {
      id: 1,
      customerID: 'CUST001',
      customerName: 'Alice Johnson',
      email: 'alice.johnson@email.com',
      phoneNumber: '+234-801-111-2222',
      createDate: '2024-01-16T08:30:00Z',
      createdBy: 'system',
      lastModified: '2024-01-16T08:30:00Z',
      lastModifiedBy: 'system',
      requestType: 'account-statement',
      amount: 0,
      oldInformation: '',
      newInformation: 'Request for account statement for loan history',
      otherIssue: '',
      status: 'pending',
      assignedUserEmail: 'admin@lender.com'
    },
    {
      id: 2,
      customerID: 'CUST002',
      customerName: 'Robert Brown',
      email: 'robert.brown@email.com',
      phoneNumber: '+234-802-333-4444',
      createDate: '2024-01-15T16:45:00Z',
      createdBy: 'system',
      lastModified: '2024-01-15T16:45:00Z',
      lastModifiedBy: 'system',
      requestType: 'account-statement',
      amount: 0,
      oldInformation: '',
      newInformation: 'Need statement for tax purposes',
      otherIssue: '',
      status: 'completed',
      assignedUserEmail: 'admin@lender.com'
    },
    {
      id: 3,
      customerID: 'CUST003',
      customerName: 'Sarah Wilson',
      email: 'sarah.wilson@email.com',
      phoneNumber: '+234-803-555-6666',
      createDate: '2024-01-14T11:20:00Z',
      createdBy: 'system',
      lastModified: '2024-01-14T11:20:00Z',
      lastModifiedBy: 'system',
      requestType: 'account-statement',
      amount: 0,
      oldInformation: '',
      newInformation: 'Monthly statement request',
      otherIssue: '',
      status: 'in-progress',
      assignedUserEmail: 'admin@lender.com'
    }
  ];

  return (
    <div className="2xl:px-2">
      <DataTable
        columns={columns}
        data={statementRequests}
        columnFileName="AccountStatementRequestColumns"
        emptyMessage="No account statement requests found."
      />
    </div>
  );
}
