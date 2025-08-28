import { columns } from '@/components/requests/update/updateColumns';
import { DataTable } from '@/components/requests/update/updateDataTable';
import { CustomerRequest } from '@/types';

export default async function CustomersIssuesRequestsPage() {
  const customerIssuesRequests: CustomerRequest[] = [
    {
      id: 1,
      customerID: 'CUST004',
      customerName: 'David Martinez',
      email: 'david.martinez@email.com',
      phoneNumber: '+234-804-777-8888',
      createDate: '2024-01-16T10:15:00Z',
      createdBy: 'system',
      lastModified: '2024-01-16T10:15:00Z',
      lastModifiedBy: 'system',
      requestType: 'customer-issue',
      amount: 0,
      oldInformation: '',
      newInformation: '',
      otherIssue: 'Unable to access mobile app, getting login errors',
      status: 'pending',
      assignedUserEmail: 'support@lender.com'
    },
    {
      id: 2,
      customerID: 'CUST005',
      customerName: 'Emma Thompson',
      email: 'emma.thompson@email.com',
      phoneNumber: '+234-805-999-0000',
      createDate: '2024-01-15T14:30:00Z',
      createdBy: 'system',
      lastModified: '2024-01-15T14:30:00Z',
      lastModifiedBy: 'system',
      requestType: 'customer-issue',
      amount: 0,
      oldInformation: '',
      newInformation: '',
      otherIssue: 'Incorrect loan balance showing in account',
      status: 'resolved',
      assignedUserEmail: 'support@lender.com'
    },
    {
      id: 3,
      customerID: 'CUST006',
      customerName: 'James Anderson',
      email: 'james.anderson@email.com',
      phoneNumber: '+234-806-111-2222',
      createDate: '2024-01-14T09:45:00Z',
      createdBy: 'system',
      lastModified: '2024-01-14T09:45:00Z',
      lastModifiedBy: 'system',
      requestType: 'customer-issue',
      amount: 0,
      oldInformation: '',
      newInformation: '',
      otherIssue: 'Payment not reflecting after bank transfer',
      status: 'in-progress',
      assignedUserEmail: 'support@lender.com'
    }
  ];

  return (
    <div className="2xl:px-2">
      <DataTable
        columns={columns}
        data={customerIssuesRequests}
        columnFileName="CustomerIssuesColumns"
        emptyMessage="No customer issues record found."
      />
    </div>
  );
}
