'use client';

import * as React from 'react';
import { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  FunnelIcon,
  ViewColumnsIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import { TablePagination } from '@/components/table/TablePagination';
import SideModal from '@/components/layout/SideModal';
import LogsDetailsComponent from './LogsDetails';
import { createColumns } from './LogsColumns';
import { useTableRegistration } from '@/components/table/MultiTableExportButton';

// Type for our log data
export interface LogData extends Record<string, unknown> {
  id: number;
  officer: string;
  email: string;
  role?: string; // Optional role
  supervisor?: string; // Optional supervisor
  ipAddress: string;
  action: string;
  comment: string;
  dateTime: string;
}

export interface DataTableProps {
  columns: ColumnDef<LogData, unknown>[];
  data: LogData[];
  emptyMessage?: string;
  columnFileName?: string;
}

export function DataTable({
  columns,
  data,
  emptyMessage = 'No records to display.',
  columnFileName,
}: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRowData, setEditingRowData] = useState<LogData | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | undefined>(
    undefined
  );
  const [roleName, setRoleName] = useState<string | undefined>(undefined);

  // Handle row edit - removed API call, using dummy data
  const handleRowEdit = async (rowData: LogData) => {
    setEditingRowData(rowData);
    setIsEditModalOpen(true);

    // Use dummy data instead of API call
    if (rowData.email) {
      // Mock profile data for demo purposes
      setProfilePicture('/docs/hju.png');
      setRoleName(rowData.role || 'User');
    } else {
      setProfilePicture(undefined);
      setRoleName(undefined);
    }
  };

  // Handle row click
  const handleRowClick = (row: any) => {
    handleRowEdit(row.original);
  };

  // Use createColumns if available, otherwise use provided columns
  const tableColumns =
    typeof createColumns === 'function'
      ? createColumns(handleRowEdit)
      : columns;

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const filteredColumns = [...table.getAllColumns()];
  if (filteredColumns.length > 1) {
    filteredColumns.splice(0, 1);
    filteredColumns.splice(filteredColumns.length - 1, 1);
  }

  const [selectedFilter, setSelectedFilter] = useState(
    filteredColumns[0]?.id || ''
  );

  // Get selected rows
  const selectedRows = table
    .getSelectedRowModel()
    .rows.map((row) => row.original);
  const selectedCount = selectedRows.length;

  // Memoize selected rows to prevent infinite re-renders
  const selectedTableRows = useMemo(
    () => table.getSelectedRowModel().rows.map((row) => row.original),
    [table.getSelectedRowModel().rows]
  );

  // Register this table with the export context - ExportButton functionality preserved
  useTableRegistration(
    'Audit Logs',
    data,
    selectedTableRows,
    selectedTableRows.length
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4">
        <div className="flex flex-wrap items-end gap-3">
          {filteredColumns.map(
            (column) =>
              column.id === selectedFilter && (
                <input
                  key={column.id}
                  placeholder={`Filter by ${column.id}...`}
                  value={
                    (table.getColumn(column.id)?.getFilterValue() as string) ??
                    ''
                  }
                  onChange={(event) =>
                    table
                      .getColumn(column.id)
                      ?.setFilterValue(event.target.value)
                  }
                  className="w-48 px-3 py-1.5 text-gray-700 border-b !border-b-gray-100 outline-b outline-0 focus:border-b-2 focus:!border-b-secondary-200 rounded-none capitalize text-sm"
                />
              )
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="bg-white border text-secondary-200 border-secondary-200 rounded p-2 hover:text-white hover:bg-secondary-200 outline-none">
                <FunnelIcon className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {filteredColumns.map((column) => (
                <DropdownMenuItem
                  key={column.id}
                  className={`capitalize cursor-pointer text-gray-700 hover:!bg-secondary-50 ${
                    selectedFilter === column.id
                      ? 'bg-secondary-50 text-secondary-200'
                      : ''
                  }`}
                  onClick={() => setSelectedFilter(column.id)}
                >
                  {column.id}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem
                onClick={() => setColumnFilters([])}
                className="text-error-300 hover:!text-error-300 hover:!bg-error-50 hover:!bg-opacity-30 cursor-pointer"
              >
                <XMarkIcon className="h-4 w-4 mr-1" />
                Clear Filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="bg-white border text-secondary-200 border-secondary-200 rounded p-1.5 hover:text-white hover:bg-secondary-200 outline-none">
                <ViewColumnsIcon className="h-6 w-6" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize text-gray-700"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded border">
        <Table>
          <TableHeader className="bg-secondary-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className="!text-secondary-200 !px-3"
                      key={header.id}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="text-gray-600">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={`hover:bg-[#f9f9f9] cursor-pointer  ${
                    row.getIsSelected() ? 'bg-[#f9f9f9]' : ''
                  }`}
                  onClick={() => handleRowClick(row)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="px-3 py-2" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="text-center py-6">
                    <Image
                      src="/images/no-records.png"
                      alt="No records"
                      height={144}
                      width={150}
                      priority
                      className="w-32 mx-auto mb-4"
                    />
                    <p className="text-gray-500 font-medium">{emptyMessage}</p>
                    <p className="text-gray-400 text-sm mt-2">
                      This table will display audit logs when available.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <TablePagination table={table} />

      {/* Edit Modal */}
      {isEditModalOpen && editingRowData && (
        <SideModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingRowData(null);
            setProfilePicture(undefined);
            setRoleName(undefined);
          }}
        >
          <LogsDetailsComponent
            log={editingRowData}
            profilePicture={profilePicture}
            roleName={roleName}
          />
        </SideModal>
      )}
    </div>
  );
}
