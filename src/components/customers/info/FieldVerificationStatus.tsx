import React from 'react';
import VerificationStatusIcon, { VerificationStatus } from './VerificationStatusIcon';

interface FieldVerificationStatusProps {
  label: string;
  value: string | number | null | undefined;
  status: VerificationStatus;
  mismatchValue?: string;
  className?: string;
}

const FieldVerificationStatus: React.FC<FieldVerificationStatusProps> = ({
  label,
  value,
  status,
  mismatchValue,
  className = '',
}) => {
  const displayValue = value || 'No data';

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-center gap-2">
        <p className="text-[13px] text-gray-400">{label}</p>
        <VerificationStatusIcon 
          status={status} 
          tooltipText={
            status === 'failed' && mismatchValue 
              ? `Mismatch detected. Expected: ${mismatchValue}`
              : undefined
          }
        />
      </div>
      <div className="flex flex-col gap-1">
        <p className={`text-sm ${
          status === 'verified' 
            ? 'text-gray-700' 
            : status === 'failed' 
              ? 'text-red-600' 
              : 'text-gray-700'
        }`}>
          {displayValue}
        </p>
        {status === 'failed' && mismatchValue && (
          <p className="text-xs text-red-500 line-through">
            Expected: {mismatchValue}
          </p>
        )}
      </div>
    </div>
  );
};

export default FieldVerificationStatus;