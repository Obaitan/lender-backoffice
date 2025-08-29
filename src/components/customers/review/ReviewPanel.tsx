'use client';

import { useState } from 'react';
import { Loader2, PanelBottomCloseIcon } from 'lucide-react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import Select from '../../forms/Select';
import { InnerTabsComponent } from '../../navigation/InnerTabs';
import Details from './Details';
import ActivityHistory from './ActivityHistory';
import { LoanResponse, SelectOption } from '@/types';

const ReviewPanel = () => {
  const [openPanel, setOpenPanel] = useState<boolean>(false);
  const [loans] = useState<SelectOption[]>([]);
  const [loadedLoans] = useState<LoanResponse[]>([]);
  const [selectedLoan, setSelectedLoan] = useState<string>('');
  const [selectedLoanData, setSelectedLoanData] = useState<LoanResponse | null>(
    null
  );
  const [isLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch loans when component mounts or reviewInfo changes

  // Handle loan selection change
  const handleLoanChange = (loanNumber: string) => {
    setSelectedLoan(loanNumber);

    // Find the selected loan from already loaded loans
    const loanDetails =
      loadedLoans.find((loan) => loan.loanNumber === loanNumber) || null;
    setSelectedLoanData(loanDetails);

    if (loanDetails) {
      console.log('Selected loan details from cache:', loanDetails);
    } else {
      console.log('Could not find details for loan:', loanNumber);
      setError(`Could not find details for loan ${loanNumber}`);
    }
  };

  const togglePanel = () => {
    setOpenPanel(!openPanel);
  };

  const reviewTabs = [
    {
      label: 'Details',
      content: <Details loanData={selectedLoanData} isLoading={isLoading} />,
    },
    {
      label: 'Activity History',
      content: <ActivityHistory loanNumber={selectedLoan} />,
    },
  ];

  return (
    <>
      <button
        onClick={togglePanel}
        className="bg-transparent flex h-[30px] w-8 justify-center items-center rounded shadow-sm border border-secondary-200 text-secondary-200 hover:bg-secondary-200 hover:text-white"
      >
        <PanelBottomCloseIcon className="w-[18px] h-[18px]" />
      </button>
      {openPanel && (
        <div
          style={{
            transform: openPanel ? 'translateY(0)' : 'translateY(100%)',
            transition: 'transform 0.3s ease-in-out',
          }}
          className="fixed top-[69px] right-0 bottom-0 h-screen max-h-screen w-[calc(100%-20px)] md:w-[520px] bg-white shadow-md p-5 pb-16 overflow-y-auto z-40 border border-gray-50"
        >
          <button
            onClick={togglePanel}
            className="absolute top-3 right-4 bg-gray-50 p-1.5 rounded-full hover:bg-error-50 hover:bg-opacity-60 hover:text-error-300"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
          <div>
            <div className="my-6">
              <p className="text-sm mb-1.5 text-gray-400">
                Select Loan / Application
              </p>
              {isLoading && loans.length === 0 ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="animate-spin text-secondary-200" />
                </div>
              ) : error && loans.length === 0 ? (
                <div className="p-3 bg-red-50 text-red-700 rounded text-sm">
                  {error}
                </div>
              ) : (
                <Select
                  options={loans}
                  selectedValue={selectedLoan}
                  placeholder="Select loan"
                  onChange={(value) => handleLoanChange(value)}
                  buttonStyle="!border-[#eee]"
                />
              )}
            </div>
            <InnerTabsComponent tabs={reviewTabs} />
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewPanel;
