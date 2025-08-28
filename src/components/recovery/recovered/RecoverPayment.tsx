import Image from 'next/image';
import StatusChip from '@/components/general/StatusChip';
import { formatDate } from '@/utils/functions';

const RecoverPayment = () => {
  return (
    <div className="grid grid-cols-1 gap-5">
      <div className="mb-2">
        <p className="font-medium text-gray-800">Recover Payment</p>
        <hr className="border-gray-50 mt-2" />
      </div>

      <div className="grid grid-cols-1 gap-y-7">
        <div className="flex flex-wrap gap-2 md:gap-3">
          <div className="relative h-12 w-12 overflow-hidden flex justify-center items-center rounded-full border border-disabled ${className">
            <Image
              src="/images/avatar.svg"
              alt="Profile picture"
              width={100}
              height={100}
              className="object-cover"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <p className="text-gray-700 capitalize text-[15px]">
                mark anthony
              </p>
              <StatusChip
                status={
                  // customer?.status?.toLowerCase() === 'active'
                  //   ? 'active'
                  //   : customer?.status?.toLowerCase() === 'suspended'
                  //   ? 'suspended'
                  //   : 'pending'
                  'active'
                }
              />
            </div>
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-gray-600 capitalize font-medium">
              <span className="text-primary-200 ">PLH00123/2024</span>|
              <span>+2347091234567</span> |
              <span className="lowercase">mark.anthony@gmail.com</span>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-secondary-50 py-3 px-3.5 md:px-4 text-sm text-gray-800">
            Outstanding Payment Details
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 border-b border-b-[#eee] px-3.5 py-4 md:px-4 md:py-[18px]">
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Loan ID</p>
              <p className="text-[13px] text-gray-700 uppercase">D0000234</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Amount Due</p>
              <p className="text-[13px] text-warning-300 capitalize">
                {(30000).toLocaleString('en-NG', {
                  style: 'currency',
                  currency: 'NGN',
                })}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Due Date</p>
              <p className="text-[13px] text-warning-300 capitalize">
                {formatDate('july 24, 2025')}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Installment Number</p>
              <p className="text-[13px] text-gray-700 capitalize">1</p>
            </div>

            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Installments Left</p>
              <p className="text-[13px] text-gray-700 capitalize">5</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Loan Balance</p>
              <p className="text-[13px] text-gray-700 capitalize">
                {(220000).toLocaleString('en-NG', {
                  style: 'currency',
                  currency: 'NGN',
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <div className="bg-secondary-50 py-3 px-3.5 md:px-4 text-sm text-gray-800">
            Recover Overdue Amount
          </div>
          <div className="py-3 px-3.5 md:px-4">
            <div className="bg-[#f9f9f9] text-[22px] text-gray-700 font-semibold px-4 py-2.5 ">
              {(30000).toLocaleString('en-NG', {
                style: 'currency',
                currency: 'NGN',
              })}
            </div>
            <div className="flex flex-wrap justify-between gap-4 py-2 mt-8">
              <div className="flex gap-3.5">
                <button className="bg-white border border-[#0052ba] text-[#0052ba] text-sm font-medium w-fit px-4 flex items-center rounded-md hover:bg-[#0052ba] hover:!text-white py-2">
                  Via Mono
                </button>
                <button className="bg-white border border-[#09a0d4] text-[#09a0d4] text-sm font-medium w-fit px-4 flex items-center rounded-md hover:bg-[#09a0d4] hover:!text-white py-2">
                  Via Paystack
                </button>
              </div>
              <button className="bg-secondary-200 text-white text-sm font-medium w-fit px-4 flex items-center rounded-md hover:bg-secondary-200/80 hover:!text-white py-2">
                Contact Customer
              </button>
            </div>
            {/* Implement toast message indicating success or failure of recovery operation. And move record from Overdue Payments to Recovered Payments */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecoverPayment;
