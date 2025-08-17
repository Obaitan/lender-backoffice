import { dummyCard, paystackCardRepaymentRecords } from '@/utils/dummyData';
import { PaystackCardData } from '@/types';
import { maskInput } from '@/utils/functions';
import { InPageTabsComponent } from '@/components/navigation/InPageTabs';
import PaystackCardRepaymentTable from '../details-tables/PaystackCardRepaymentTable';

const PaystackCard = () => {
  const card: PaystackCardData = dummyCard;
  const inFlightTabs = [
    {
      label: 'Repayments',
      content: (
        <PaystackCardRepaymentTable record={paystackCardRepaymentRecords} />
      ),
    },
  ];

  return (
    <div className="xl:px-2">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-5 pb-10 xl:px-2">
        <div className="space-y-1">
          <p className="text-[13px] text-gray-300">Name on Card</p>
          <p className="text-sm text-gray-700">
            {card.nameOnCard || 'No data'}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-[13px] text-gray-300">Card Number</p>
          <p className="text-sm text-gray-700 capitalize">
            {maskInput(card.cardNumber) || 'No data'}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-[13px] text-gray-300">Card Type</p>
          <p className="text-sm text-gray-700 capitalize">
            {card?.cardIssuer && card?.cardType
              ? `${card.cardIssuer} | ${card.cardType}`
              : 'No data'}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-[13px] text-gray-300">Card Expiration Date</p>
          <p className="text-sm text-gray-700 capitalize">
            {card.expiryDate || 'No data'}
          </p>
        </div>
      </div>
      <InPageTabsComponent tabs={inFlightTabs} />
    </div>
  );
};

export default PaystackCard;
