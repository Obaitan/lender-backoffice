import { PaystackCardRepayment } from '@/types';
import { formatDate } from '@/utils/functions';

const PaystackCardRepaymentDetails = ({
  repayment,
}: {
  repayment: PaystackCardRepayment;
}) => {
  return (
    <div className="grid grid-cols-1 gap-5">
      <div>
        <p className="font-medium text-gray-800 text-lg">Repayment Details</p>
        <hr className="border-gray-50 mt-2" />
      </div>

      <div className="grid grid-cols-1 gap-y-7">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 px-3.5 pt-4 md:px-4 md:py-[18px]">
          <div className="space-y-0.5">
            <p className="text-xs text-gray-300 capitalize">Loan Number</p>
            <p className="text-[13px] md:text-sm text-gray-700 capitalize">
              {repayment?.loanNumber || 'No data'}
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-gray-300 capitalize">
              Transaction Reference
            </p>
            <p className="text-[13px] md:text-sm text-gray-700 capitalize">
              {repayment?.transactionRef || 'No data'}
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-gray-300">Amount</p>
            <p className="text-[13px] md:text-sm text-gray-700">
              ₦ {repayment?.amount?.toLocaleString('en-US') || 'No data'}
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-gray-300 capitalize">Payment Method</p>
            <p className="text-[13px] md:text-sm text-gray-700 capitalize">
              {repayment?.method || 'No data'}
            </p>
          </div>

          <div className="space-y-0.5">
            <p className="text-xs text-gray-300">Date</p>
            <p className="text-[13px] md:text-sm text-gray-700">
              {formatDate(repayment?.date) || 'No data'}
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-gray-300 capitalize">Status</p>
            <p className="text-[13px] md:text-sm text-gray-700 capitalize">
              {repayment?.status || 'No data'}
            </p>
          </div>
          <div className="col-span-full space-y-0.5">
            <p className="text-xs text-gray-300 capitalize">
              Payment Description
            </p>
            <p className="text-[13px] md:text-sm text-gray-700 capitalize">
              {repayment?.paymentDescription || 'No data'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaystackCardRepaymentDetails;
