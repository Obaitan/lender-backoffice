'use client';

import { ColumnDef, Row } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CustomerRequest } from '@/types';
import { ColumnHeader } from '@/components/table/ColumnHeader';
import { useNavigateToDetailsPage } from '@/hooks/useNavigateToDetailsPage';
import { formatDate } from '@/utils/functions';

interface ActionsCellProps {
  row: Row<CustomerRequest>;
  onRowEdit?: (row: Row<CustomerRequest>) => void;
}

const ActionsCell = ({ row, onRowEdit }: ActionsCellProps) => {
  const navigateToDetails = useNavigateToDetailsPage<CustomerRequest>();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          className="h-8 w-8 flex justify-center items-center rounded-full hover:bg-background outline-none"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            navigateToDetails(row);
          }}
        >
          Customer Details
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const createColumns = (onRowEdit?: (row: Row<CustomerRequest>) => void): ColumnDef<CustomerRequest>[] => [
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
        className="border-gray-300 z-30"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        onClick={(e) => e.stopPropagation()}
        aria-label="Select row"
        className="border-gray-300 z-30"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'customerID',
    header: ({ column }) => (
      <ColumnHeader column={column} title="Customer ID" />
    ),
  },
  {
    accessorKey: 'customerName',
    header: ({ column }) => <ColumnHeader column={column} title="Name" />,
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone Number',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'createDate',
    header: ({ column }) => (
      <ColumnHeader column={column} title="Request Date" />
    ),
    cell: ({ row }) => (
      <span>{formatDate(row.original.createDate, false)}</span>
    ),
  },
  {
    accessorKey: 'requestType',
    header: ({ column }) => (
      <ColumnHeader column={column} title="Request Type" />
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <ColumnHeader column={column} title="Status" />
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionsCell row={row} onRowEdit={onRowEdit} />,
  },
];

// Keep backward compatibility
export const columns = createColumns();
