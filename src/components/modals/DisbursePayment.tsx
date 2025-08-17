'use client';

import { useState } from 'react';
import { XMarkIcon, LockClosedIcon } from '@heroicons/react/24/solid';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface DisbursePaymentProps {
  isOpen: boolean;
  onClose: () => void;
  approvedAmount: number;
  initialInterestRate: number;
  initialTenureMonths: number;
  onRequestOTP: (amount: number, tenure: number) => void;
  onSubmitDisbursement: (otp: string) => void;
}

const DisbursePayment = ({
  isOpen,
  onClose,
  approvedAmount,
  initialInterestRate,
  initialTenureMonths,
  onRequestOTP,
  onSubmitDisbursement,
}: DisbursePaymentProps) => {
  // State to manage the modal's view: 'initial', 'accept', or 'reject'
  const [view, setView] = useState<'initial' | 'accept' | 'reject'>('initial');

  // State for accept step: 'details' or 'otp' (only relevant when view === 'accept')
  const [acceptStep, setAcceptStep] = useState<'details' | 'otp'>('details');

  // State for rejection reason
  const [rejectReason, setRejectReason] = useState('');
  const [otherReason, setOtherReason] = useState('');

  // State for disbursement amount selection
  const [amountType, setAmountType] = useState<'approved' | 'custom'>(
    'approved'
  );
  // State for custom amount input - initialize with approved amount
  const [customAmount, setCustomAmount] = useState(approvedAmount);

  // State for tenure input (if editable)
  const [tenure, setTenure] = useState(initialTenureMonths);

  // State for OTP input
  const [otp, setOtp] = useState('');

  // Calculate monthly payment (simple example - replace with actual loan calculation)
  const calculateMonthlyPayment = (
    principal: number,
    rate: number,
    months: number
  ) => {
    if (principal <= 0 || rate < 0 || months <= 0) return 0;
    // Simple interest calculation for demonstration
    const totalAmount = principal + principal * (rate / 100);
    return totalAmount / months;
  };

  const monthlyPayment = calculateMonthlyPayment(
    amountType === 'approved' ? approvedAmount : customAmount,
    initialInterestRate,
    tenure
  );

  // Handlers
  const handleSubmitClick = () => {
    // Perform validation on OTP if needed
    onSubmitDisbursement(otp);
    // Reset state and close modal after submission
    setView('initial');
    setAmountType('approved');
    setCustomAmount(approvedAmount); // Reset custom amount
    setTenure(initialTenureMonths); // Reset tenure
    setOtp('');
    onClose();
  };

  // When switching to accept, reset acceptStep
  const handleAcceptClick = () => {
    setView('accept');
    setAcceptStep('details');
  };

  // When closing modal, reset acceptStep
  const handleCloseModal = () => {
    setView('initial');
    setAcceptStep('details');
    setAmountType('approved');
    setCustomAmount(approvedAmount); // Reset custom amount
    setTenure(initialTenureMonths); // Reset tenure
    setOtp('');
    setRejectReason('');
    setOtherReason('');
    onClose();
  };

  if (!isOpen) return null;

  // Helper to format currency (assuming NGN)
  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Rejection reasons
  const rejectionOptions = [
    'Unverified documents',
    'Outstanding unpaid loan(s)',
    'Suspected fraud',
    'Other Reasons',
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center bg-black bg-opacity-60"
      onClick={handleCloseModal}
    >
      <div
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto p-0 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div id="1" className="flex justify-between items-start px-6 pt-4">
          <div>
            <h2 className="font-medium text-primary-200">
              Approved Loan Amount
            </h2>
            <p className="font-bold text-xl text-gray-800">
              {formatCurrency(approvedAmount) || '0.00'}
            </p>
          </div>
          <button
            onClick={handleCloseModal}
            className="text-gray-400 hover:text-error-400 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pb-6 space-y-6">
          {view === 'initial' && <></>}

          {view === 'reject' && (
            <div>
              <p className="font-medium text-gray-700 mt-3.5">
                Reason for rejection
              </p>
              <RadioGroup
                value={rejectReason}
                onValueChange={setRejectReason}
                className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2.5"
              >
                {rejectionOptions.map((option) => (
                  <div
                    key={option}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <RadioGroupItem value={option} id={option} />
                    <label htmlFor={option}>{option}</label>
                  </div>
                ))}
              </RadioGroup>
              {rejectReason === 'Other Reasons' && (
                <textarea
                  className="w-full border border-gray-200 rounded-md px-3 py-2 mt-4 text-sm"
                  placeholder="Please specify other reason..."
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                  rows={3}
                />
              )}
            </div>
          )}

          {view === 'accept' && acceptStep === 'details' && (
            <div className="space-y-3 mt-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-[#f5f5f5] rounded-md text-sm">
                <div className="space-y-1">
                  <p className="text-gray-500 flex items-center gap-1">
                    <LockClosedIcon className="w-3.5 h-3.5" /> Interest
                  </p>
                  <p className="font-medium text-gray-800">
                    {initialInterestRate}%
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-500">Tenure</p>
                  <p className="font-medium text-gray-800">{tenure} Months</p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-500">Monthly Payment</p>
                  <p className="font-medium text-gray-800">
                    {formatCurrency(monthlyPayment)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* OTP View: Enter OTP and submit (only in accept flow) */}
          {view === 'accept' && acceptStep === 'otp' && (
            <div className="space-y-4">
              <div className="mt-3.5">
                <p className="font-medium text-gray-600 text-sm mb-1.5">
                  Repayment Terms
                </p>
                <div className="grid grid-cols-1 gap-2.5 p-4 bg-[#f5f5f5] rounded-md text-[13px] md:text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Loan Tenure</span>
                    <span className="font-medium text-gray-800">
                      {tenure} Month(s)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Monthly Interest</span>
                    <span className="font-medium text-gray-800">
                      {formatCurrency(
                        (approvedAmount * (initialInterestRate / 100)) / tenure
                      ) || '0.00'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Total Monthly Repayment
                    </span>
                    <span className="font-medium text-gray-800">
                      {formatCurrency(monthlyPayment)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  Enter OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  className="w-full border border-gray-100 rounded-md shadow-sm px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-primary-200 focus:border-primary-200"
                  placeholder="4 digits OTP code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={4}
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          id="footer"
          className="flex items-center gap-4 px-6 py-4 border-t border-t-[#eee]"
        >
          {/* Initial view: Accept/Reject */}
          {view === 'initial' && (
            <>
              <button
                className="w-full px-6 py-2 text-sm font-medium text-white bg-secondary-200 rounded-md"
                onClick={handleAcceptClick}
              >
                Accept
              </button>
              <button
                className="w-full px-6 py-2 text-sm font-medium text-white bg-error-400 rounded-md"
                onClick={() => setView('reject')}
              >
                Reject
              </button>
            </>
          )}

          {/* Reject view: Back/Confirm Rejection */}
          {view === 'reject' && (
            <>
              <button
                className="w-full px-6 py-2 text-sm font-medium text-secondary-200 bg-white border border-secondary-200 rounded-md"
                onClick={() => setView('initial')}
              >
                Back
              </button>
              <button
                className="w-full px-6 py-2 text-sm font-medium text-white bg-error-400 rounded-md disabled:opacity-50"
                disabled={
                  !rejectReason ||
                  (rejectReason === 'Other Reasons' && !otherReason)
                }
                onClick={handleCloseModal}
              >
                Confirm
              </button>
            </>
          )}

          {/* Accept details view: Request OTP */}
          {view === 'accept' && acceptStep === 'details' && (
            <button
              onClick={() => {
                onRequestOTP(
                  amountType === 'approved' ? approvedAmount : customAmount,
                  tenure
                );
                setAcceptStep('otp');
              }}
              className="w-full px-6 py-2 text-sm font-medium text-white bg-secondary-200 rounded-md"
            >
              Request OTP
            </button>
          )}

          {/* Accept OTP view: Back/Submit */}
          {view === 'accept' && acceptStep === 'otp' && (
            <>
              <button
                onClick={() => setAcceptStep('details')}
                className="w-full px-6 py-2 text-sm font-medium text-secondary-200 bg-white border border-secondary-200 rounded-md"
              >
                Back
              </button>
              <button
                onClick={handleSubmitClick}
                disabled={otp.length !== 4}
                className="w-full px-6 py-2 text-sm font-medium text-white bg-secondary-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisbursePayment;
