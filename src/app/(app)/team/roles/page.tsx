'use client';

import { useState } from 'react';
import { RoleData } from '@/types';
import { DataTable } from '@/components/team/roles/RoleDataTable';
import { createColumns } from '@/components/team/roles/RoleColumns';
import { Row } from '@tanstack/react-table';

const RolesPage = () => {
  // Dummy role data
  const [roles] = useState<RoleData[]>([
    {
      id: 1,
      roleName: 'Administrator',
      roleCode: 'ADM',
      description: 'Full system access and administrative privileges',
      status: 'Active',
      createDate: '2024-01-15T10:30:00Z',
      lastModified: '2024-01-20T14:45:00Z',
      createdBy: 'System Admin',
      lastModifiedBy: 'John Doe',
    },
    {
      id: 2,
      roleName: 'Loan Officer',
      roleCode: 'LO',
      description: 'Manage loan applications and customer interactions',
      status: 'Active',
      createDate: '2024-01-16T09:15:00Z',
      lastModified: '2024-01-18T11:30:00Z',
      createdBy: 'Admin User',
      lastModifiedBy: 'Jane Smith',
    },
    {
      id: 3,
      roleName: 'Risk Analyst',
      roleCode: 'RA',
      description: 'Analyze and assess loan risks and creditworthiness',
      status: 'Active',
      createDate: '2024-01-17T13:20:00Z',
      lastModified: '2024-01-19T16:10:00Z',
      createdBy: 'HR Manager',
      lastModifiedBy: 'Mike Johnson',
    },
    {
      id: 4,
      roleName: 'Customer Service',
      roleCode: 'CS',
      description: 'Handle customer inquiries and support requests',
      status: 'Active',
      createDate: '2024-01-18T08:45:00Z',
      lastModified: '2024-01-21T12:25:00Z',
      createdBy: 'Team Lead',
      lastModifiedBy: 'Sarah Wilson',
    },
  ]);

  const handleRoleCreated = () => {
    console.log('Role created successfully');
    // In a real app, this would refresh the data
  };

  const handleRoleEdit = (row: Row<RoleData>) => {
    console.log('Editing role:', row.original);
    // In a real app, this would open an edit modal
  };

  // Create columns with the edit handler
  const columns = createColumns(handleRoleEdit);

  return (
    <div className="2xl:px-2 mt-8">
      <DataTable
        data={roles}
        columns={columns}
        onRoleCreated={handleRoleCreated}
      />
    </div>
  );
};

export default RolesPage;
