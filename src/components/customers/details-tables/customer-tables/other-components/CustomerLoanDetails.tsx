import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { formatDate } from '@/utils/functions';
import { Loan, LoanRepaymment } from '@/types';

const CustomerLoanDetailsComponent = ({
  data,
  repayments,
}: {
  data: Loan | null;
  repayments: LoanRepaymment[] | null;
}) => {
  const totalPaid = repayments
    ? repayments.reduce((sum, repayment) => sum + repayment.amountPaid, 0)
    : 0;

  return (
    <div className="grid grid-cols-1 gap-5">
      <div className="mb-2">
        <p className="font-medium text-gray-800">Loan Details</p>
        <hr className="border-gray-50 mt-2" />
      </div>

      <div className="grid grid-cols-1 gap-y-7">
        <div>
          <div className="bg-secondary-50 py-3 px-3.5 md:px-4 text-sm text-gray-800">
            Loan Information
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 border-b border-b-[#eee] px-3.5 py-4 md:px-4 md:py-[18px]">
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Loan ID</p>
              <p className="text-[13px] text-gray-700 capitalize">
                {data?.loanNumber ?? 'No data'}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Loan Amount</p>
              <p className="text-[13px] text-gray-700 capitalize">
                {data?.amount.toLocaleString('en-NG', {
                  style: 'currency',
                  currency: 'NGN',
                }) ?? 'No data'}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Date Disbursed</p>
              <p className="text-[13px] text-gray-700 capitalize">
                {formatDate(data?.createDate ?? '') ?? 'No data'}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Maturity Date</p>
              <p className="text-[13px] text-gray-700 capitalize">No data</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Interest Rate</p>
              <p className="text-[13px] text-gray-700 capitalize">
                {data?.interestRate ?? 'No data'} %
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Interest Amount</p>
              <p className="text-[13px] text-gray-700 capitalize">
                {data?.interest.toLocaleString('en-NG', {
                  style: 'currency',
                  currency: 'NGN',
                }) ?? 'No data'}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Tenure</p>
              <p className="text-[13px] text-gray-700 capitalize">
                {data?.duration ?? 'No data'}{' '}
                {(data?.duration ?? 0) > 1 ? 'days' : 'day'}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Installments Paid</p>
              <p className="text-[13px] text-gray-700 capitalize">
                {repayments?.length}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Monthly Installment</p>
              <p className="text-[13px] text-gray-700 capitalize">
                {data?.installmentAmount.toLocaleString('en-NG', {
                  style: 'currency',
                  currency: 'NGN',
                }) ?? 'No data'}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Total Paid</p>
              <p className="text-[13px] text-gray-700 capitalize">
                {totalPaid.toLocaleString('en-NG', {
                  style: 'currency',
                  currency: 'NGN',
                })}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Outstanding</p>
              <p className="text-[13px] text-gray-700 capitalize">
                {((data?.totalRepaymentAmount ?? 0) - totalPaid).toLocaleString(
                  'en-NG',
                  { style: 'currency', currency: 'NGN' }
                )}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Total Expected Repayment</p>
              <p className="text-[13px] text-gray-700 capitalize">
                {data?.totalRepaymentAmount.toLocaleString('en-NG', {
                  style: 'currency',
                  currency: 'NGN',
                }) ?? 'No data'}
              </p>
            </div>
          </div>
        </div>
        <div className="hidden md:block mt-3">
          <div className="bg-secondary-50 py-3 px-3.5 md:px-4 text-sm text-gray-800">
            Repayments
          </div>
          <div className="grid grid-cols-5 border-b border-b-[#eee] py-3 px-3.5 md:px-4 text-xs text-gray-300">
            <p>Payment No.</p>
            <p>Amount</p>
            <p>Due Date</p>
            <p>Date Paid</p>
            <p>Channel</p>
          </div>

          {repayments && repayments.length > 0 ? (
            repayments.map((repayment: LoanRepaymment) => (
              <div
                key={repayment?.id}
                className="grid grid-cols-5 border-b border-b-[#eee] py-3 px-3.5 md:px-4 text-xs text-gray-700 capitalize"
              >
                <p>{repayment?.repaymentNumber}</p>
                <p>
                  {repayment?.amountPaid.toLocaleString('en-NG', {
                    style: 'currency',
                    currency: 'NGN',
                  })}
                </p>
                <p>{formatDate(repayment?.dueDate, false)}</p>
                <p>{formatDate(repayment?.repaymentDate, false)}</p>
                <div className="flex gap-2 justify-between">
                  <p>{repayment?.repaymentChannel}</p>
                  {repayment?.status.toLocaleLowerCase() === 'paid' ? (
                    <CheckCircleIcon className="w-4 h-4 text-success-500" />
                  ) : (
                    <XCircleIcon className="w-4 h-4 text-gray-200" />
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center h-20 text-gray-400 text-sm border-b border-b-[#eee]">
              No repayments yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerLoanDetailsComponent;
