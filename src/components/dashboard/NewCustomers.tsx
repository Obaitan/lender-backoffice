import Image from 'next/image';
import { RecentCustomers } from '@/types';
import { timeAgo } from '@/utils/functions';

const NewCustomers = ({
  profilePix,
  firstName,
  lastName,
  customerID,
  signUpTime,
}: RecentCustomers) => {
  return (
    <div className="flex justify-between gap-4 border-b border-b-gray-100 pb-5">
      <div className="flex gap-3">
        <div className="relative h-9 w-9 overflow-hidden flex justify-center items-center rounded-full">
          <Image
            src={profilePix ? profilePix : '/images/avatar.svg'}
            alt="Customer selfie"
            width={100}
            height={100}
            className="object-cover"
            priority={true}
          />
        </div>
        <div className="space-y-0.5">
          <p className="font-medium text-[13px] text-gray-600">
            {firstName} {lastName}
          </p>
          <p className="text-xs text-gray-400">{customerID}</p>
        </div>
      </div>
      <div className="flex justify-end items-end">
        <p className="text-xs text-gray-400">{timeAgo(signUpTime)}</p>
      </div>
    </div>
  );
};

export default NewCustomers;
