'use client';

import { useState, useEffect } from 'react';
import StatusChip from '@/components/general/StatusChip';
import {
  HandThumbDownIcon,
  HandThumbUpIcon,
  LockClosedIcon,
  NoSymbolIcon,
  PaperClipIcon,
} from '@heroicons/react/24/solid';
import Tooltip from '@/components/general/Tooltip';
import { FileOutputIcon, Loader2 } from 'lucide-react';
import { LoanResponse } from '@/types';
import UploadDocument from '@/components/modals/UploadDocument';

interface DetailsProps {
  loanData: LoanResponse | null;
  isLoading: boolean;
}

const Details = ({ loanData, isLoading }: DetailsProps) => {
  const [adjustedValue, setAdjustedValue] = useState<string>('0');
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [tenure, setTenure] = useState<string>('');
  const [monthlyRepayment, setMonthlyRepayment] = useState<string>('');
  const [interestRate, setInterestRate] = useState<string>('0');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Initialize form values when loan data changes
  useEffect(() => {
    if (loanData) {
      console.log('Loan data received in Details component:', loanData);

      // Convert loan amount to formatted string
      const formattedAmount =
        loanData.amount !== undefined
          ? Number(loanData.amount).toLocaleString('en-US')
          : '0';
      setAdjustedValue(formattedAmount);

      // Set tenure
      setTenure(loanData.duration?.toString() || '');

      // Set interest rate
      const rate =
        loanData.interestRate !== undefined
          ? Number(loanData.interestRate).toFixed(2)
          : loanData.interest !== undefined && loanData.amount !== undefined
          ? (
              (Number(loanData.interest) / Number(loanData.amount)) *
              100
            ).toFixed(2)
          : '0';
      setInterestRate(rate);

      // Set monthly repayment
      const monthly =
        loanData.installmentAmount !== undefined
          ? Number(loanData.installmentAmount).toLocaleString('en-US')
          : '0';
      setMonthlyRepayment(monthly);
    }
  }, [loanData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
    const formattedValue = rawValue
      ? Number(rawValue).toLocaleString('en-US')
      : '';
    setAdjustedValue(formattedValue);
  };

  const handleTenureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numeric input
    const value = e.target.value.replace(/\D/g, '');
    setTenure(value);

    // Optionally recalculate monthly payment
    calculateMonthlyPayment(value);
  };

  const calculateMonthlyPayment = (tenureInMonths: string) => {
    if (!loanData || !tenureInMonths) return;

    const principal = Number(adjustedValue.replace(/,/g, ''));
    const interestRateValue = Number(interestRate) / 100;
    const months = Number(tenureInMonths);

    if (principal > 0 && months > 0) {
      // Simple calculation: total amount / number of months
      const totalAmount = principal + principal * interestRateValue;
      const monthly = totalAmount / months;

      setMonthlyRepayment(monthly.toLocaleString('en-US'));
    }
  };

  const buttons = [
    {
      id: 'approve',
      icon: <HandThumbUpIcon className="w-5 h-5" />,
      tooltip: 'Approve',
    },
    {
      id: 'decline',
      icon: <HandThumbDownIcon className="w-5 h-5" />,
      tooltip: 'Decline',
    },
    {
      id: 'pushback',
      icon: <FileOutputIcon className="w-[18px] h-[18px]" />,
      tooltip: 'Push Back',
    },
    {
      id: 'suspend',
      icon: <NoSymbolIcon className="w-5 h-5" />,
      tooltip: 'Suspend Account',
    },
  ];

  // Helper to get status for StatusChip
  const getLoanStatus = (
    status: string = ''
  ): 'active' | 'pending' | 'reviewing' | 'suspended' => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'active') return 'active';
    if (statusLower === 'paid') return 'active';
    if (statusLower === 'suspended') return 'suspended';
    if (statusLower === 'pending') return 'pending';
    return 'reviewing';
  };

  // Format currency for display
  const formatCurrency = (value: string | number | undefined): string => {
    if (value === undefined) return 'NGN 0';
    const numValue =
      typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;
    return `NGN ${numValue.toLocaleString('en-US')}`;
  };

  const handleFileUpload = (files: File[]) => {
    // Handle the file upload here
    console.log('Files to upload:', files);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-secondary-200" />
      </div>
    );
  }

  // Show message if no loan data
  if (!loanData) {
    return (
      <div className="bg-[#f9f9f9] mt-5 p-4 md:p-5 flex justify-center items-center h-40">
        <p className="text-gray-500">No loan details available</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#f9f9f9] mt-5 p-4 md:p-5">
        <StatusChip status={getLoanStatus(loanData.status)} />
        <div className="space-y-0.5 mt-3.5">
          <p className="text-xs text-gray-400">Loan Application Amount</p>
          <p className="font-semibold text-gray-800">
            {formatCurrency(loanData.amount)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-4 mt-5">
          <div className="col-span-full space-y-1.5">
            <p className="text-xs text-gray-400">Adjusted Loan Amount</p>
            <div className="relative text-[15px]">
              <input
                type="text"
                className="w-full border text-gray-800 border-[#eee] rounded-lg px-3.5 py-2 text-base outline-none"
                inputMode="numeric"
                pattern="\d*"
                value={adjustedValue}
                onChange={handleChange}
              />
              <span className="absolute top-2 right-3.5 text-gray-600 font-medium">
                NGN
              </span>
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex gap-1.5 items-center text-gray-400">
              <LockClosedIcon className="w-3.5 h-3.5" />
              <p className="text-xs">Interest Rate</p>
            </div>
            <div className="flex items-center gap-1.5 text-[15px]">
              <input
                type="text"
                className="w-full border text-gray-800 border-[#eee] rounded-lg px-3.5 py-2 text-base outline-none disabled:bg-white disabled:cursor-not-allowed"
                inputMode="decimal"
                value={interestRate}
                disabled // Disable if user's role is not CAM
              />
              <span className="text-gray-600 font-medium">%</span>
            </div>
          </div>
          <div className="space-y-1.5">
            <p className="text-xs text-gray-400">Tenure (Days)</p>
            <input
              type="text"
              className="w-full border text-gray-800 border-[#eee] rounded-lg px-3.5 py-2 text-base outline-none text-[15px]"
              inputMode="numeric"
              pattern="\d*"
              value={tenure}
              onChange={handleTenureChange}
              placeholder="Enter tenure"
            />
          </div>
          <div className="col-span-full space-y-1.5">
            <p className="text-xs text-gray-400">Monthly Repayment Amount</p>
            <div className="relative text-[15px]">
              <input
                type="text"
                className="w-full border text-gray-800 border-[#eee] rounded-lg px-3.5 py-2 text-base outline-none disabled:bg-white disabled:cursor-not-allowed"
                inputMode="numeric"
                pattern="\d*"
                value={monthlyRepayment}
                readOnly
              />
              <span className="absolute top-2 right-3.5 text-gray-600 font-medium">
                NGN
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="my-5">
        <div className="flex justify-between items-center w-full mb-2">
          <p className="text-sm text-gray-800 font-medium">
            Comments / Message
          </p>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center justify-center gap-1 px-2.5 py-2 text-xs font-medium text-gray-500 bg-white hover:bg-primary-300 rounded-lg hover:text-secondary-200 transition-colors border border-[#eee]"
          >
            <PaperClipIcon className="h-4 w-4 text-secondary-200" />
            Attach File
          </button>
        </div>
        <textarea
          rows={4}
          className="p-3 text-sm text-gray-800 rounded-md border border-[#eee] w-full outline-0 mb-3"
          placeholder="Enter comments here..."
        ></textarea>
        <div className="flex flex-col md:flex-row gap-x-4 gap-y-6 items-end justify-between">
          <div className="flex gap-2.5">
            {buttons.map(({ id, icon, tooltip }) => (
              <Tooltip key={id} content={tooltip}>
                <button
                  className={`text-sm w-10 h-10 flex items-center justify-center rounded-full outline-0 transition-all 
              ${
                activeButton === id
                  ? 'bg-secondary-200 text-white'
                  : 'bg-[#f4f4f4] text-gray-200 hover:bg-secondary-50 hover:text-secondary-200'
              }`}
                  onClick={() =>
                    setActiveButton(activeButton === id ? null : id)
                  }
                >
                  {icon}
                </button>
              </Tooltip>
            ))}
          </div>
          <button
            disabled={!activeButton}
            className="text-sm font-medium text-secondary-200 rounded-md border border-secondary-200 px-7 py-2 hover:bg-secondary-200 hover:text-white disabled:text-gray-200 disabled:bg-[#f4f4f4] disabled:border-gray-50 disabled:cursor-not-allowed"
          >
            Submit
          </button>
        </div>
      </div>

      <UploadDocument
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleFileUpload}
      />
    </>
  );
};

export default Details;
