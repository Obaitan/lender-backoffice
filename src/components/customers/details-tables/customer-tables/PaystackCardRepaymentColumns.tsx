'use client';

import { useState } from 'react';
import { ColumnDef, Row } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnHeader } from '@/components/table/ColumnHeader';
import { formatDate, formatNumber } from '@/utils/functions';
import { PaystackCardRepayment } from '@/types';
import SideModal from '@/components/layout/SideModal';
import PaystackCardRepaymentDetails from './other-components/PaystackCardRepaymentDetails';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ActionsCellProps {
  row: Row<PaystackCardRepayment>;
}

const ActionsCell = ({ row }: ActionsCellProps) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const repaymentData = row.original;

  const handleViewDetails = () => {
    setModalOpen(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <button className="h-8 w-8 flex justify-center items-center rounded-full hover:bg-background outline-none">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails();
            }}
          >
            Repayment Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isModalOpen && (
        <SideModal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
          <PaystackCardRepaymentDetails repayment={repaymentData} />
        </SideModal>
      )}
    </>
  );
};

export const createColumns = (): ColumnDef<PaystackCardRepayment>[] => [
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
        aria-label="Select row"
        className="border-gray-300 z-30"
        onClick={(e) => e.stopPropagation()}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'loanNumber',
    header: 'Mandate ID',
  },
  {
    accessorKey: 'transactionRef',
    header: 'Transaction Reference',
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
  {
    accessorKey: 'method',
    header: 'Payment Method',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];

export const columns: ColumnDef<PaystackCardRepayment>[] = createColumns();
