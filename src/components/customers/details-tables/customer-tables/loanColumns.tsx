'use client';

import { ColumnDef } from '@tanstack/react-table';
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
import { Loan } from '@/types';
import { formatDate } from '@/utils/functions';

export const columns: ColumnDef<Loan>[] = [
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
        aria-label="Select row"
        className="border-gray-300 z-30"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: 'loanNumber',
    header: ({ column }) => <ColumnHeader column={column} title="Loan ID" />,
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => <ColumnHeader column={column} title="Amount (₦)" />,
    cell: ({ row }) => `${row.original.amount.toLocaleString('en-US')}`,
  },
  {
    accessorKey: 'duration',
    header: ({ column }) => <ColumnHeader column={column} title="Tenure" />,
    cell: ({ row }) => `${row.original.duration} Days`,
  },
  {
    accessorKey: 'interest',
    header: ({ column }) => (
      <ColumnHeader column={column} title="Interest (₦)" />
    ),
    cell: ({ row }) => `${row.original.interest.toLocaleString('en-US')}`,
  },
  {
    accessorKey: 'createDate',
    header: ({ column }) => (
      <ColumnHeader column={column} title="Date Disbursed" />
    ),
    cell: ({ row }) => formatDate(row.original.createDate),
  },
  {
    accessorKey: 'totalRepaymentAmount',
    header: ({ column }) => (
      <ColumnHeader column={column} title="Total Repayment (₦)" />
    ),
    cell: ({ row }) =>
      `${row.original.totalRepaymentAmount.toLocaleString('en-US')}`,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <ColumnHeader column={column} title="Status" />,
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 rounded-full text-xs capitalize ${
          row.original.status.toLocaleLowerCase() === 'paid'
            ? 'bg-success-50 text-success-500'
            : row.original.status.toLocaleLowerCase() === 'active'
            ? 'bg-blue-50 text-blue-700'
            : 'bg-warning-50 text-warning-300'
        }`}
      >
        {row.original.status}
      </span>
    ),
  },
  {
    id: 'actions',
    cell: () => {
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
            <DropdownMenuItem className="cursor-pointer">
              Loan Details
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Export to CSV
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
