'use client';

import { useState } from 'react';
import { SwitchProps } from '@/types';

export const Switch: React.FC<SwitchProps> = ({
  children,
  isChecked = false,
  onChange,
}) => {
  const [checked, setChecked] = useState(isChecked);

  const handleToggle = () => {
    const newChecked = !checked;
    setChecked(newChecked);
    if (onChange) {
      onChange(newChecked);
    }
  };

  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={handleToggle}
        className={`relative inline-flex items-center h-5 w-10 rounded-full transition-colors duration-300 focus:outline-none ${
          checked ? 'bg-secondary-200' : 'bg-[#cfd8dd]'
        }`}
      >
        <span
          className={`inline-block h-[22px] w-[22px] border transform rounded-full bg-white shadow-md transition-transform duration-300 bottom-1 ${
            checked
              ? 'translate-x-5 border-secondary-200'
              : 'translate-x-0 border-[#cfd8dd]'
          }`}
        />
      </button>
      <>{children}</>
    </div>
  );
};
