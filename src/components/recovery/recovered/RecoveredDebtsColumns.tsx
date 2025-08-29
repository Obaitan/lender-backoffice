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
import RecoveryDetailsComponent from './RecoveryDetails';

export interface RecoveredPayment {
  id: number;
  customerID: string;
  loanID: string;
  amountOwed: number;
  dueDate: string;
  amountRecovered: number;
  dateRecovered: string;
  customerName?: string;
  repaymentNumber?: string;
  phoneNumber?: string;
  email?: string;
  recoveryChannel?: string;
  installmentsLeft?: number;
  loanBalance?: number;
  repaymentInstallment?: number;
  recoveryReference?: string;
  loanNumber?: string;
}

// ActionsCell for handling modal logic
const ActionsCell = ({
  row,
}: {
  row: Row<RecoveredPayment>;
  onRowEdit: (data: RecoveredPayment) => void;
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const recoveryData = row.original;

  const handleRecoveryDetails = (e: React.MouseEvent) => {
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
            onClick={handleRecoveryDetails}
          >
            Recovery Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {isModalOpen && (
        <SideModal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
          <RecoveryDetailsComponent recoveryData={recoveryData} />
        </SideModal>
      )}
    </>
  );
};

export const createColumns = (
  onRowEdit: (data: RecoveredPayment) => void
): ColumnDef<RecoveredPayment>[] => [
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
    accessorKey: 'loanID',
    header: ({ column }) => <ColumnHeader column={column} title="Loan ID" />,
  },
  {
    accessorKey: 'amountOwed',
    header: ({ column }) => (
      <ColumnHeader column={column} title="Amount Owed (₦)" />
    ),
    cell: ({ row }) => (
      <span>{row.original?.amountOwed?.toLocaleString('en-US')}</span>
    ),
  },
  {
    accessorKey: 'dueDate',
    header: ({ column }) => <ColumnHeader column={column} title="Due Date" />,
    cell: ({ row }) => {
      return <span>{formatDate(row.original?.dueDate, false)}</span>;
    },
  },
  {
    accessorKey: 'amountRecovered',
    header: ({ column }) => (
      <ColumnHeader column={column} title="Amount Recovered (₦)" />
    ),
    cell: ({ row }) => (
      <span>{row.original?.amountRecovered?.toLocaleString('en-US')}</span>
    ),
  },
  {
    accessorKey: 'dateRecovered',
    header: ({ column }) => (
      <ColumnHeader column={column} title="Date Recovered" />
    ),
    cell: ({ row }) => {
      return <span>{formatDate(row.original?.dateRecovered, false)}</span>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionsCell row={row} onRowEdit={onRowEdit} />,
  },
];

// Keep the original columns export for backward compatibility
export const columns: ColumnDef<RecoveredPayment>[] = createColumns(() => {});
