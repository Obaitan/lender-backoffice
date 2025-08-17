'use client';

import { ColumnDef, Row } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CustomerTable } from '@/types';
import { ColumnHeader } from '@/components/table/ColumnHeader';
import { formatDate } from '@/utils/functions';
import { useNavigateToDetailsPage } from '@/hooks/useNavigateToDetailsPage';

interface ActionsCellProps {
  row: Row<CustomerTable>;
}

const ActionsCell = ({ row }: ActionsCellProps) => {
  const navigateToDetails = useNavigateToDetailsPage<CustomerTable>();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-8 w-8 flex justify-center items-center rounded-full hover:bg-background outline-none">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => navigateToDetails(row)}
        >
          Customer Details
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<CustomerTable>[] = [
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
        onClick={(e) => e.stopPropagation()}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        onClick={(e) => e.stopPropagation()}
        aria-label="Select row"
        className="border-gray-300 z-30"
        onClick={(e) => e.stopPropagation()}
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
    cell: ({ row }) => {
      const value = row.original?.customerID;
      return <span>{value ? value : 'No data'}</span>;
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <ColumnHeader column={column} title="Name" />,
    cell: ({ row }) => {
      const value = row.original?.name;
      return <span>{value ? value : 'No data'}</span>;
    },
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone Number',
    cell: ({ row }) => {
      const value = row.original?.phoneNumber;
      return <span>{value ? value : 'No data'}</span>;
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => {
      const value = row.original?.email;
      return <span>{value ? value : 'No data'}</span>;
    },
  },
  {
    accessorKey: 'rmCode',
    header: 'RM Code',
    cell: ({ row }) => {
      const value = row.original?.rmCode;
      return <span>{value ? value : 'No data'}</span>;
    },
  },
  {
    accessorKey: 'signUpDate',
    header: ({ column }) => (
      <ColumnHeader column={column} title="Sign Up Date" />
    ),
    cell: ({ row }) => {
      const value = row.original?.signUpDate;
      return <span>{value ? formatDate(value, false) : 'No data'}</span>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
