'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { TabPageProps } from '@/types';
import PeriodFilter from '../general/PeriodFilter';
import { useState } from 'react';
import MultiTableExportButton from '@/components/table/MultiTableExportButton';

export const PageTab = ({
  pageTitle,
  tabs,
  filter,
  appliedRange: controlledRange,
  setAppliedRange: setControlledRange,
}: TabPageProps) => {
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
        {pageTitle && <p className="font-medium uppercase">{pageTitle}</p>}
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

      {tabs && (
        <div className="flex gap-3.5 border-b border-b-gray-100 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {tabs?.map((tab, index) => (
            <Link
              key={index}
              href={tab.url ?? ''}
              className={`px-1.5 py-0.5 border-b-2 uppercase text-[13px] hover:border-secondary-100 ${
                pagePath === tab.url
                  ? 'border-secondary-200 text-secondary-200 font-medium'
                  : 'border-transparent text-gray-400 font-normal'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
};
