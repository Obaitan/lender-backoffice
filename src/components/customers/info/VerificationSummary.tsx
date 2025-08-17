import React from 'react';
import { ExclamationTriangleIcon, CheckCircleIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import { Button } from '@/components/general/Button';

interface VerificationIssue {
  field: string;
  message: string;
}

interface VerificationSummaryProps {
  issues: VerificationIssue[];
  verifiedFields: number;
  totalFields: number;
  onVerify?: () => void;
  isVerifying?: boolean;
}

const VerificationSummary: React.FC<VerificationSummaryProps> = ({
  issues,
  verifiedFields,
  totalFields,
  onVerify,
  isVerifying = false,
}) => {
  const hasIssues = issues.length > 0;
  const verificationRate = totalFields > 0 ? (verifiedFields / totalFields) * 100 : 0;

  if (issues.length === 0 && verifiedFields === totalFields) {
    return (
      <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
        <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-green-800">
            All information verified successfully
          </p>
          <p className="text-xs text-green-600">
            {verifiedFields} of {totalFields} fields verified
          </p>
        </div>
      </div>
    );
  }

  if (hasIssues) {
    return (
      <div className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
        <ExclamationTriangleIcon className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-orange-800">
            {issues.map(issue => issue.field).join(', ')} {issues.length === 1 ? 'does' : 'do'} not match
          </p>
       
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-orange-600">
              {verifiedFields} of {totalFields} fields verified ({Math.round(verificationRate)}%)
            </p>
            {onVerify && (
              <Button
                onClick={onVerify}
                disabled={isVerifying}
                className="!w-24 sm:!w-28 !px-3 !py-1.5 !h-auto bg-orange-600 hover:bg-orange-700 text-white text-xs flex items-center justify-center gap-1.5"
              >
                {isVerifying ? (
                  <>
                    <ArrowPathIcon className="w-3 h-3 animate-spin" />
                    <span className="hidden sm:inline">Verifying...</span>
                  </>
                ) : (
                  <>
                    <ArrowPathIcon className="w-3 h-3" />
                    Verify
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
      <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-sm font-medium text-yellow-800">
          Verification in progress
        </p>
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-yellow-600">
            {verifiedFields} of {totalFields} fields verified ({Math.round(verificationRate)}%)
          </p>
          {onVerify && (
            <Button
              onClick={onVerify}
              disabled={isVerifying}
              className="!w-32 sm:!w-40 !px-3 !py-1.5 !h-auto bg-yellow-600 hover:bg-yellow-700 text-white text-xs flex items-center justify-center gap-1.5"
            >
              {isVerifying ? (
                <>
                  <ArrowPathIcon className="w-3 h-3 animate-spin" />
                  <span className="hidden sm:inline">Verifying...</span>
                </>
              ) : (
                <>
                  <ArrowPathIcon className="w-3 h-3" />
                 Verify
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationSummary;