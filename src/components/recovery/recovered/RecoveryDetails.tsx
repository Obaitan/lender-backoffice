import Image from 'next/image';
import StatusChip from '@/components/general/StatusChip';
import { formatDateString } from '@/utils/dateUtils';

import { RecoveredPayment } from './RecoveredDebtsColumns';

interface RecoveryDetailsProps {
  recoveryData?: RecoveredPayment;
}

const RecoveryDetailsComponent: React.FC<RecoveryDetailsProps> = ({ recoveryData }) => {
  // If no data is provided, show a placeholder message
  if (!recoveryData) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>No recovery details available.</p>
      </div>
    );
  }

  // Format currency amounts
  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Default values for missing fields
  const customerName = recoveryData.customerName || 'Customer Name';
  const phoneNumber = recoveryData.phoneNumber || 'N/A';
  const email = recoveryData.email || 'N/A';
  const recoveryReference = recoveryData.repaymentNumber || '';
  const repaymentInstallment = recoveryData.repaymentInstallment || 1;
  const installmentsLeft = recoveryData.installmentsLeft || 5;
  const loanBalance = recoveryData.loanBalance || 0;
  const recoveryChannel = recoveryData.recoveryChannel || 'Manual Recovery';
  const loanNumber = recoveryData.loanNumber || recoveryData.loanID;

  // Determine recovery status
  const isFullyRecovered = recoveryData.amountOwed <= recoveryData.amountRecovered;

  return (
    <div className="grid grid-cols-1 gap-5">
      <div className="mb-2">
        <p className="font-medium text-gray-800">Recovery Details</p>
        <hr className="border-gray-50 mt-2" />
      </div>

      <div className="grid grid-cols-1 gap-y-7">
        <div className="flex flex-wrap gap-2 md:gap-3">
          <div className="relative h-12 w-12 overflow-hidden flex justify-center items-center rounded-full border border-disabled">
            <Image
              src="/images/avatar.svg"
              alt="Profile picture"
              width={100}
              height={100}
              className="object-cover"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <p className="text-gray-700 capitalize text-[15px]">
                {customerName}
              </p>
              <StatusChip
                status={isFullyRecovered ? 'active' : 'pending'}
              />
            </div>
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-gray-600 capitalize font-medium">
              <span className="text-primary-200 ">{recoveryData.customerID}</span>|
              <span>{phoneNumber}</span> |
              <span className="lowercase">{email}</span>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-secondary-50 py-3 px-3.5 md:px-4 text-sm text-gray-800">
            Recovery Information
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 border-b border-b-[#eee] px-3.5 py-4 md:px-4 md:py-[18px]">
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Loan ID</p>
              <p className="text-[13px] text-gray-700 uppercase">{loanNumber}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Recovery ID</p>
              <p className="text-[13px] text-gray-700 uppercase">{recoveryReference}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Amount Due</p>
              <p className="text-[13px] text-gray-700 capitalize">{formatCurrency(recoveryData.amountOwed)}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Due Date</p>
              <p className="text-[13px] text-gray-700 capitalize">{formatDateString(recoveryData.dueDate)}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Recovered Amount</p>
              <p className="text-[13px] text-gray-700 capitalize">{formatCurrency(recoveryData.amountRecovered)}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Date Recovered</p>
              <p className="text-[13px] text-gray-700 capitalize">{formatDateString(recoveryData.dateRecovered)}</p>
            </div>
            
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Outstanding</p>
              <p className="text-[13px] text-gray-700 capitalize">
                {formatCurrency(Math.max(0, recoveryData.amountOwed - recoveryData.amountRecovered))}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Repayment Installment</p>
              <p className="text-[13px] text-gray-700 capitalize">{repaymentInstallment}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Installments Left</p>
              <p className="text-[13px] text-gray-700 capitalize">{installmentsLeft}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Loan Balance</p>
              <p className="text-[13px] text-gray-700 capitalize">{formatCurrency(loanBalance)}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Recovery Channel</p>
              <p className="text-[13px] text-gray-700 capitalize">{recoveryChannel}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Recovery Status</p>
              <p className={`text-[13px] capitalize font-medium ${isFullyRecovered ? 'text-green-500' : 'text-yellow-500'}`}>
                {isFullyRecovered ? 'Fully Recovered' : 'Partially Recovered'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
      
      </div>
    </div>
  );
};

export default RecoveryDetailsComponent;