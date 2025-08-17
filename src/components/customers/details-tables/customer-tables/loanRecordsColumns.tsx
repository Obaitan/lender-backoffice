'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnHeader } from '@/components/table/ColumnHeader';
import { formatDate } from '@/utils/functions';
import { InflightLoanRecord } from '@/types';

export const columns: ColumnDef<InflightLoanRecord, unknown>[] = [
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
    accessorKey: 'disbursementDate',
    header: ({ column }) => (
      <ColumnHeader column={column} title="Disbursement Date" />
    ),
    cell: ({ row }) => formatDate(row.original.disbursementDate),
  },
  {
    accessorKey: 'loanProvider',
    header: ({ column }) => (
      <ColumnHeader column={column} title="Loan Provider" />
    ),
  },
  {
    accessorKey: 'loanTenure',
    header: 'Loan Tenure',
  },
  {
    accessorKey: 'loanAmount',
    header: 'Loan Amount (₦)',
    cell: ({ row }) => `${row.original.loanAmount.toLocaleString('en-US')}`,
  },
  {
    accessorKey: 'loanBalance',
    header: 'Loan Balance (₦)',
    cell: ({ row }) => `${row.original.loanBalance.toLocaleString('en-US')}`,
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
];
