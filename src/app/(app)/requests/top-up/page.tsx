import { columns } from '@/components/requests/top-up/topUpColumns';
import { DataTable } from '@/components/requests/top-up/topUpDataTable';
import { CustomerRequest } from '@/types';

export default async function TopUpRequestsPage() {
  const topUpRequests: CustomerRequest[] = [
    {
      id: 1,
      customerID: 'CUST001',
      customerName: 'John Doe',
      email: 'john.doe@email.com',
      phoneNumber: '+234-801-234-5678',
      createDate: '2024-01-15T10:30:00Z',
      createdBy: 'system',
      lastModified: '2024-01-15T10:30:00Z',
      lastModifiedBy: 'system',
      requestType: 'top-up',
      amount: 50000,
      oldInformation: '',
      newInformation: 'Request for loan top-up',
      otherIssue: '',
      status: 'pending',
      assignedUserEmail: 'admin@lender.com'
    },
    {
      id: 2,
      customerID: 'CUST002',
      customerName: 'Jane Smith',
      email: 'jane.smith@email.com',
      phoneNumber: '+234-802-345-6789',
      createDate: '2024-01-14T14:20:00Z',
      createdBy: 'system',
      lastModified: '2024-01-14T14:20:00Z',
      lastModifiedBy: 'system',
      requestType: 'top-up',
      amount: 75000,
      oldInformation: '',
      newInformation: 'Additional funding request',
      otherIssue: '',
      status: 'approved',
      assignedUserEmail: 'admin@lender.com'
    },
    {
      id: 3,
      customerID: 'CUST003',
      customerName: 'Michael Johnson',
      email: 'michael.johnson@email.com',
      phoneNumber: '+234-803-456-7890',
      createDate: '2024-01-13T09:15:00Z',
      createdBy: 'system',
      lastModified: '2024-01-13T09:15:00Z',
      lastModifiedBy: 'system',
      requestType: 'top-up',
      amount: 100000,
      oldInformation: '',
      newInformation: 'Emergency top-up request',
      otherIssue: '',
      status: 'rejected',
      assignedUserEmail: 'admin@lender.com'
    }
  ];

  return (
    <div className="2xl:px-2">
      <DataTable
        columns={columns}
        data={topUpRequests}
        columnFileName="TopUpRequestsColumns"
        emptyMessage="No top up requests found."
      />
    </div>
  );
}
