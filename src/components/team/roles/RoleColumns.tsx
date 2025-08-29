'use client';

import { ColumnDef, Row } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnHeader } from '@/components/table/ColumnHeader';
import { formatDate, truncateString } from '@/utils/functions';
import { RoleData } from '@/types';
import Tooltip from '@/components/general/Tooltip';

// Define the props for ActionsCell
interface ActionsCellProps {
  row: Row<RoleData>;
  onEdit: (row: Row<RoleData>) => void;
}

// Component for the actions cell
const ActionsCell = ({ row, onEdit }: ActionsCellProps) => {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click when clicking the edit button
    onEdit(row);
  };

  return (
    <div className="flex gap-1">
      <Tooltip content="Edit">
        <button
          onClick={handleEdit}
          // disabled={row.original?.roleCode.toLocaleLowerCase() === 'adm'}
          className="flex items-center justify-center h-9 w-9 text-gray-300 rounded-full hover:text-secondary-200 hover:bg-secondary-50 disabled:text-gray-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
          </svg>
        </button>
      </Tooltip>
    </div>
  );
};

export const createColumns = (
  onRowEdit: (row: Row<RoleData>) => void
): ColumnDef<RoleData>[] => [
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
      <div onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="z-30"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'roleName',
    header: ({ column }) => <ColumnHeader column={column} title="Role Name" />,
  },
  {
    accessorKey: 'roleCode',
    header: ({ column }) => <ColumnHeader column={column} title="Role Code" />,
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <ColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      return <span>{truncateString(row.original.description)}</span>;
    },
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
          {row.original.status.toLocaleLowerCase()}
        </span>
      );
    },
  },
  {
    accessorKey: 'lastModified',
    header: ({ column }) => (
      <ColumnHeader column={column} title="Last Modified" />
    ),
    cell: ({ row }) => <span>{formatDate(row.original?.lastModified)}</span>,
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionsCell row={row} onEdit={onRowEdit} />,
  },
];
