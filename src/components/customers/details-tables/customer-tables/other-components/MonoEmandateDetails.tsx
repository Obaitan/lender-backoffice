import { MonoMandate, MonoPaymentHistory } from '@/types';
import { formatDate, maskInput } from '@/utils/functions';

const MonoEmandateDetails = ({
  mandateData,
  paymentRecords,
}: {
  mandateData: MonoMandate;
  paymentRecords: MonoPaymentHistory[];
}) => {
  return (
    <div className="grid grid-cols-1 gap-5">
      <div>
        <p className="font-medium text-gray-800 text-lg">E-mandate Details</p>
        <hr className="border-gray-50 mt-2" />
      </div>

      <div className="grid grid-cols-1 gap-y-7">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 px-3.5 pt-4 md:px-4 md:py-[18px]">
          <div className="space-y-0.5">
            <p className="text-xs text-gray-300 capitalize">E-mandate ID</p>
            <p className="text-[13px] md:text-sm text-gray-700 capitalize">
              {mandateData?.mandateID || 'No data'}
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-gray-300">E-mandate Amount</p>
            <p className="text-[13px] md:text-sm text-gray-700">
              ₦{' '}
              {mandateData?.mandateAmount?.toLocaleString('en-US') || 'No data'}
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-gray-300 capitalize">Bank Details</p>
            <p className="text-[13px] md:text-sm text-gray-700 capitalize">
              {mandateData?.bank} | {maskInput(mandateData?.debitAccount, 3) || 'No data'}
            </p>
          </div>

          <div className="space-y-0.5">
            <p className="text-xs text-gray-300">Date Created</p>
            <p className="text-[13px] md:text-sm text-gray-700">
              {formatDate(mandateData?.dateCreated, false) || 'No data'}
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-gray-300">Start Date</p>
            <p className="text-[13px] md:text-sm text-gray-700">
              {formatDate(mandateData?.startDate, false) || 'No data'}
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-gray-300">End Date</p>
            <p className="text-[13px] md:text-sm text-gray-700">
              {formatDate(mandateData?.endDate, false) || 'No data'}
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-gray-300 capitalize">Debit Type</p>
            <p className="text-[13px] md:text-sm text-gray-700 capitalize">
              {mandateData?.debitType || 'No data'}
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-gray-300 capitalize">Progress</p>
            <p className="text-[13px] md:text-sm text-gray-700 capitalize">
              {mandateData?.progress ? `${mandateData?.progress} %` : 'No data'}
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-gray-300 capitalize">Status</p>
            <p className="text-[13px] md:text-sm text-gray-700 capitalize">
              {mandateData?.status || 'No data'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-y-4">
          <div className="bg-secondary-50 py-3 px-3.5 md:px-4 text-sm text-gray-800 font-medium">
            Payment Records
          </div>
          {paymentRecords && paymentRecords.length > 0 ? (
            paymentRecords.map((payment, index) => (
              <div
                key={index}
                className="grid grid-cols-2 md:grid-cols-4 gap-y-4 border-b border-b-[#eee] px-3.5 pb-4 md:px-4 md:pb-[18px]"
              >
                <div className="space-y-0.5">
                  <p className="text-xs text-gray-300">Reference ID</p>
                  <p className="text-[13px] md:text-sm text-gray-700">
                    {payment?.referenceID || 'No data'}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-gray-300">Transaction Type</p>
                  <p className="text-[13px] md:text-sm text-gray-700">
                    {payment?.transactionType || 'No data'}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-gray-300">Amount</p>
                  <p className="text-[13px] md:text-sm text-gray-700">
                    ₦ {payment?.amount?.toLocaleString('en-US') || 'No data'}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-gray-300">Bank</p>
                  <p className="text-[13px] md:text-sm text-gray-700 capitalize">
                    {payment?.bank || 'No data'}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-gray-300">Account Number</p>
                  <p className="text-[13px] md:text-sm text-gray-700">
                    {payment?.debitAccount || 'No data'}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-gray-300">Date</p>
                  <p className="text-[13px] md:text-sm text-gray-700">
                    {formatDate(payment?.date) || 'No data'}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-gray-300">Status</p>
                  <p
                    className={`text-[13px] md:text-sm capitalize ${
                      payment?.status?.toLowerCase() === 'successful'
                        ? 'text-green-600'
                        : payment?.status?.toLowerCase() === 'failed'
                        ? 'text-red-600'
                        : payment?.status?.toLowerCase() === 'pending'
                        ? 'text-yellow-600'
                        : 'text-gray-700'
                    }`}
                  >
                    {payment?.status || 'No data'}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-[#f9f9f9] p-4 md:p-5 flex justify-center items-center h-40">
              <p className="text-gray-500 text-sm">
                No payment records to show.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonoEmandateDetails;
