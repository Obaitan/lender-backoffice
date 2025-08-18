'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from 'lucide-react';
import { RepaymentTabsProps } from '@/types';
import { Loader2 } from 'lucide-react';
import PeriodFilter from '../general/PeriodFilter';
import MultiTableExportButton from '@/components/table/MultiTableExportButton';

interface TabsWithMetricsProps extends RepaymentTabsProps {
  isLoading?: boolean;
  filter?: boolean;
  appliedRange?: { from?: Date; to?: Date };
  setAppliedRange?: (range: { from?: Date; to?: Date }) => void;
}

const TabsWithMetrics = ({
  pageTitle,
  links,
  isLoading = false,
  filter = true,
  appliedRange: controlledRange,
  setAppliedRange: setControlledRange,
}: TabsWithMetricsProps) => {
  const pathname = usePathname();
  const pagePath = pathname.split('/')[2];

  // If controlled props are provided, use them; otherwise, use internal state
  const [uncontrolledRange, setUncontrolledRange] = useState<{
    from?: Date;
    to?: Date;
  }>({});
  const appliedRange =
    controlledRange !== undefined ? controlledRange : uncontrolledRange;
  const setAppliedRange =
    setControlledRange !== undefined
      ? setControlledRange
      : setUncontrolledRange;

  return (
    <>
      <div className="flex flex-wrap gap-4 justify-between items-end mb-5">
        <p className="font-medium uppercase">{pageTitle}</p>
        <div className="flex gap-3 items-center">
          {filter === true && (
            <PeriodFilter
              appliedRange={appliedRange}
              setAppliedRange={setAppliedRange}
            />
          )}
          <MultiTableExportButton />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-2 md:gap-3 px-1.5">
        {isLoading
          ? // Show skeleton loading state
            Array(6)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="flex justify-center items-center p-2.5 md:p-3 border-x border-[#f3f3f3] bg-[#f9f9f9] min-h-[80px]"
                >
                  <Loader2 className="animate-spin w-6 h-6 text-secondary-200" />
                </div>
              ))
          : // Show actual data
            links.map((item) => (
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
                    className={`uppercase text-xs mb-1.5 text-center ${
                      pagePath === item?.url
                        ? 'text-secondary-200 font-semibold'
                        : 'text-gray-400 font-normal'
                    }`}
                  >
                    {item?.label}
                  </p>
                  <div className="flex justify-center items-center gap-2.5">
                    <p className="text-gray-800 font-semibold text-lg">
                      {item?.value.toLocaleString('en-US')}
                    </p>
                    <div
                      className={`flex gap-0.5 items-center text-[13px] ${
                        (item?.difference ?? 0) > 0
                          ? 'text-success-500'
                          : item?.difference === 0
                          ? 'text-gray-600'
                          : 'text-error-300'
                      } `}
                    >
                      {(item?.difference ?? 0) > 0 ? (
                        <ArrowUpIcon className="w-4 h-4" />
                      ) : item?.difference === 0 ? (
                        <ArrowUpDownIcon className="w-4 h-4" />
                      ) : (
                        <ArrowDownIcon className="w-4 h-4" />
                      )}
                      <span>{Math.abs(item?.difference ?? 0)}%</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
      </div>
    </>
  );
};

export default TabsWithMetrics;
