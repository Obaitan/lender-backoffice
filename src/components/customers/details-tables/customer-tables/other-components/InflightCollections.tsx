import { InflightMandate, InflightCollections } from '@/types';
import { formatDate, formatNumber, maskInput } from '@/utils/functions';

const InflightCollectionsDetails = ({
  mandateData,
  collections,
}: {
  mandateData: InflightMandate;
  collections: InflightCollections[];
}) => {
  return (
    <div className="grid grid-cols-1 gap-5">
      <div className="mb-2">
        <p className="font-medium text-gray-800 text-lg">Mandate Details</p>
        <hr className="border-gray-50 mt-2" />
      </div>

      <div className="grid grid-cols-1 gap-y-7">
        <div>
          <div className="bg-secondary-50 py-3 px-3.5 md:px-4 text-sm font-medium text-gray-800">
            Mandate Information
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 px-3.5 pt-4 md:px-4 md:py-[18px]">
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Mandate Ref.</p>
              <p className="text-[13px] md:text-sm text-gray-700">
                {mandateData?.mandateRef || 'No data'}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Loan Number</p>
              <p className="text-[13px] md:text-sm text-gray-700">
                {mandateData?.loanNumber || 'No data'}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Loan Amount</p>
              <p className="text-[13px] md:text-sm text-gray-700">
                ₦ {formatNumber(mandateData?.loanAmount) || 'No data'}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Repayment Amount</p>
              <p className="text-[13px] md:text-sm text-gray-700">
                ₦ {formatNumber(mandateData?.repaymentAmount) || 'No data'}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Account Information</p>
              <p className="text-[13px] md:text-sm text-gray-700">
                {mandateData?.bankName || 'No data'} |{' '}
                {maskInput(mandateData?.accountNumber, 3) || 'No data'}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Phone Number</p>
              <p className="text-[13px] md:text-sm text-gray-700">
                {mandateData?.phoneNumber || 'No data'}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Date Created</p>
              <p className="text-[13px] text-gray-700">
                {formatDate(mandateData?.createDate) || 'No data'}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Status</p>
              <p className="text-[13px] md:text-sm text-gray-700">
                {mandateData?.status || 'No data'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-y-4">
          <div className="bg-secondary-50 py-3 px-3.5 md:px-4 text-sm text-gray-800 font-medium">
            Collections
          </div>
          {collections && collections.length > 0 ? (
            collections.map((collection, index) => (
              <div
                key={index}
                className="grid grid-cols-2 md:grid-cols-4 gap-y-4 border-b border-b-[#eee] px-3.5 pb-4 md:px-4 md:pb-[18px]"
              >
                <div className="space-y-0.5">
                  <p className="text-xs text-gray-300">Mandate Ref.</p>
                  <p className="text-[13px] md:text-sm text-gray-700">
                    {collection?.mandateRef || 'No data'}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-gray-300">Payment Ref.</p>
                  <p className="text-[13px] md:text-sm text-gray-700">
                    {collection?.paymentRef || 'No data'}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-gray-300">Amount</p>
                  <p className="text-[13px] md:text-sm text-gray-700">
                    ₦ {formatNumber(collection?.amount) || 'No data'}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-gray-300">Date of Notification</p>
                  <p className="text-[13px] text-gray-700">
                    {formatDate(collection?.dateNotificationSent) || 'No data'}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-gray-300">
                    Date of First Notification
                  </p>
                  <p className="text-[13px] text-gray-700">
                    {formatDate(collection?.dateNotificationFirstSent) ||
                      'No data'}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-gray-300">Net Salary</p>
                  <p className="text-[13px] md:text-sm text-gray-700">
                    ₦ {formatNumber(collection?.netSalary) || 'No data'}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-gray-300">Total Credit</p>
                  <p className="text-[13px] md:text-sm text-gray-700">
                    ₦ {formatNumber(collection?.totalCredit) || 'No data'}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-gray-300">Balance Due</p>
                  <p className="text-[13px] md:text-sm text-gray-700">
                    ₦ {formatNumber(collection?.balanceDue) || 'No data'}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-gray-300">Zoho Payment ID</p>
                  <p className="text-[13px] md:text-sm text-gray-700">
                  {collection?.zohoPaymentID || 'No data'}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-[#f9f9f9] p-4 md:p-5 flex justify-center items-center h-40">
              <p className="text-gray-500 text-sm">No collections to show.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InflightCollectionsDetails;
