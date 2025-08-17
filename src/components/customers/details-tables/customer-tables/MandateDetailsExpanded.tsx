'use client';

import { useState } from 'react';
import { formatDate, formatNumber, maskInput } from '@/utils/functions';
import { MonoMandate } from '@/types';

interface LoanData {
  id: number;
  loanID: string;
  customerName: string;
  amount: number;
  date: string;
  dateCreated: string;
  interest: number;
  status: 'Active' | 'Paid' | 'Overdue';
  applicationStatus: string;
  paymentMethod: string;
  totalRepayment: number;
  repaymentAmount: number;
  loanBalance: number;
  penalInterest: number;
  duration: number;
  loanTerm: number;
  monthlyRepayment: number;
}
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import SideModal from '@/components/layout/SideModal';
import MonoEmandateDetails from './other-components/MonoEmandateDetails';
import CreateMandateModal from '@/components/modals/CreateMandateModal';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { monoEmandatePaymentRecords } from '@/utils/dummyData';

interface MandateDetailsExpandedProps {
  mandates: MonoMandate[];
  customerID?: string;
  loanData?: LoanData;
}

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

interface ActionsCellProps {
  mandate: MonoMandate;
}

const ActionsCell = ({ mandate }: ActionsCellProps) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isCancelModalOpen, setCancelModalOpen] = useState(false);

  const handleViewDetails = () => {
    setModalOpen(true);
  };

  const handleInitiatDebit = () => {
    alert('Initiate E-mandate Debit for ' + mandate.mandateID);
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
          <button className="h-8 w-8 flex justify-center items-center rounded-full hover:bg-background outline-none">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={handleViewDetails}
          >
            Mandate Details
          </DropdownMenuItem>

          {mandate.status === 'active' && (
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
            mandateData={mandate}
            paymentRecords={monoEmandatePaymentRecords.filter(
              (payment) => payment.mandateID === mandate.mandateID
            )}
          />
        </SideModal>
      )}

      <ConfirmCancelEmandateModal
        isOpen={isCancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        mandateNumber={mandate.mandateID}
        mandateAmount={mandate.mandateAmount}
      />
    </>
  );
};

