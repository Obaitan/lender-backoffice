'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnHeader } from '@/components/table/ColumnHeader';
import { formatDate } from '@/utils/functions';
import { InflightSalaryRecord } from '@/types';

export const columns: ColumnDef<InflightSalaryRecord>[] = [
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
    accessorKey: 'createDate',
    header: ({ column }) => (
      <ColumnHeader column={column} title="Salary Date" />
    ),
    cell: ({ row }) => formatDate(row.original.createDate),
  },
  {
    accessorKey: 'accountNumber',
    header: 'Account Number',
  },
  {
    accessorKey: 'amount',
    header: 'Amount (₦)',
    cell: ({ row }) => `${row.original.amount.toLocaleString('en-US')}`,
  },
];
