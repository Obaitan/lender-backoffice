'use client';

import { useState } from 'react';
import { ColumnDef, Row } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnHeader } from '@/components/table/ColumnHeader';
import Tooltip from '../../general/Tooltip';
import { TeamMember } from '@/types';
import SideModal from '@/components/layout/SideModal';
import EditUserForm from './EditUserForm';
import { formatDate } from '@/utils/functions';

// Define the props for ActionsCell
interface ActionsCellProps {
  row: Row<TeamMember>;
  onUserUpdated?: () => void;
}

// Component for the actions cell
const ActionsCell = ({ row, onUserUpdated }: ActionsCellProps) => {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [userData, setUserData] = useState<TeamMember | null>(null);

  const editTeamMember = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditModalOpen(true);
    // Set the current row data as user data for editing
    setUserData(row.original);
  };

  return (
    <div className="flex gap-1">
      <Tooltip content="Edit">
        <button
          onClick={editTeamMember}
          disabled={row.original?.roleCode.toLowerCase() === 'adm'}
          className="bg-gray-50 flex items-center justify-center h-9 w-9 text-gray-400 rounded-full hover:text-secondary-200 hover:bg-secondary-100 disabled:text-gray-50 disabled:cursor-not-allowed disabled:hover:bg-transparent cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
          </svg>
        </button>
      </Tooltip>

      {isEditModalOpen && (
        <SideModal
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
        >
          <EditUserForm
            userData={userData}
            closeForm={() => setEditModalOpen(false)}
            onUserUpdated={onUserUpdated}
          />
        </SideModal>
      )}
    </div>
  );
};

export const createColumns = (
  onUserUpdated?: () => void
): ColumnDef<TeamMember>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="z-30"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        onClick={(e) => e.stopPropagation()}
        aria-label="Select row"
        className="z-30"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'firstName',
    header: ({ column }) => <ColumnHeader column={column} title="Name" />,
    cell: ({ row }) => (
      <span>
        {row.original.firstName} {row.original.lastName}
      </span>
    ),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <ColumnHeader column={column} title="Email" />,
  },
  {
    accessorKey: 'roleCode',
    header: ({ column }) => <ColumnHeader column={column} title="Role Code" />,
  },
  {
    accessorKey: 'rmCode',
    header: ({ column }) => <ColumnHeader column={column} title="RM Code" />,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <ColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs capitalize ${
            row.original?.status?.toLowerCase() === 'active'
              ? 'bg-success-50 text-success-500'
              : 'bg-gray-50 text-gray-300'
          }`}
        >
          {row.original.status.toLowerCase()}
        </span>
      );
    },
  },
  {
    accessorKey: 'lastLogin',
    header: ({ column }) => <ColumnHeader column={column} title="Last Login" />,
    cell: ({ row }) => {
      const lastLogin = row.original.lastLogin;
      if (!lastLogin) return <span>Never</span>;

      const date = new Date(lastLogin);
      return <span>{formatDate(date)}</span>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionsCell row={row} onUserUpdated={onUserUpdated} />,
  },
];

// Backward compatibility export
export const columns = createColumns();
