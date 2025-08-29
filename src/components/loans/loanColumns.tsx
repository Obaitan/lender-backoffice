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
import { ColumnHeader } from '@/components/table/ColumnHeader';
import { FormattedLoanData } from '@/types';
import { useState } from 'react';
import SideModal from '@/components/layout/SideModal';
import LoanDetailsComponent from './LoanDetails';

// Define the props for ActionsCell
interface ActionsCellProps {
  row: Row<FormattedLoanData>;
  onRowEdit?: (rowData: FormattedLoanData) => void;
}

const ActionsCell = ({ row, onRowEdit }: ActionsCellProps) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const loanData = row.original;

  const handleViewDetails = () => {
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
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails();
            }}
          >
            Loan Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {isModalOpen && (
        <SideModal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
          <LoanDetailsComponent loan={loanData} />
        </SideModal>
      )}
    </>
  );
};

export const createColumns = (onRowEdit?: (rowData: FormattedLoanData) => void): ColumnDef<FormattedLoanData>[] => [
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
    accessorKey: 'name',
    header: ({ column }) => <ColumnHeader column={column} title="Name" />,
  },
  {
    accessorKey: 'loanAmount',
    header: ({ column }) => (
      <ColumnHeader column={column} title="Loan Amount" />
    ),
    cell: ({ row }) => <span>₦ {row.original?.loanAmount}</span>,
  },
  {
    accessorKey: 'disbursementDate',
    header: ({ column }) => (
      <ColumnHeader column={column} title="Disbursement Date" />
    ),
  },
  {
    accessorKey: 'tenure',
    header: ({ column }) => <ColumnHeader column={column} title="Tenure" />,
    cell: ({ row }) => <span>{row.original.tenure} months</span>,
  },
  {
    accessorKey: 'paid',
    header: ({ column }) => <ColumnHeader column={column} title="Paid" />,
    cell: ({ row }) => <span>₦ {row.original?.paid}</span>,
  },
  {
    accessorKey: 'outstanding',
    header: ({ column }) => (
      <ColumnHeader column={column} title="Outstanding" />
    ),
    cell: ({ row }) => <span>₦ {row.original?.outstanding}</span>,
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionsCell row={row} onRowEdit={onRowEdit} />,
  },
];

export const columns = createColumns();
