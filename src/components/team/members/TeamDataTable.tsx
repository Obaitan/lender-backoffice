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
  UserPlusIcon,
  ViewColumnsIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import { DataTableProps, TeamMember } from '@/types';
import { TablePagination } from '@/components/table/TablePagination';
import SideModal from '../../layout/SideModal';
import Tooltip from '../../general/Tooltip';
import AddUserForm from './AddUserForm';
import { createColumns } from './TeamColumns';
import EditUserForm from './EditUserForm';

interface TeamDataTableProps<TData extends Record<string, unknown>, TValue>
  extends DataTableProps<TData, TValue> {
  onUserUpdated?: () => void;
  columnFileName?: string;
}

export function DataTable<TData extends Record<string, unknown>, TValue>({
  columns,
  data,
  onUserUpdated,
  columnFileName,
  emptyMessage = 'No records to display.',
}: TeamDataTableProps<TData, TValue> & { emptyMessage?: string }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [addUserModal, setAddUserModal] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState<TeamMember | null>(
    null
  );

  const openUserModal = () => {
    setAddUserModal(true);
  };

  const closeUserModal = () => {
    setAddUserModal(false);
  };

  const tableColumns = columns || createColumns(onUserUpdated);

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

  // Get table name from the column file name prop
  let tableName = 'team-table-export.csv';
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
      <div className="flex items-center justify-between gap-4 pb-4">
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

        <div className="flex gap-3">
          <Tooltip content="Add Team Member">
            <button
              onClick={openUserModal}
              className="flex items-center justify-center text-secondary-200 h-9 w-9 rounded-full border border-secondary-200 hover:bg-secondary-200 hover:text-white"
            >
              <UserPlusIcon className="w-5 h-5" />
            </button>
          </Tooltip>

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
              table.getRowModel().rows.map((row) => {
                const rowData = row.original as TData;
                if (
                  typeof rowData === 'object' &&
                  rowData &&
                  'status' in rowData
                ) {
                  const isInactive =
                    rowData.status &&
                    String(rowData.status).toLowerCase() === 'inactive';
                  return (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                      className={`${row.getIsSelected() ? 'bg-[#f9f9f9]' : ''}`}
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
                  );
                } else {
                  return (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                      className={`hover:bg-[#f9f9f9] cursor-pointer  ${
                        row.getIsSelected() ? 'bg-[#f9f9f9]' : ''
                      }`}
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
                  );
                }
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={tableColumns.length}
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

      <SideModal isOpen={addUserModal} onClose={closeUserModal}>
        <AddUserForm onUserCreated={onUserUpdated} />
      </SideModal>

      {isEditModalOpen && selectedUserData && (
        <SideModal
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
        >
          <EditUserForm
            userData={selectedUserData}
            closeForm={() => setEditModalOpen(false)}
            onUserUpdated={onUserUpdated}
          />
        </SideModal>
      )}
    </div>
  );
}
