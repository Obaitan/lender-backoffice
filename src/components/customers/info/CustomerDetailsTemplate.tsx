'use client';

import { useState, ReactNode } from 'react';
import { TabHeaderProps } from '@/types';
import Link from 'next/link';
import InfoTile from '@/components/layout/InfoTile';

const TabHeader = ({ label, url, isActive, onClick }: TabHeaderProps) => {
  return (
    <Link
      href={url ?? ''}
      className={`px-1.5 py-0.5 border-b-2 uppercase text-[13px] hover:border-secondary-100 ${
        isActive
          ? 'border-secondary-200 text-secondary-200 font-medium'
          : 'border-transparent text-gray-400 font-normal'
      }`}
      onClick={onClick}
    >
      {label}
    </Link>
  );
};

export const CustomerDetailsTemplate = ({
  tabs,
}: {
  tabs: { label: string; content: ReactNode }[];
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      <div className="overflow-x-hidden mb-5">
        <div className="flex gap-3.5 border-b border-b-gray-100 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {tabs.map((tab, index) => (
            <TabHeader
              key={index}
              label={tab.label}
              isActive={index === activeIndex}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>
      <InfoTile>{tabs[activeIndex]?.content}</InfoTile>
    </>
  );
};
