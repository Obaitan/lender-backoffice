import React from 'react';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';

export type VerificationStatus = 'verified' | 'failed' | 'pending' | 'not_available';

interface VerificationStatusIconProps {
  status: VerificationStatus;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  tooltipText?: string;
}

const VerificationStatusIcon: React.FC<VerificationStatusIconProps> = ({
  status,
  size = 'sm',
  tooltipText,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const getIcon = () => {
    switch (status) {
      case 'verified':
        return (
          <CheckCircleIcon 
            className={`${sizeClasses[size]} text-green-500`}
            title={tooltipText || 'Verified'}
          />
        );
      case 'failed':
        return (
          <XCircleIcon 
            className={`${sizeClasses[size]} text-red-500`}
            title={tooltipText || 'Verification failed'}
          />
        );
      case 'pending':
        return (
          <ExclamationTriangleIcon 
            className={`${sizeClasses[size]} text-yellow-500`}
            title={tooltipText || 'Verification pending'}
          />
        );
      case 'not_available':
      default:
        return (
          <div 
            className={`${sizeClasses[size]} rounded-full bg-gray-300`}
            title={tooltipText || 'No verification data'}
          />
        );
    }
  };

  return (
    <div className="inline-flex items-center">
      {getIcon()}
    </div>
  );
};

export default VerificationStatusIcon;