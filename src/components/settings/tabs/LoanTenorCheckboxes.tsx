import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface LoanTenorCheckboxesProps {
  selectedTenors: number[];
  onTenorChange: (tenors: number[]) => void;
  disabled?: boolean;
}

const LoanTenorCheckboxes: React.FC<LoanTenorCheckboxesProps> = ({
  selectedTenors,
  onTenorChange,
  disabled = false,
}) => {
  const handleCheckboxChange = (month: number, checked: boolean) => {
    if (checked) {
      onTenorChange([...selectedTenors, month].sort((a, b) => a - b));
    } else {
      onTenorChange(selectedTenors.filter((t) => t !== month));
    }
  };

  // Create array of months 1-36
  const months = Array.from({ length: 36 }, (_, i) => i + 1);

  return (
    <div className="w-full">
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
        {months.map((month) => (
          <label
            key={month}
            className={`flex items-center space-x-2 p-2 rounded border ${
              disabled 
                ? 'cursor-not-allowed opacity-60 border-gray-100' 
                : 'cursor-pointer border-gray-200 hover:border-secondary-200 hover:bg-secondary-50'
            } ${
              selectedTenors.includes(month) && !disabled 
                ? 'bg-secondary-50 border-secondary-200' 
                : ''
            }`}
          >
            <Checkbox
              checked={selectedTenors.includes(month)}
              onCheckedChange={(checked) => 
                handleCheckboxChange(month, checked as boolean)
              }
              disabled={disabled}
              className="data-[state=checked]:bg-secondary-200 data-[state=checked]:border-secondary-200"
            />
            <span className={`text-sm font-medium ${
              disabled ? 'text-gray-400' : 'text-gray-700'
            }`}>
              {month}
            </span>
          </label>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onTenorChange(months)}
          disabled={disabled}
          className={`text-xs px-3 py-1 rounded ${
            disabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200 hover:text-white'
          }`}
        >
          Select All
        </button>
        <button
          type="button"
          onClick={() => onTenorChange([])}
          disabled={disabled}
          className={`text-xs px-3 py-1 rounded ${
            disabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

export default LoanTenorCheckboxes;