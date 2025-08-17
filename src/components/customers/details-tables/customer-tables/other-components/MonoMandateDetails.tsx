import { MonoMandate, MonoLinkedMandate } from '@/types';
import { formatDate } from '@/utils/functions';

const MonoMandateDetails = ({
  mandateData,
  linkedMandates,
}: {
  mandateData: MonoMandate;
  linkedMandates: MonoLinkedMandate[];
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
            <p className="text-xs text-gray-300 capitalize">Mandate ID</p>
            <p className="text-[13px] md:text-sm text-gray-700 capitalize">
              {mandateData?.mandateID || 'No data'}
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-gray-300">Mandate Amount</p>
            <p className="text-[13px] md:text-sm text-gray-700">
              ₦{' '}
              {mandateData?.mandateAmount?.toLocaleString('en-US') || 'No data'}
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-gray-300 capitalize">Bank</p>
            <p className="text-[13px] md:text-sm text-gray-700 capitalize">
              {mandateData?.bank || 'No data'}
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-gray-300 capitalize">Account Number</p>
            <p className="text-[13px] md:text-sm text-gray-700 capitalize">
              {mandateData?.debitAccount || 'No data'}
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-gray-300">Date Created</p>
            <p className="text-[13px] md:text-sm text-gray-700">
              {formatDate(mandateData?.dateCreated) || 'No data'}
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-gray-300">Start Date</p>
            <p className="text-[13px] md:text-sm text-gray-700">
              {formatDate(mandateData?.startDate) || 'No data'}
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-gray-300">End Date</p>
            <p className="text-[13px] md:text-sm text-gray-700">
              {formatDate(mandateData?.endDate) || 'No data'}
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
            Linked Mandates
          </div>
          {linkedMandates && linkedMandates.length > 0 ? (
            linkedMandates.map((mandate, index) => (
              <div
                key={index}
                className="grid grid-cols-2 md:grid-cols-4 gap-y-4 border-b border-b-[#eee] px-3.5 pb-4 md:px-4 md:pb-[18px]"
              >
                <div className="space-y-0.5">
                  <p className="text-xs text-gray-300">Mandate ID</p>
                  <p className="text-[13px] md:text-sm text-gray-700 capitalize">
                    {mandate?.mandateID || 'No data'}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-gray-300">Payment ID</p>
                  <p className="text-[13px] md:text-sm text-gray-700 capitalize">
                    {mandate?.paymentMandateID || 'No data'}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-gray-300">Amount</p>
                  <p className="text-[13px] md:text-sm text-gray-700">
                    ₦ {mandate?.amount?.toLocaleString('en-US') || 'No data'}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-gray-300">Bank</p>
                  <p className="text-[13px] md:text-sm text-gray-700 capitalize">
                    {mandate?.bank || 'No data'}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-gray-300">Account Number</p>
                  <p className="text-[13px] md:text-sm text-gray-700 capitalize">
                    {mandate?.debitAccount || 'No data'}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-gray-300">Date Created</p>
                  <p className="text-[13px] md:text-sm text-gray-700">
                    {formatDate(mandate?.dateCreated) || 'No data'}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-gray-300">Status</p>
                  <p className="text-[13px] md:text-sm text-gray-700 capitalize">
                    {mandate?.status || 'No data'}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-[#f9f9f9] p-4 md:p-5 flex justify-center items-center h-40">
              <p className="text-gray-500 text-sm">
                No linked mandates to show.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonoMandateDetails;