export default function MandateDetailsExpanded({
  mandates,
  customerID = '',
  loanData,
}: MandateDetailsExpandedProps) {
  const [selectedMandateForModal, setSelectedMandateForModal] =
    useState<MonoMandate | null>(null);
  const [isRowModalOpen, setIsRowModalOpen] = useState(false);
  const [isCreateMandateModalOpen, setIsCreateMandateModalOpen] = useState(false);
  const [selectedMandateForCreation, setSelectedMandateForCreation] = useState<MonoMandate | null>(null);

  if (!mandates || mandates.length === 0) {
    return (
      <div className="p-6 bg-[#f9f9f9] rounded-md">
        <p className="text-sm text-center text-gray-500">
          No mandate details available for this loan.
        </p>
      </div>
    );
  }

  const handleRowClick = (mandate: MonoMandate) => {
    setSelectedMandateForModal(mandate);
    setIsRowModalOpen(true);
  };

  const handleCreateMandate = (mandate: MonoMandate) => {
    console.log('Creating mandate - CustomerID:', customerID);
    console.log('Creating mandate - Mandate:', mandate);
    setSelectedMandateForCreation(mandate);
    setIsCreateMandateModalOpen(true);
  };

  return (
    <div className="px-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="!text-gray-700 !px-3 text-xs">
              Mandate Id
            </TableHead>
            <TableHead className="!text-gray-700 !px-3 text-xs">
              Bank Details
            </TableHead>
            <TableHead className="!text-gray-700 !px-3 text-xs">
              Total Amount
            </TableHead>
            <TableHead className="!text-gray-700 !px-3 text-xs">
              Progress
            </TableHead>
            <TableHead className="!text-gray-700 !px-3 text-xs">
              Start Date
            </TableHead>
            <TableHead className="!text-gray-700 !px-3 text-xs">
              End Date
            </TableHead>
            <TableHead className="!text-gray-700 !px-3 text-xs">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-gray-500">
          {mandates.map((mandate, index) => (
            <TableRow
              key={String(mandate.mandateReference || mandate.mandateID || mandate.id || index)}
              className="cursor-pointer bg-[#f8f8f8] hover:bg-[#f4f4f4] border-b border-gray-100"
              onClick={() => handleRowClick(mandate)}
              data-mandate-id={mandate.mandateReference || mandate.mandateID}
            >
              {/* Mandate ID */}
              <TableCell className="px-3 py-2.5">
                {mandate.status?.toLowerCase() !== 'approved' ? (
                  <span className="text-xs">Nil</span>
                ) : (
                  <div className="flex items-center gap-2 text-xs">
                    <span>📋</span>
                    <span>{String(mandate.mandateReference || mandate.mandateID || 'N/A')}</span>
                  </div>
                )}
              </TableCell>

              {/* Bank Details */}
              <TableCell className="px-3 py-2.5">
                <span className="text-xs">{String(mandate.bankName || 'N/A')}</span>
                <span className="mx-1 text-xs">|</span>
                <span className="text-xs">
                  {maskInput(String(mandate.accountNumber || ''), 3)}
                </span>
              </TableCell>

              {/* Total Amount */}
              <TableCell className="px-3 py-2.5">
                <span className="text-xs">
                  ₦ {formatNumber(Number(mandate.amount) || 0)}
                </span>
              </TableCell>

              {/* Progress */}
              <TableCell className="px-3 py-2.5">
                {mandate.status?.toLowerCase() !== 'approved' ? (
                  <span className="text-xs">Nil</span>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-2 bg-[#eee] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-200 rounded-full transition-all"
                        style={{ width: `${mandate.progress || 0}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">
                      {mandate.progress || 0}%
                    </span>
                  </div>
                )}
              </TableCell>

              {/* Start Date */}
              <TableCell className="px-3 py-2.5">
                {mandate.status?.toLowerCase() !== 'approved' ? (
                  <span className="text-xs">Nil</span>
                ) : (
                  <span className="text-xs">
                    {formatDate(String(mandate.startDate || ''), false)}
                  </span>
                )}
              </TableCell>

              {/* End Date */}
              <TableCell className="px-3 py-2.5">
                {mandate.status?.toLowerCase() !== 'approved' ? (
                  <span className="text-xs">Nil</span>
                ) : (
                  <span className="text-xs">
                    {formatDate(String(mandate.endDate || ''), false)}
                  </span>
                )}
              </TableCell>

              {/* Status */}
              <TableCell className="px-3 py-2.5">
                {(() => {
                  const status = mandate.status?.toUpperCase();
                  const isApproved = status === 'APPROVED';
                  const isCancelled = status === 'CANCELLED';
                  const isDiscovered = status === 'DISCOVERED';

                  if (isDiscovered) {
                    return (
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click from firing
                          handleCreateMandate(mandate);
                        }}
                        className="px-2.5 py-1 rounded text-white text-xs font-medium bg-primary-200 hover:opacity-85 transition-all duration-300"
                      >
                        Create Mandate
                      </button>
                    );
                  }

                  return (
                    <span
                      className={`text-[11px] font-medium px-2 py-1 rounded-full ${
                        isApproved
                          ? 'text-green-700 bg-green-50'
                          : isCancelled
                          ? 'text-red-700 bg-red-50'
                          : isDiscovered
                          ? 'text-yellow-700 bg-yellow-50'
                          : 'text-gray-700 bg-gray-50'
                      }`}
                    >
                      {String(status || 'Unknown')}
                    </span>
                  );
                })()}
              </TableCell>

              {/* Actions Column */}
              <TableCell className="px-3 py-2.5">
                <div
                  className="actions-dropdown"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ActionsCell mandate={mandate} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Row Click Modal */}
      {isRowModalOpen && selectedMandateForModal && (
        <SideModal
          isOpen={isRowModalOpen}
          onClose={() => setIsRowModalOpen(false)}
        >
          <MonoEmandateDetails
            mandateData={selectedMandateForModal}
            paymentRecords={monoEmandatePaymentRecords.filter(
              (payment) =>
                payment.mandateID === selectedMandateForModal.mandateID
            )}
          />
        </SideModal>
      )}

      {/* Create Mandate Modal */}
      {isCreateMandateModalOpen && selectedMandateForCreation && (
        <CreateMandateModal
          isOpen={isCreateMandateModalOpen}
          onClose={() => {
            setIsCreateMandateModalOpen(false);
            setSelectedMandateForCreation(null);
          }}
          customerID={customerID}
          mandate={{
            id: Number(selectedMandateForCreation.id as string | number) || 0,
            accountNumber: String((selectedMandateForCreation.accountNumber as string) || ''),
            accountName: String((selectedMandateForCreation.accountName as string) || ''),
            bankName: String((selectedMandateForCreation.bankName as string) || ''),
            bankCode: String((selectedMandateForCreation.bankCode as string) || ''),
            status: String((selectedMandateForCreation.status as string) || ''),
          }}
          installmentAmount={Number(loanData?.monthlyRepayment || (selectedMandateForCreation.amount as number)) || 0}
          loanAmount={Number(loanData?.amount) || 0}
          interestRate={Number(loanData?.interest) || 0}
          tenure={Number(loanData?.loanTerm) || 0}
        />
      )}
    </div>
  );
}
