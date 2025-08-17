import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import FieldVerificationStatus from './FieldVerificationStatus';
import { VerificationStatus } from './VerificationStatusIcon';

interface VerificationField {
  key: string;
  label: string;
  value: string;
  status: VerificationStatus;
  expectedValue?: string;
}

interface DetailedVerificationCardProps {
  title: string;
  fields: VerificationField[];
  profileImage?: string;
  isCollapsible?: boolean;
  defaultExpanded?: boolean;
}

const DetailedVerificationCard: React.FC<DetailedVerificationCardProps> = ({
  title,
  fields,
  profileImage,
  isCollapsible = true,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const verifiedCount = fields.filter(f => f.status === 'verified').length;
  const totalCount = fields.length;
  const hasFailures = fields.some(f => f.status === 'failed');

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div 
        className={`p-4 border-b border-gray-200 ${
          isCollapsible ? 'cursor-pointer hover:bg-gray-50' : ''
        }`}
        onClick={() => isCollapsible && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {profileImage && (
              <Image 
                src={profileImage} 
                alt="Profile" 
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                unoptimized={profileImage.startsWith('data:')}
              />
            )}
            <div>
              <h3 className="font-medium text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500">
                {verifiedCount} of {totalCount} fields verified
                {hasFailures && (
                  <span className="text-red-500 ml-2">• Issues detected</span>
                )}
              </p>
            </div>
          </div>
          {isCollapsible && (
            isExpanded ? (
              <ChevronUpIcon className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDownIcon className="w-5 h-5 text-gray-400" />
            )
          )}
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field) => (
              <FieldVerificationStatus
                key={field.key}
                label={field.label}
                value={field.value}
                status={field.status}
                mismatchValue={field.expectedValue}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailedVerificationCard;