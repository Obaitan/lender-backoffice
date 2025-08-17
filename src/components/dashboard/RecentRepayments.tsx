import { timeAgo } from '@/utils/functions';
import { RecentCustomers } from '@/types';

const RecentRepayments = ({
  firstName,
  lastName,
  customerID,
  repayment,
  repaymentChannel,
  signUpTime,
}: RecentCustomers) => {
  return (
    <div className="flex justify-between gap-4 border-b border-b-gray-100 pb-5">
      <div className="space-y-0.5">
        <p className="font-medium text-[13px] text-gray-600">
          {firstName} {lastName}
        </p>
        <p className="text-xs text-gray-400">{customerID}</p>
      </div>
      <div className="space-y-0.5 text-end">
        <p className="font-medium text-xs text-gray-400 capitalize">
          NGN {repayment?.toLocaleString('en-US')} / {repaymentChannel}
        </p>
        <p className="text-xs text-gray-400">{timeAgo(signUpTime)}</p>
      </div>
    </div>
  );
};

export default RecentRepayments;
