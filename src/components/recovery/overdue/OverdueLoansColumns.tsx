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
import { useState } from 'react';
import SideModal from '@/components/layout/SideModal';
import RecoverPayment from './RecoverPayment';

// Enhanced OverdueLoan interface with all required properties for RecoverPayment
export interface OverdueLoan {
  id: number;
  repaymentId: number;
  customerID: string;
  customerName: string;
  email: string;
  phoneNumber: string;
  loanID: string;
  loanNumber: string;
  repaymentNumber: string;
  amountDue: number;
  principalAmount: number;
  interestAmount: number;
  lateFee: number;
  outstandingAmount: number;
  outstandingRepayment: number;
  amountPaid: number;
  dateDisbursed: string;
  dueDate: string;
  repaymentDate: string;
  createDate: string;
  loanBalance: number;
  status: string;
  repaymentChannel: string;
  customerStatus: string;
  // Additional loan information
  loanAmount: number;
  loanDuration: number;
  loanStatus: string;
  vendorName: string;
  // Legacy properties for backward compatibility
  installmentNumber?: number;
  installmentsLeft?: number;
}

// ActionsCell for handling modal logic
const ActionsCell = ({ row, onRowEdit }: { row: Row<OverdueLoan>; onRowEdit: (data: OverdueLoan) => void }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const loanData = row.original;

  const handleRecoverPayment = (e: React.MouseEvent) => {
    e.stopPropagation();
    setModalOpen(true);
  };

  return (
    <>
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
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={handleRecoverPayment}
          >
            Recover Payment
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {isModalOpen && (
        <SideModal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
          <RecoverPayment loan={loanData} onClose={() => setModalOpen(false)} />
        </SideModal>
      )}
    </>
  );
};

export const createColumns = (onRowEdit: (data: OverdueLoan) => void): ColumnDef<OverdueLoan>[] => [
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
    header: ({ column }) => (
      <ColumnHeader column={column} title="Customer Name" />
    ),
  },
  {
    accessorKey: 'loanNumber',
    header: ({ column }) => (
      <ColumnHeader column={column} title="Loan Number" />
    ),
  },
  {
    accessorKey: 'amountDue',
    header: ({ column }) => (
      <ColumnHeader column={column} title="Amount Due (₦)" />
    ),
    cell: ({ row }) => (
      <span>{row.original?.amountDue?.toLocaleString('en-US')}</span>
    ),
  },
  {
    accessorKey: 'outstandingAmount',
    header: ({ column }) => (
      <ColumnHeader column={column} title="Outstanding (₦)" />
    ),
    cell: ({ row }) => (
      <span>{row.original?.outstandingAmount?.toLocaleString('en-US')}</span>
    ),
  },
  {
    accessorKey: 'dueDate',
    header: ({ column }) => <ColumnHeader column={column} title="Due Date" />,
    cell: ({ row }) => <span>{formatDate(row.original.dueDate, false)}</span>,
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionsCell row={row} onRowEdit={onRowEdit} />,
  },
];

// Keep the original columns export for backward compatibility
export const columns: ColumnDef<OverdueLoan>[] = createColumns(() => {});
