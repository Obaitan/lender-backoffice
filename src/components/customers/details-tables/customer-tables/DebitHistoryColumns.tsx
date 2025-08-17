'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnHeader } from '@/components/table/ColumnHeader';
import { formatDate, maskInput, formatNumber } from '@/utils/functions';
import { PaystackDdDebitHistory } from '@/types';

export const columns: ColumnDef<PaystackDdDebitHistory>[] = [
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
    accessorKey: 'mandateID',
    header: 'Mandate ID',
  },
  {
    accessorKey: 'referenceID',
    header: 'Reference ID',
  },
  {
    accessorKey: 'bank',
    header: 'Bank Details',
    cell: ({ row }) => (
      <>
        <span>{row.original?.bank}</span>
        <span className="mx-1">|</span>
        <span>{maskInput(row.original?.debitAccount, 3)}</span>
      </>
    ),
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => <span>₦ {formatNumber(row.original?.amount)}</span>,
  },
  {
    accessorKey: 'date',
    header: ({ column }) => <ColumnHeader column={column} title="Date" />,
    cell: ({ row }) => formatDate(row.original?.date),
  },
  { accessorKey: 'status', header: 'Status' },
];
