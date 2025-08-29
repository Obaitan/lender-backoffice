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
import { LogData } from './LogsDataTable';
import { formatDate, truncateString } from '@/utils/functions';

// Define the props for ActionsCell
interface ActionsCellProps {
  row: Row<LogData>;
  onRowEdit?: (row: LogData) => void;
}

// Component for the actions cell
const ActionsCell = ({ row, onRowEdit }: ActionsCellProps) => {
  const logData = row.original;

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRowEdit) {
      onRowEdit(logData);
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const createColumns = (onRowEdit?: (row: LogData) => void): ColumnDef<LogData>[] => [
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
    accessorKey: 'officer',
    header: ({ column }) => <ColumnHeader column={column} title="Officer" />,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <ColumnHeader column={column} title="Email" />,
  },
  {
    accessorKey: 'ipAddress',
    header: ({ column }) => <ColumnHeader column={column} title="IP Address" />,
  },
  {
    accessorKey: 'description',
    header: ({ column }) => <ColumnHeader column={column} title="Comment" />,
    cell: ({ row }) => <span>{truncateString(row.original?.comment, 45)}</span>,
  },
  {
    accessorKey: 'dateTime',
    header: ({ column }) => <ColumnHeader column={column} title="Date/Time" />,
    cell: ({ row }) => formatDate(row.original?.dateTime),
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionsCell row={row} onRowEdit={onRowEdit} />,
  },
];

// Keep the original columns export for backward compatibility
export const columns = createColumns();
