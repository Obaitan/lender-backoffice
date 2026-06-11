'use client';

import { createColumns } from '@/components/team/members/TeamColumns';
import { DataTable } from '@/components/team/members/TeamDataTable';
import { TeamMember } from '@/types';

export default function MembersPage() {
  const team: TeamMember[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Adebayo',
      email: 'john.adebayo@lender.com',
      phoneNumber: '+234-801-234-5678',
      roleCode: 'MGR',
      rmCode: 'RM001',
      roleName: 'Manager',
      superiorOfficer: 'David Okoro',
      lastModified: '2024-01-15T10:30:00Z',
      status: 'Active',
      createDate: '2023-06-15T08:00:00Z',
      createdBy: 'admin@lender.com',
      lastModifiedBy: 'admin@lender.com',
      profilePicture: '/docs/hju.png',
      profilePictureExtension: 'svg',
      lastLogin: '2024-01-15T10:30:00Z',
    },
    {
      id: 2,
      firstName: 'Sarah',
      lastName: 'Okafor',
      email: 'sarah.okafor@lender.com',
      phoneNumber: '+234-802-345-6789',
      roleCode: 'AGT',
      rmCode: 'RM002',
      roleName: 'Agent',
      superiorOfficer: 'John Adebayo',
      lastModified: '2024-01-14T14:20:00Z',
      status: 'Active',
      createDate: '2023-07-20T09:15:00Z',
      createdBy: 'admin@lender.com',
      lastModifiedBy: 'john.adebayo@lender.com',
      profilePicture: '/images/avatar.svg',
      profilePictureExtension: 'svg',
      lastLogin: '2024-01-14T14:20:00Z',
    },
    {
      id: 3,
      firstName: 'Michael',
      lastName: 'Eze',
      email: 'michael.eze@lender.com',
      phoneNumber: '+234-803-456-7890',
      roleCode: 'SUP',
      rmCode: 'RM003',
      roleName: 'Supervisor',
      superiorOfficer: 'David Okoro',
      lastModified: '2024-01-10T09:15:00Z',
      status: 'Active',
      createDate: '2023-05-10T10:30:00Z',
      createdBy: 'admin@lender.com',
      lastModifiedBy: 'david.okoro@lender.com',
      profilePicture: '/docs/hju.png',
      profilePictureExtension: 'svg',
      lastLogin: '2024-01-10T09:15:00Z',
    },
    {
      id: 4,
      firstName: 'Grace',
      lastName: 'Nwosu',
      email: 'grace.nwosu@lender.com',
      phoneNumber: '+234-804-567-8901',
      roleCode: 'AGT',
      rmCode: 'RM004',
      roleName: 'Agent',
      superiorOfficer: 'Michael Eze',
      lastModified: '2024-01-15T16:45:00Z',
      status: 'Active',
      createDate: '2023-08-05T11:00:00Z',
      createdBy: 'admin@lender.com',
      lastModifiedBy: 'michael.eze@lender.com',
      profilePicture: '/images/avatar.svg',
      profilePictureExtension: 'svg',
      lastLogin: '2024-01-15T16:45:00Z',
    },
    {
      id: 5,
      firstName: 'David',
      lastName: 'Okoro',
      email: 'david.okoro@lender.com',
      phoneNumber: '+234-805-678-9012',
      roleCode: 'ADM',
      rmCode: 'RM005',
      roleName: 'Administrator',
      superiorOfficer: 'N/A',
      lastModified: '2024-01-15T08:00:00Z',
      status: 'Active',
      createDate: '2023-01-01T08:00:00Z',
      createdBy: 'system@lender.com',
      lastModifiedBy: 'system@lender.com',
      profilePicture: '/docs/hju.png',
      profilePictureExtension: 'svg',
      lastLogin: '2024-01-15T08:00:00Z',
    },
  ];

  const handleUserUpdated = () => {
    // Handle user update - in a real app, this would refresh the data
    console.log('User updated');
  };

  return (
    <div className="2xl:px-2 mt-8">
      <DataTable
        columns={createColumns(handleUserUpdated)}
        data={team}
        onUserUpdated={handleUserUpdated}
        columnFileName="TeamColumns"
        emptyMessage="No team members found."
      />
    </div>
  );
}
