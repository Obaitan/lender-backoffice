import { WacsMandate, WacsRepayment } from '@/types';
import { formatDate, formatNumber } from '@/utils/functions';

const WacsMandateDetails = ({
  mandateData,
  repayments,
}: {
  mandateData: WacsMandate;
  repayments: WacsRepayment[];
}) => {
  return (
    <div className="grid grid-cols-1 gap-5">
      <div>
        <p className="font-medium text-gray-800 text-lg">Mandate Details</p>
        <hr className="border-gray-50 mt-2" />
      </div>

      <div className="grid grid-cols-1 gap-y-7">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 px-3.5 pt-4 md:px-4 md:py-[18px]">
          <div className="space-y-0.5">
            <p className="text-xs text-gray-300">Reference Number.</p>
            <p className="text-[13px] md:text-sm text-gray-700">
              {mandateData?.refNumber || 'No data'}
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-gray-300">Total Repayment</p>
            <p className="text-[13px] md:text-sm text-gray-700">
              ₦ {formatNumber(mandateData?.totalRepayment) || 'No data'}
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-gray-300">Amount</p>
            <p className="text-[13px] md:text-sm text-gray-700">
              ₦ {formatNumber(mandateData?.amount) || 'No data'}
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-gray-300">Status</p>
            <p className="text-[13px] md:text-sm text-gray-700">
              {mandateData?.status || 'No data'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-y-4">
          <div className="bg-secondary-50 py-3 px-3.5 md:px-4 text-sm text-gray-800 font-medium">
            Repayments
          </div>
          {repayments && repayments.length > 0 ? (
            repayments.map((repayment, index) => (
              <div
                key={index}
                className="grid grid-cols-2 md:grid-cols-4 gap-y-4 border-b border-b-[#eee] px-3.5 pb-4 md:px-4 md:pb-[18px]"
              >
                <div className="space-y-0.5">
                  <p className="text-xs text-gray-300">Payment Reference.</p>
                  <p className="text-[13px] md:text-sm text-gray-700">
                    {repayment?.paymentRef || 'No data'}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-gray-300">WACS Loan ID</p>
                  <p className="text-[13px] md:text-sm text-gray-700">
                    {repayment?.wacsLoanId || 'No data'}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-gray-300">Loan Number</p>
                  <p className="text-[13px] md:text-sm text-gray-700">
                    {repayment?.loanNumber || 'No data'}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-gray-300">Amount</p>
                  <p className="text-[13px] md:text-sm text-gray-700">
                    ₦ {formatNumber(repayment?.amount) || 'No data'}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-gray-300">Date Paid</p>
                  <p className="text-[13px] text-gray-700">
                    {formatDate(repayment?.datePaid) || 'No data'}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-gray-300">Status</p>
                  <p className="text-[13px] md:text-sm text-gray-700">
                    {repayment?.status || 'No data'}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-[#f9f9f9] p-4 md:p-5 flex justify-center items-center h-40">
              <p className="text-gray-500 text-sm">No repayments to show.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WacsMandateDetails;
