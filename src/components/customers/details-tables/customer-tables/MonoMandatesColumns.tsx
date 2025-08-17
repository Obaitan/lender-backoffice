'use client';

import { useState } from 'react';
import { ColumnDef, Row } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnHeader } from '@/components/table/ColumnHeader';
import { formatDate, maskInput, formatNumber } from '@/utils/functions';
import { MonoMandate } from '@/types';
import SideModal from '@/components/layout/SideModal';
import MonoMandateDetails from './other-components/MonoMandateDetails';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { monoLinkedMandates } from '@/utils/dummyData';

interface ActionsCellProps {
  row: Row<MonoMandate>;
}

// ConfirmCancelMandateModal: Small modal for confirming mandate cancellation with OTP
interface ConfirmCancelMandateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (otp: string) => void;
  mandateNumber: string;
  mandateAmount: number;
}

const ConfirmCancelMandateModal = ({
  isOpen,
  onClose,
  onConfirm,
  mandateNumber,
  mandateAmount,
}: ConfirmCancelMandateModalProps) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (!otp) {
      setError('OTP is required');
      return;
    }
    setError('');
    onConfirm(otp);
    setOtp('');
    onClose();
  };

  const handleClose = () => {
    setOtp('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg px-6 py-4 w-full max-w-sm mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-primary-200">
            Cancel Mandate
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <span className="sr-only">Close</span>
            &times;
          </button>
        </div>
        <p className="text-sm text-gray-700 mb-4">
          Are you sure you want to cancel mandate{' '}
          <span className="font-bold">
            {mandateNumber} (₦ {mandateAmount.toLocaleString('en-US')})
          </span>
          ?
        </p>
        <div className="my-4">
          <label className="block text-sm text-gray-600 mb-2">
            Enter OTP to confirm
          </label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="OTP"
            className="mb-1 border rounded px-2 py-1 w-full"
            maxLength={6}
          />
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
        <div className="flex gap-3 py-2">
          <button
            onClick={handleClose}
            className="px-5 py-1.5 text-sm text-gray-500 border border-gray-200 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-5 py-1.5 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const ActionsCell = ({ row }: ActionsCellProps) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isCancelModalOpen, setCancelModalOpen] = useState(false);
  const mandateData = row.original;

  const handleViewDetails = () => {
    setModalOpen(true);
  };

  const handleInitiatDebit = () => {
    alert('Initiate Debit for ' + mandateData.mandateID);
  };

  const handleCancelMandate = () => {
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = () => {
    // TODO: Implement actual cancel logic with OTP
    // e.g., call API to cancel mandate with OTP
    // Show success/error toast as needed
    setCancelModalOpen(false);
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
            Mandate Details
          </DropdownMenuItem>

          {mandateData.status === 'active' && (
            <>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleInitiatDebit();
                }}
              >
                Initiate Debit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-error-300 hover:!text-error-300 hover:!bg-error-50/30"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancelMandate();
                }}
              >
                Cancel Mandate
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {isModalOpen && (
        <SideModal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
          <MonoMandateDetails
            mandateData={mandateData}
            linkedMandates={monoLinkedMandates}
          />
        </SideModal>
      )}

      <ConfirmCancelMandateModal
        isOpen={isCancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        mandateNumber={mandateData.mandateID}
        mandateAmount={mandateData.mandateAmount}
      />
    </>
  );
};

export const createColumns = (): ColumnDef<MonoMandate>[] => [
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
    accessorKey: 'mandateID',
    header: 'Mandate ID',
  },
  {
    accessorKey: 'mandateAmount',
    header: 'Mandate Amount',
    cell: ({ row }) => (
      <span>₦ {formatNumber(row.original?.mandateAmount)}</span>
    ),
  },
  {
    accessorKey: 'bank',
    header: 'Bank Details',
    cell: ({ row }) => (
      <>
        <span>{row.original?.bank}</span>
        <span className="mx-1">|</span>
        <span>{maskInput(row.original?.debitAccount, 3)}</span>
      </>
    ),
  },
  {
    accessorKey: 'dateCreated',
    header: ({ column }) => <ColumnHeader column={column} title="Date" />,
    cell: ({ row }) => formatDate(row.original?.dateCreated),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <ColumnHeader column={column} title="Status" />,
    cell: ({ row }) => (
      <span className="capitalize">{row.original?.status}</span>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];

export const columns: ColumnDef<MonoMandate>[] = createColumns();
