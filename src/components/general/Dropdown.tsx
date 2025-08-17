'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';

interface DropdownItem {
  label: string;
  // onClick?: () => {};
}

interface DropdownProps {
  buttonLabel: string;
  icon: ReactNode;
  items?: DropdownItem[];
  onItemClick?: (label: string) => void;
}

export const Dropdown = ({
  buttonLabel,
  icon,
  items,
  onItemClick,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 rounded-md shadow-sm border border-secondary-200 text-xs text-secondary-200 hover:opacity-75 px-2.5 py-1.5 outline-none"
      >
        <span className="sr-only">Open menu</span>
        {icon}
        {buttonLabel}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-40 max-w-52 bg-white border border-gray-50 rounded-md shadow-md z-10 p-1">
          {items?.map((item, index) => (
            <button
              type="button"
              key={index}
              onClick={() => {
                onItemClick?.(item.label);
                setIsOpen(false);
              }}
              className="capitalize block w-full text-left text-sm text-gray-700 px-3 py-2 hover:bg-secondary-50 hover:text-secondary-200 rounded"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
