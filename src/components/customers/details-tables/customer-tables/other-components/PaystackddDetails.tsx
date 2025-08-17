import { MonoMandate } from '@/types';
import { formatDate } from '@/utils/functions';

const PaystackDdMandateDetails = ({
  mandateData,
}: {
  mandateData: MonoMandate;
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
      </div>
    </div>
  );
};

export default PaystackDdMandateDetails;
