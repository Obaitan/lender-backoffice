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
import { Repayment } from '@/types';
import { formatDate, formatNumber } from '@/utils/functions';

// Define the props for ActionsCell
interface ActionsCellProps {
  row: Row<Repayment>;
  onRowEdit?: (row: Repayment) => void;
}

// Component for the actions cell
const ActionsCell = ({ row, onRowEdit }: ActionsCellProps) => {
  const repaymentData = row.original;

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRowEdit) {
      onRowEdit(repaymentData);
    }
  };

  return (
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
          onClick={handleViewDetails}
        >
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        >
          Record Early Payment
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const createColumns = (onRowEdit?: (row: Repayment) => void): ColumnDef<Repayment>[] => [
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
    accessorKey: 'customer.customerID',
    header: ({ column }) => (
      <ColumnHeader column={column} title="Customer ID" />
    ),
  },
  {
    accessorKey: 'loan.loanId',
    header: ({ column }) => <ColumnHeader column={column} title="Loan ID" />,
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => <ColumnHeader column={column} title="Amount" />,
    cell: ({ row }) => <span>₦ {formatNumber(row.original?.amount)}</span>,
  },
  {
    accessorKey: 'dueDate',
    header: ({ column }) => <ColumnHeader column={column} title="Due Date" />,
    cell: ({ row }) => <span>{formatDate(row.original?.dueDate, false)}</span>,
  },
  {
    accessorKey: 'loan.loanBalance',
    header: ({ column }) => (
      <ColumnHeader column={column} title="Loan Balance" />
    ),
    cell: ({ row }) => (
      <span>₦ {formatNumber(row.original?.loan.loanBalance)}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <ColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <div className="flex items-center">
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              status.toLowerCase() === 'paid'
                ? 'bg-green-50 text-green-800'
                : status.toLowerCase() === 'expected'
                ? 'bg-blue-50 text-blue-800'
                : 'bg-error-50 text-error-300'
            }`}
          >
            {status}
          </span>
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionsCell row={row} onRowEdit={onRowEdit} />,
  },
];

// Keep the original columns export for backward compatibility
export const columns = createColumns();
