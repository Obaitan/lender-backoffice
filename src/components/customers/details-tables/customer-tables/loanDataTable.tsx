'use client';

import * as React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
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
import { DataTableProps, Loan, LoanRepaymment } from '@/types';
import { TablePagination } from '@/components/table/TablePagination';
import SideModal from '@/components/layout/SideModal';
import CustomerLoanDetailsComponent from './other-components/CustomerLoanDetails';
import { GetLoanRepayments } from '@/services/apiQueries/customersDetails';
import ExportButton from '@/components/table/ExportButton';

export function DataTable<TData extends Record<string, unknown>, TValue>({
  columns,
  data,
  columnFileName,
  emptyMessage = 'No records to display.',
}: DataTableProps<TData, TValue> & {
  columnFileName?: string;
  emptyMessage?: string;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState<Loan | null>(null);
  const [loanRepayments, setLoanRepayments] = useState<LoanRepaymment[] | null>(
    null
  );

  const openModal = () => {
    setOpenDetailsModal(true);
  };

  const closeModal = () => {
    setOpenDetailsModal(false);
  };

  const table = useReactTable({
    data,
    columns,
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

  const handleRowClick = async (loan: Loan) => {
    setSelectedRowData(loan);
    openModal();

    // Fetch repayment data
    const repayments = await GetLoanRepayments.getRepayments(loan.loanNumber);
    setLoanRepayments(repayments);
  };

  // Get selected rows
  const selectedRows = table
    .getSelectedRowModel()
    .rows.map((row) => row.original);
  const selectedCount = selectedRows.length;

  // Get table name from the column file name prop
  let tableName = 'loan-table-export.csv';
  if (columnFileName) {
    tableName =
      columnFileName
        .replace(/Columns?$/, '')
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/_/g, '-')
        .toLowerCase() + '.csv';
  }

  return (
    <div>
      <div className="flex items-center gap-4 pb-4">
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="bg-white border text-secondary-200 border-secondary-200 rounded p-1.5 ml-auto hover:text-white hover:bg-secondary-200 outline-none">
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
        {data.length > 0 && (
          <ExportButton
            onClick={() => {}}
            selectedData={selectedRows}
            allData={data}
            selectedCount={selectedCount}
            allCount={data.length}
            filename={tableName}
            disabled={false}
          />
        )}
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
                  onClick={() =>
                    handleRowClick(row.original as unknown as Loan)
                  } // Store row data
                  className="cursor-pointer"
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
                      alt="Illustration image"
                      height={144}
                      width={150}
                      priority
                      className="w-32 mx-auto"
                    />
                    <p className="mt-2">{emptyMessage}</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <TablePagination table={table} />
      <SideModal isOpen={openDetailsModal} onClose={closeModal}>
        {selectedRowData && (
          <CustomerLoanDetailsComponent
            data={selectedRowData}
            repayments={loanRepayments}
          />
        )}
      </SideModal>
    </div>
  );
}
