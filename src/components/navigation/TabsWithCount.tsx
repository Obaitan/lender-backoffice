'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { CalendarRangeIcon } from 'lucide-react';
import { RepaymentTabsProps } from '@/types';
import Dropdown from '../general/Dropdown';

const TabsWithCount = ({ pageTitle, links }: RepaymentTabsProps) => {
  const pathname = usePathname();
  const pagePath = pathname.split('/')[2];
  return (
    <>
      <div className="flex gap-4 justify-between items-end mb-4">
        <p className="font-medium uppercase">{pageTitle}</p>
        <Dropdown
          buttonLabel="Period"
          icon={<CalendarRangeIcon className="w-3.5 h-3.5" />}
          items={[
            { label: 'Last Week' },
            { label: 'Last 2 Weeks' },
            { label: 'Last Month' },
          ]}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-2.5 md:gap-3 px-1.5">
        {links?.map((item) => (
          <Link
            key={item?.label}
            href={item?.url ?? ''}
            className={`flex justify-center p-2.5 md:p-3 transition-all duration-300 ease-in-out ${
              pagePath === item?.url
                ? 'border-l-4 border-l-secondary-200 bg-secondary-50 shadow transform scale-105'
                : 'border-x border-[#f3f3f3] bg-[#f9f9f9]'
            }`}
          >
            <div>
              <p
                className={`uppercase text-xs mb-2.5 ${
                  pagePath === item?.url
                    ? 'text-secondary-200 font-semibold'
                    : 'text-gray-200 font-normal'
                }`}
              >
                {item?.label}
              </p>
              <div className="flex items-center gap-2.5">
                <p className="text-gray-800 font-semibold text-lg">
                  {item?.value.toLocaleString('en-US')}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default TabsWithCount;
