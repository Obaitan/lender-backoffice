'use client';

import { useState } from 'react';
import { TabHeaderProps, TabComponentProps } from '@/types';
import Link from 'next/link';

const TabHeader = ({ label, url, isActive, onClick }: TabHeaderProps) => {
  return (
    <Link
      href={url ?? ''}
      className={`px-1.5 py-1 border-b-2 uppercase text-sm hover:border-secondary-100 ${
        isActive
          ? 'border-secondary-200 text-secondary-200 font-medium'
          : 'border-transparent text-gray-300 font-normal'
      }`}
      onClick={onClick}
    >
      {label}
    </Link>
  );
};

export const TabComponent = ({ pageTitle, tabs }: TabComponentProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      <div className="flex flex-col gap-4 overflow-x-hidden">
        {pageTitle && <p className="font-medium uppercase">{pageTitle}</p>}
        <div className="flex gap-3.5 border-b border-b-gray-50 overflow-x-auto whitespace-nowrap scrollbar-hide">
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
      <div className='mt-8'>{tabs[activeIndex]?.content}</div>
    </>
  );
};
