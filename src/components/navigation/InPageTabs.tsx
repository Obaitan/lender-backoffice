'use client';

import { useState } from 'react';
import { TabHeaderProps, TabComponentProps } from '@/types';
import Link from 'next/link';

const TabHeader = ({ label, url, isActive, onClick }: TabHeaderProps) => {
  return (
    <Link
      href={url ?? ''}
      className={`px-4 py-1.5 border-b-2 capitalize text-sm hover:bg-primary-50 ${
        isActive
          ? 'bg-primary-50 border-primary-200 text-primary-200 font-medium'
          : 'bg-transparent border-transparent text-gray-300 font-normal'
      }`}
      onClick={onClick}
    >
      {label}
    </Link>
  );
};

export const InPageTabsComponent = ({ tabs }: TabComponentProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      <div className="overflow-x-hidden xl:px-2">
        <div className="flex gap-1.5 border-b border-b-gray-50 overflow-x-auto whitespace-nowrap scrollbar-hide">
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

      <div className="xl:px-2 mt-5"> {tabs[activeIndex]?.content}</div>
    </>
  );
};
