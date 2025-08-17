'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { formatDate, formatNumber } from '@/utils/functions';
import { MonoMandateLoan } from '@/types';
import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react';

export const columns: ColumnDef<MonoMandateLoan>[] = [
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
        onClick={(e) => {
          e.stopPropagation(); // Prevent row click from firing
        }}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'expander',
    header: '',
    cell: ({ row }) => {
      return row.getCanExpand() ? (
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent row click from firing
            row.getToggleExpandedHandler()();
          }}
          className="p-1 hover:bg-gray-50 rounded"
        >
          {row.getIsExpanded() ? (
            <ChevronDownIcon className="h-4 w-4" />
          ) : (
            <ChevronRightIcon className="h-4 w-4" />
          )}
        </button>
      ) : null;
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'loanID',
    header: 'Loan ID',
  },
  {
    accessorKey: 'amount',
    header: 'Application Amount',
    cell: ({ row }) => <span>₦ {formatNumber(row.original?.amount)}</span>,
  },
  {
    accessorKey: 'loanTerm',
    header: 'Loan Term',
    cell: ({ row }) => <span>{`${row.original?.loanTerm} Month(s)`}</span>,
  },
  {
    accessorKey: 'totalRepayment',
    header: 'Repayment Amount',
    cell: ({ row }) => {
      const totalRepayment = row.original?.totalRepayment;
      const amount = typeof totalRepayment === 'number' ? totalRepayment : 0;
      return <span>₦ {formatNumber(amount)}</span>;
    },
  },
  {
    accessorKey: 'dateCreated',
    header: 'Date Created',
    cell: ({ row }) => (
      <span>
        {row.original?.applicationStatus.toLowerCase() !== 'approved'
          ? 'Nil'
          : formatDate(row.original?.dateCreated, false)}
      </span>
    ),
  },
  {
    accessorKey: 'applicationStatus',
    header: 'Application Status',
    cell: ({ row }) => (
      <span
        className={`text-xs font-medium px-2 py-1 rounded-full uppercase ${
          row.original?.applicationStatus.toLowerCase() === 'approved'
            ? 'text-green-700 bg-green-50'
            : 'text-orange-500 bg-red-50'
        }`}
      >
        {row.original?.applicationStatus || 'Unknown'}
      </span>
    ),
  },
  // {
  //   id: 'actions',
  //   cell: () => <ActionsCell />,
  // },
];
