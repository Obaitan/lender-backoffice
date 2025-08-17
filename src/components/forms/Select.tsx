'use client';

import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { useState, useRef, useEffect } from 'react';
import { SelectProps } from '@/types';

const Select: React.FC<SelectProps> = ({
  options,
  selectedValue,
  onChange,
  label,
  className,
  buttonStyle,
  placeholder = 'Select an option',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const listboxId = `listbox-${label?.toLowerCase().replace(/\s+/g, '-')}`;
  const buttonId = `select-button-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  const handleSelect = (value: string) => {
    if (String(value) !== String(selectedValue)) {
      onChange(value);
    }
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      selectRef.current &&
      !selectRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(
    (option) => String(option.value) === String(selectedValue)
  );

  return (
    <div
      className={`relative inline-block text-left w-full ${className}`}
      ref={selectRef}
    >
      {label && (
        <label
          htmlFor={buttonId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <button
        id={buttonId}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={label ? `${buttonId}-label ${buttonId}` : buttonId}
        aria-controls={listboxId}
        className={`w-full cursor-pointer rounded-md bg-white py-2.5 pl-3 pr-10 text-left text-sm ${buttonStyle} ${
          isOpen ? 'border-2 border-secondary-200' : 'border border-disabled'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="block truncate text-gray-500">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronDownIcon
            className="h-4 w-4 text-gray-400"
            aria-hidden="true"
          />
        </span>
      </button>

      {isOpen && (
        <ul
          id={listboxId}
          role="listbox"
          aria-labelledby={buttonId}
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-sm"
        >
          {options.map((option) => (
            <li
              key={option.value}
              role="option"
              aria-selected={String(selectedValue) === String(option.value)}
              className={`cursor-pointer select-none py-2.5 pl-3 pr-4 hover:bg-secondary-50 text-gray-400 hover:text-gray-800 ${
                String(selectedValue) === String(option.value)
                  ? 'bg-secondary-50'
                  : ''
              }`}
              onClick={() => handleSelect(option.value)}
            >
              <span
                className={`block truncate ${
                  String(selectedValue) === String(option.value)
                    ? 'font-medium'
                    : 'font-normal'
                }`}
              >
                {option.label}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Select;
