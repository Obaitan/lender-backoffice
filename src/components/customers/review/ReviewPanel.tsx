'use client';

import { useState, useEffect } from 'react';
import { PanelBottomCloseIcon } from 'lucide-react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { InnerTabsComponent } from '../../navigation/InnerTabs';
import Details from './Details';
import ActivityHistory from './ActivityHistory';
import { LoanService, LoanResponse } from '@/services/loanService';

// Define interface for reviewInfo props
interface ReviewInfoProps {
  loan?: string;
  activity?: string;
  customerID: string; // Now required
}

const ReviewPanel = ({ reviewInfo }: { reviewInfo: ReviewInfoProps }) => {
  const [openPanel, setOpenPanel] = useState<boolean>(false);
  const [selectedLoan, setSelectedLoan] = useState<string>('');
  const [selectedLoanData, setSelectedLoanData] = useState<LoanResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activityRefreshTrigger, setActivityRefreshTrigger] = useState<number>(0);

  // Fetch customer loans when panel opens or reviewInfo changes
  useEffect(() => {
    const fetchCustomerLoans = async () => {
      if (!reviewInfo.customerID || reviewInfo.customerID === 'N/A') {
        return;
      }
      setIsLoading(true);
      try {
        const customerLoans = await LoanService.getLoansByCustomerID(
          reviewInfo.customerID
        );
        if (customerLoans && customerLoans.length > 0) {
          const firstLoanNumber = customerLoans[0].loanNumber;
          setSelectedLoan(firstLoanNumber);
          const loanDetails =
            customerLoans.find((loan) => loan.loanNumber === firstLoanNumber) ||
            null;
          setSelectedLoanData(loanDetails);
        }
      } catch (err) {
        console.error('Error fetching customer loans:', err);
      } finally {
        setIsLoading(false);
      }
    };
    if (openPanel) {
      fetchCustomerLoans();
    }
  }, [reviewInfo.customerID, openPanel]);

  const togglePanel = () => {
    setOpenPanel(!openPanel);
  };

  const reviewTabs = [
    {
      label: 'Comments & History',
      content: (
        <ActivityHistory
          loanNumber={selectedLoan}
          customerID={reviewInfo.customerID}
          refreshTrigger={activityRefreshTrigger}
        />
      ),
    },
    {
      label: 'Manage Application',
      content: (
        <Details 
          loanData={selectedLoanData} 
          isLoading={isLoading}
          onActivityCreated={() => {
            // Trigger refresh in ActivityHistory when activity is created
            setActivityRefreshTrigger(prev => prev + 1);
          }}
        />
      ),
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
          <div className="mt-4 mb-6">
            <InnerTabsComponent tabs={reviewTabs} />
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewPanel;
