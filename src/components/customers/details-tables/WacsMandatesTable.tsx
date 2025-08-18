'use client';

import Tooltip from '@/components/general/Tooltip';
import { Button } from '@/components/general/Button';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import { FileJson2 } from 'lucide-react';
import { formatNumber } from '@/utils/functions';

// Replace Wacs record type definition (any) when aavailable
const Wacs = () => {
  return (
    <>
      <div className="xl:px-2">
        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-2 md:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-8">
            <div className="col-span-full flex md:hidden flex-wrap justify-end items-center gap-2.5">
              <Tooltip content="Reload API Data">
                <Button className="bg-gray-50 !text-sm !text-secondary-200 !rounded-full !p-2.5 !w-fit hover:bg-secondary-200 hover:!text-white">
                  <ArrowPathIcon className="w-[18px] h-[18px]" />
                </Button>
              </Tooltip>
              <Tooltip
                className="left-1/4 -translate-x-1/4 md:left-1/2 md:-translate-x-1/2"
                content="Copy API Response"
              >
                <Button className="bg-gray-50 !text-sm !text-secondary-200 !rounded-full !p-2.5 !w-fit hover:bg-secondary-200 hover:!text-white">
                  <FileJson2 className="w-[18px] h-[18px]" />
                </Button>
              </Tooltip>
            </div>
            <div className="space-y-1">
              <p className="text-[13px] text-gray-400">Reference No.</p>
              <p className="text-sm capitalize text-gray-700">WACS-102344567</p>
            </div>
            <div className="space-y-1">
              <p className="text-[13px] text-gray-400">IPPIS No.</p>
              <p className="text-sm capitalize text-gray-700">162762</p>
            </div>
            <div className="space-y-1">
              <p className="text-[13px] text-gray-400">
                Total Repayment Amount
              </p>
              <p className="text-sm capitalize text-gray-700 ">
                ₦ {formatNumber(8750125, 'en-US', true)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[13px] text-gray-400">Bank Name</p>
              <p className="text-sm text-gray-700 capitalize">
                Stanbic IBTC Bank
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[13px] text-gray-400">Account Number</p>
              <p className="text-sm text-gray-700 capitalize">0123456789</p>
            </div>
            <div className="space-y-1 col-span-full md:col-span-1">
              <p className="text-[13px] text-gray-400">Employer</p>
              <p className="text-sm text-gray-700 capitalize">
                Fedral Inland Revenue service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Wacs;
