import Image from 'next/image';
import { Repayment } from '@/types';
import { getImageUrl, formatNumber, formatDate } from '@/utils/functions';

interface ExpectedRepaymentDetailsProps {
  repayment: Repayment;
}

const ExpectedRepaymentDetailsComponent = ({
  repayment,
}: ExpectedRepaymentDetailsProps) => {
  // Format financial values

  return (
    <div className="grid grid-cols-1 gap-5">
      <div className="mb-2">
        <p className="font-medium text-gray-800">Expected Repayment Details</p>
        <hr className="border-gray-50 mt-2" />
      </div>

      <div className="grid grid-cols-1 gap-y-7">
        <div className="flex flex-wrap gap-2 md:gap-3">
          <div className="relative h-12 w-12 overflow-hidden flex justify-center items-center rounded-full border border-disabled">
            <Image
              src={getImageUrl(repayment?.customer?.profilePicture?.filePath)}
              alt="Profile picture"
              width={100}
              height={100}
              className="object-cover"
            />
          </div>
          <div className="space-y-2">
            <p className="text-gray-700 capitalize text-[15px]">
              {repayment?.customer?.firstName || 'No data'}{' '}
              {repayment?.customer?.lastName || ''}
            </p>

            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-gray-600 capitalize font-medium">
              <span className="text-primary-200">
                {repayment?.customer.customerID || 'No data'}
              </span>{' '}
              |<span>{repayment?.customer.phoneNumber || 'No data'}</span> |
              <span className="lowercase">
                {repayment?.customer.email || 'no data'}
              </span>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-secondary-50 py-3 px-3.5 md:px-4 text-sm text-gray-800">
            Repayment Information
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 border-b border-b-[#eee] px-3.5 py-4 md:px-4 md:py-[18px]">
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Expected Amount</p>
              <p className="text-[13px] text-gray-700 font-medium">
                ₦ {formatNumber(repayment?.amount || 0)}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Installment Number</p>
              <p className="text-[13px] text-gray-700 capitalize">
                {/* {repayment?.installmentNo || 0)} */} 0
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Due Date</p>
              <p className="text-[13px] text-gray-700 capitalize">
                {formatDate(repayment?.dueDate, false) || 'N/A'}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Loan ID</p>
              <p className="text-[13px] text-gray-700 uppercase">
                {repayment?.loan?.loanId || 'N/A'}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Loan Balance</p>
              <p className="text-[13px] text-gray-700 capitalize">
                ₦ {formatNumber(repayment?.loan?.loanBalance || 0)}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Status</p>
              <p
                className={`text-[13px] capitalize font-medium ${
                  repayment?.status.toLowerCase() === 'paid'
                    ? 'text-green-800'
                    : repayment?.status.toLowerCase() === 'active'
                    ? 'text-blue-800'
                    : 'text-error-300'
                }`}
              >
                {repayment.status}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
    </div>
  );
};

export default ExpectedRepaymentDetailsComponent;
