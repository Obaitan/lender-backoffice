'use client';

import Tooltip from '@/components/general/Tooltip';
import { Button } from '@/components/general/Button';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import { FileJson2 } from 'lucide-react';
import { WacsMandate, WacsRepayment, WacsData } from '@/types';
import WacsMandateTable from '../details-tables/WacsMandatesTable';
import { maskInput } from '@/utils/functions';
import { InPageTabsComponent } from '@/components/navigation/InPageTabs';

// Replace Wacs record type definition (any) when aavailable
const Wacs = ({
  wacsData,
  mandates,
}: {
  wacsData: WacsData;
  mandates: WacsMandate[] | null;
  repayments: WacsRepayment[] | null;
}) => {
  const wacsTabs = [
    {
      label: 'Mandates',
      content: <WacsMandateTable record={mandates || []} />,
    },
  ];

  return (
    <>
      <div className="xl:px-2 mb-10">
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
              <p className="text-[13px] text-gray-400">IPPIS No.</p>
              <p className="text-sm capitalize text-gray-700">
                {maskInput(wacsData?.ippis, 0) || 'No data'}
              </p>
            </div>
            <div className="space-y-1 col-span-full md:col-span-1">
              <p className="text-[13px] text-gray-400">Employer</p>
              <p className="text-sm text-gray-700 capitalize">
                {wacsData?.employer || 'No data'}
              </p>
            </div>
          </div>
        </div>
      </div>
      <InPageTabsComponent tabs={wacsTabs} />
    </>
  );
};

export default Wacs;
