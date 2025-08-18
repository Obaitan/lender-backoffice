'use client';

import { useState } from 'react';
import { ColumnDef, Row } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnHeader } from '@/components/table/ColumnHeader';
import { formatDate, truncateString } from '@/utils/functions';
import Tooltip from '@/components/general/Tooltip';
import SideModal from '@/components/layout/SideModal';
import EditMessageTemplate from './EditMessageTemplate';

export type MessageTemplate = {
  title: string;
  message: string;
  createdByName: string;
  createdByEmail: string;
  createdAt: string;
  status: string;
};

// Define the props for ActionsCell
interface ActionsCellProps {
  row: Row<MessageTemplate>;
}

// Component for the actions cell
const ActionsCell = ({ row }: ActionsCellProps) => {
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const editMessageTemplate = () => {
    setEditModalOpen(true);
  };

  return (
    <div className="flex gap-1">
      <Tooltip content="Edit">
        <button
          onClick={editMessageTemplate}
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

      {isEditModalOpen && (
        <SideModal
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
        >
          <EditMessageTemplate
            closeForm={() => setEditModalOpen(false)}
            template={row.original}
          />
        </SideModal>
      )}
    </div>
  );
};

export const columns: ColumnDef<MessageTemplate>[] = [
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
        aria-label="Select row"
        className="z-30"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => <ColumnHeader column={column} title="Title" />,
  },
  {
    accessorKey: 'message',
    header: ({ column }) => <ColumnHeader column={column} title="Message" />,
    cell: ({ row }) => {
      return <span>{truncateString(row.original.message, 48)}</span>;
    },
  },
  {
    accessorKey: 'createdByName',
    header: ({ column }) => <ColumnHeader column={column} title="Created By" />,
    cell: ({ row }) => {
      return (
        <>
          <p>{row.original?.createdByName}</p>
          <p className="text-xs text-gray-400">
            {row.original?.createdByEmail}
          </p>
        </>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <ColumnHeader column={column} title="Created At" />,
    cell: ({ row }) => {
      return <span>{formatDate(row.original?.createdAt)}</span>;
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
    id: 'actions',
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
