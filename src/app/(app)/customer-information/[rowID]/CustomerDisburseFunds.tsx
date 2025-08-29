'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAuth } from '@/hooks/useAuth';

const DisbursePayment = dynamic(
  () => import('@/components/modals/DisbursePayment'),
  { ssr: false }
);

interface CustomerDisburseFundsProps {
  approvedAmount: number;
  initialInterestRate: number;
  initialTenureMonths: number;
  workFlowStatus?: string;
  loanApplication?: {
    id: number;
    loanApplicationNumber: string;
    customerID: string;
    customerName: string;
    adjusteAmount: number;
    amount: number;
    interestRate: number;
  };
}

export default function CustomerDisburseFunds({
  approvedAmount,
  initialInterestRate,
  initialTenureMonths,
  workFlowStatus,
  loanApplication,
}: CustomerDisburseFundsProps) {
  const [isDisburseModalOpen, setIsDisburseModalOpen] = useState(false);
  const { user } = useAuth();

  // Get user role code - use roleCode directly since there's no nested role object
  const userRoleCode = user?.roleCode || undefined;
  
  // Check if user role is SSO or ADM
  const isSSOorADM = userRoleCode === 'SSO' || userRoleCode === 'ADM';
  
  // Enable button only if workFlowStatus is ReadyToDisburse AND user is SSO/ADM
  const isButtonEnabled = workFlowStatus?.toLowerCase() === 'readytodisburse' && isSSOorADM;

  // Debug logging
  useEffect(() => {
    console.log('Disburse Button Debug:', {
      user,
      userRoleCode,
      isSSOorADM,
      workFlowStatus,
      isReadyToDisburse: workFlowStatus?.toLowerCase() === 'readytodisburse',
      isButtonEnabled
    });
  }, [user, userRoleCode, isSSOorADM, workFlowStatus, isButtonEnabled]);

  const handleRequestOTP = (amount: number, tenure: number) => {
    // Implement logic to request OTP for disbursement
    console.log(
      'Requesting OTP for disbursement:',
      {
        amount,
        tenure,
        loanApplicationId: loanApplication?.id,
        customerID: loanApplication?.customerID,
      }
    );
  };

  const handleSubmitDisbursement = (otp: string) => {
    // Implement logic to submit disbursement with OTP
    console.log('Submitting disbursement:', {
      otp,
      loanApplicationId: loanApplication?.id,
      loanApplicationNumber: loanApplication?.loanApplicationNumber,
      customerID: loanApplication?.customerID,
      customerName: loanApplication?.customerName,
      amount: loanApplication?.adjusteAmount || loanApplication?.amount,
    });
  };

  return (
    <>
      <button
        className="px-3 md:px-3.5 py-1.5 bg-secondary-200 text-white rounded text-xs md:text-sm font-medium hover:bg-secondary-300 transition disabled:bg-[#ccc] disabled:cursor-not-allowed"
        onClick={() => setIsDisburseModalOpen(true)}
        type="button"
        disabled={!isButtonEnabled}
        title={!isButtonEnabled ? 'Only SSO/ADM can disburse when loan is ready' : 'Click to disburse funds'}
      >
        Disburse Funds
      </button>
      <DisbursePayment
        isOpen={isDisburseModalOpen}
        onClose={() => setIsDisburseModalOpen(false)}
        approvedAmount={loanApplication?.adjusteAmount || loanApplication?.amount || approvedAmount}
        initialInterestRate={loanApplication?.interestRate || initialInterestRate}
        initialTenureMonths={initialTenureMonths}
        onRequestOTP={handleRequestOTP}
        onSubmitDisbursement={handleSubmitDisbursement}
      />
    </>
  );
}
