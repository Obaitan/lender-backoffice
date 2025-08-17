'use client';

import { ReactNode, useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';

interface FormCollapsibleProps {
  buttonLabel: string;
  children: ReactNode;
  initialExpanded?: boolean;
  className?: string;
}

const FormCollapsible = ({ 
  buttonLabel, 
  children, 
  initialExpanded = false,
  className = ''
}: FormCollapsibleProps) => {
  const [expanded, setExpanded] = useState(initialExpanded);

  return (
    <div className={`w-full ${className}`}>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between bg-secondary-50 rounded-lg px-5 py-3.5 text-left text-sm font-medium text-gray-800 hover:bg-secondary-100"
      >
        <span>{buttonLabel}</span>
        {expanded ? (
          <ChevronUpIcon className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDownIcon className="h-5 w-5 text-gray-500" />
        )}
      </button>
      
      <div
        className={`mt-3 px-1 overflow-hidden transition-all duration-300 ${
          expanded ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default FormCollapsible;