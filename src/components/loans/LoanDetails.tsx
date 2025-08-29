import Image from 'next/image';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { formatDate } from '@/utils/functions';
import { FormattedLoanData } from '@/types';

// Define an interface for repayment data
interface RepaymentItem {
  id: number;
  repaymentNumber: string;
  amountPaid: number;
  dueDate: string;
  repaymentDate: string;
  repaymentChannel: string;
  status: string;
}

// Define an interface for the loan prop
interface LoanDetailsProps {
  loan: FormattedLoanData;
  repayments?: RepaymentItem[];
}

const LoanDetailsComponent: React.FC<LoanDetailsProps> = ({
  loan,
  repayments = [],
}) => {
  if (!loan) {
    return (
      <div className="p-4 bg-gray-50 text-gray-700 rounded-md">
        <p>No loan data available</p>
      </div>
    );
  }

  // Extract values from loan data with fallbacks
  const {
    loanAmount,
    disbursementDate,
    tenure,
    loanNumber,
    paid,
    outstanding,
    name: customerName,
    customerID,
    phoneNumber = 'N/A',
    email = 'N/A',
  } = loan;

  // Parse amounts (remove currency symbols and convert to numbers)
  const parseAmount = (amount: string) => {
    return Number(amount.replace(/[^\d.-]/g, '')) || 0;
  };

  const loanAmountNum = parseAmount(loanAmount);
  const paidAmountNum = parseAmount(paid);
  const outstandingAmountNum = parseAmount(outstanding);
  
  // Calculate derived values
  const interestAmount = loanAmountNum * 0.15; // Assuming 15% interest rate
  const totalAmount = loanAmountNum + interestAmount;
  const monthlyPayment = totalAmount / tenure || 0;
  const installmentsPaid = Math.round(paidAmountNum / monthlyPayment) || 0;
  const interestRate = (interestAmount / loanAmountNum) * 100;

  // Calculate maturity date
  const disbursementDateObj = new Date(disbursementDate);
  const maturityDate = new Date(disbursementDateObj);
  maturityDate.setDate(maturityDate.getDate() + Number(tenure));

  return (
    <div className="grid grid-cols-1 gap-5">
      <div className="mb-2">
        <p className="font-medium text-gray-800">Loan Details</p>
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
            <p className="text-gray-700 capitalize text-[15px]">
              {customerName}
            </p>
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-gray-600 capitalize font-medium">
              <span className="text-primary-200">{customerID}</span> |
              <span>{phoneNumber}</span> |
              <span className="lowercase">{email}</span>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-secondary-50 py-3 px-3.5 md:px-4 text-sm text-gray-800">
            Loan Information
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 border-b border-b-[#eee] px-3.5 py-4 md:px-4 md:py-[18px]">
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Loan Number</p>
              <p className="text-[13px] text-gray-700 uppercase">
                {loanNumber}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Loan Amount</p>
              <p className="text-[13px] text-gray-700 capitalize">
                {loanAmountNum.toLocaleString('en-NG', {
                  style: 'currency',
                  currency: 'NGN',
                })}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Date Disbursed</p>
              <p className="text-[13px] text-gray-700 capitalize">
                {formatDate(disbursementDate, false)}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Maturity Date</p>
              <p className="text-[13px] text-gray-700 capitalize">
                {formatDate(maturityDate, false)}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Interest Rate</p>
              <p className="text-[13px] text-gray-700 capitalize">
                {interestRate.toFixed(1)}%
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Interest Amount</p>
              <p className="text-[13px] text-gray-700 capitalize">
                {interestAmount.toLocaleString('en-NG', {
                  style: 'currency',
                  currency: 'NGN',
                })}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Tenure</p>
              <p className="text-[13px] text-gray-700 capitalize">
                {tenure} {Number(tenure) === 1 ? 'day' : 'days'}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Installments Paid</p>
              <p className="text-[13px] text-gray-700 capitalize">
                {installmentsPaid}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Monthly Payments</p>
              <p className="text-[13px] text-gray-700 capitalize">
                {monthlyPayment.toLocaleString('en-NG', {
                  style: 'currency',
                  currency: 'NGN',
                })}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Total Paid</p>
              <p className="text-[13px] text-gray-700 capitalize">
                {paidAmountNum.toLocaleString('en-NG', {
                  style: 'currency',
                  currency: 'NGN',
                })}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Outstanding</p>
              <p className="text-[13px] text-gray-700 capitalize">
                {outstandingAmountNum.toLocaleString('en-NG', {
                  style: 'currency',
                  currency: 'NGN',
                })}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Total Expected Repayment</p>
              <p className="text-[13px] text-gray-700 capitalize">
                {totalAmount.toLocaleString('en-NG', {
                  style: 'currency',
                  currency: 'NGN',
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <div className="bg-secondary-50 py-3 px-3.5 md:px-4 text-sm text-gray-800">
            Repayments
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              <div className="grid grid-cols-5 border-b border-b-[#eee] py-3 px-3.5 md:px-4 text-xs text-gray-300">
                <p>Payment Ref.</p>
                <p>Amount</p>
                <p>Due Date</p>
                <p>Date Paid</p>
                <p>Channel</p>
              </div>
              {repayments.length > 0 ? (
                repayments.map((repayment, index) => (
                  <div
                    key={repayment.id || index}
                    className="grid grid-cols-5 border-b border-b-[#eee] py-3 px-3.5 md:px-4 text-xs text-gray-700 capitalize"
                  >
                    <p>{repayment.repaymentNumber || 'N/A'}</p>
                    <p>
                      {Number(repayment.amountPaid || 0).toLocaleString(
                        'en-NG',
                        {
                          style: 'currency',
                          currency: 'NGN',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }
                      )}
                    </p>
                    <p>
                      {repayment.dueDate
                        ? formatDate(repayment.dueDate, false)
                        : 'N/A'}
                    </p>
                    <p
                      className={`${
                        repayment?.repaymentDate > repayment?.dueDate
                          ? 'text-warning-400'
                          : 'text-gray-700'
                      }`}
                    >
                      {formatDate(repayment.repaymentDate, false)}
                    </p>

                    <div className="flex gap-2 justify-between items-center">
                      <span>{repayment.repaymentChannel || 'N/A'}</span>
                      {repayment?.status.toLowerCase() === 'paid' ? (
                        <CheckCircleIcon className="w-4 h-4 text-success-500" />
                      ) : (
                        <XCircleIcon className="w-4 h-4 text-error-300" />
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
      </div>
    </div>
  );
};

export default LoanDetailsComponent;
