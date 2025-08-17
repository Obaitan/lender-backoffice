'use client';

import { useState } from 'react';
import { ColumnDef, Row } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { formatDate, formatNumber, maskInput } from '@/utils/functions';
import { MonoMandate } from '@/types';
import SideModal from '@/components/layout/SideModal';
import MonoEmandateDetails from './other-components/MonoEmandateDetails';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { monoEmandatePaymentRecords } from '@/utils/dummyData';

interface ActionsCellProps {
  row: Row<MonoMandate>;
  onRowEdit?: (rowData: MonoMandate) => void;
}

const ActionsCell = ({ row, onRowEdit }: ActionsCellProps) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isCancelModalOpen, setCancelModalOpen] = useState(false);
  const mandateData = row.original;

  const handleViewDetails = () => {
    setModalOpen(true);
  };

  const handleInitiatDebit = () => {
    alert('Initiate E-mandate Debit for ' + mandateData.mandateID);
  };

  const handleCancelEmandate = () => {
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = () => {
    // TODO: Implement actual cancel logic with OTP for e-mandate
    // e.g., call API to cancel e-mandate with OTP
    // Show success/error toast as needed
    setCancelModalOpen(false);
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
            View Details
          </DropdownMenuItem>

          {mandateData.status === 'active' && (
            <>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleInitiatDebit}
              >
                Initiate E-mandate Debit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-error-300 hover:!text-error-300 hover:!bg-error-50/30"
                onClick={handleCancelEmandate}
              >
                Cancel E-mandate
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {isModalOpen && (
        <SideModal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
          <MonoEmandateDetails
            mandateData={mandateData}
            paymentRecords={monoEmandatePaymentRecords.filter(
              payment => payment.mandateID === mandateData.mandateID
            )}
          />
        </SideModal>
      )}

      <ConfirmCancelEmandateModal
        isOpen={isCancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        mandateNumber={mandateData.mandateID}
        mandateAmount={mandateData.mandateAmount}
      />
    </>
  );
};

// ConfirmCancelEmandateModal: Small modal for confirming e-mandate cancellation with OTP
interface ConfirmCancelEmandateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (otp: string) => void;
  mandateNumber: string;
  mandateAmount: number;
}

const ConfirmCancelEmandateModal = ({
  isOpen,
  onClose,
  onConfirm,
  mandateNumber,
  mandateAmount,
}: ConfirmCancelEmandateModalProps) => {
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
            Cancel E-mandate
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
          Are you sure you want to cancel e-mandate{' '}
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

export const createColumns = (onRowEdit?: (rowData: MonoMandate) => void): ColumnDef<MonoMandate>[] => [
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
    accessorKey: 'mandateID',
    header: 'Mandate Id',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="text-gray-400 text-sm">📋</span>
        <span className="text-sm text-gray-700">{row.original?.mandateID}</span>
      </div>
    ),
  },
  {
    accessorKey: 'loanID',
    header: 'Loan ID',
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
    accessorKey: 'mandateAmount',
    header: 'Total Amout',
    cell: ({ row }) => (
      <span>₦ {formatNumber(row.original?.mandateAmount)}</span>
    ),
  },
  {
    accessorKey: 'progress',
    header: 'Progress',
    cell: ({ row }) => {
      const progress = row.original?.progress || 0;
      return (
        <div className="flex items-center gap-2">
          <div className="w-12 h-2 bg-[#eee] rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-200 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-gray-600">{progress}%</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'startDate',
    header: 'Start Date',
    cell: ({ row }) => (
      <span>{formatDate(row.original?.startDate, false)}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original?.status?.toUpperCase();
      const isApproved = status === 'APPROVED';
      const isCancelled = status === 'CANCELLED';
      const isUnauthorized = status === 'UNAUTHORIZED';

      if (isUnauthorized) {
        return (
          <button className="px-2.5 py-1 rounded text-white font-medium bg-primary-200 hover:opacity-85 transition-all duration-300">
            Create Mandate
          </button>
        );
      }

      return (
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${
            isApproved
              ? 'text-green-700 bg-green-50'
              : isCancelled
              ? 'text-red-700 bg-red-50'
              : 'text-gray-700 bg-gray-50'
          }`}
        >
          {status || 'UNKNOWN'}
        </span>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];

export const columns = createColumns();