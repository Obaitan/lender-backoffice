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
import { ColumnHeader } from '@/components/table/ColumnHeader';
import { formatDate } from '@/utils/functions';
import { useNavigateToDetailsPage } from '@/hooks/useNavigateToDetailsPage';

interface ActionsCellProps {
  row: Row<{
    id: number;
    customerID: string;
    name: string;
    email: string;
    phoneNumber: string;
    applicationDate: string;
    loanAmount: string;
  }>;
}

const ActionsCell = ({ row }: ActionsCellProps) => {
  const navigateToDetails = useNavigateToDetailsPage<{
    id: number;
    customerID: string;
    name: string;
    email: string;
    phoneNumber: string;
    applicationDate: string;
    loanAmount: string;
  }>();
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

export const columns: ColumnDef<{
  id: number;
  customerID: string;
  name: string;
  email: string;
  phoneNumber: string;
  applicationDate: string;
  loanAmount: string;
}>[] = [
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
    accessorKey: 'name',
    header: ({ column }) => <ColumnHeader column={column} title="Name" />,
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone Number',
  },
  {
    accessorKey: 'applicationDate',
    header: ({ column }) => (
      <ColumnHeader column={column} title="Application Date" />
    ),
    cell: ({ row }) => formatDate(row.original.applicationDate, false),
  },
  {
    accessorKey: 'loanAmount',
    header: ({ column }) => (
      <ColumnHeader column={column} title="Loan Amount (₦)" />
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
