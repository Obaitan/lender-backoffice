'use client';

import { useState, useEffect } from 'react';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { ActivityItem } from '@/types';
import Image from 'next/image';
import { formatDate } from '@/utils/functions';
import { Loader2 } from 'lucide-react';

// function to fetch activity history
const fetchActivityHistory = async (
  loanNumber: string
): Promise<ActivityItem[]> => {
  // Mock data
  return [
    {
      id: 1,
      actionType: 'Loan Application Reviewed',
      actionBy: 'Mark Johnson',
      role: 'SSO',
      date: '2023-12-10T14:32:21',
      comment:
        'Customer meets all requirements for this loan. Approved for processing.',
    },
    {
      id: 2,
      actionType: 'Loan Amount Adjusted',
      actionBy: 'Sarah Williams',
      role: 'CRO',
      date: '2023-12-11T09:15:45',
      comment:
        'Adjusted loan amount based on customer financial history and current policy guidelines.',
    },
    {
      id: 3,
      actionType: 'Loan Approved',
      actionBy: 'Michael Brown',
      role: 'CAM',
      date: '2023-12-12T16:05:33',
      comment:
        'Approved loan amount based on customer financial history and policy guidelines.',
    },
  ];
};

interface ActivityHistoryProps {
  loanNumber: string;
}

const ActivityHistory = ({ loanNumber }: ActivityHistoryProps) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getActivityHistory = async () => {
      if (!loanNumber) return;

      setIsLoading(true);
      setError(null);

      try {
        const history = await fetchActivityHistory(loanNumber);
        setActivities(history);
      } catch (err) {
        console.error('Error fetching activity history:', err);
        setError('Failed to load activity history');
      } finally {
        setIsLoading(false);
      }
    };

    getActivityHistory();
  }, [loanNumber]);

  // Format date string to readable format
  // const formatDate = (dateString: string): string => {
  //   const date = new Date(dateString);
  //   return date.toLocaleString('en-US', {
  //     year: 'numeric',
  //     month: 'short',
  //     day: 'numeric',
  //     hour: '2-digit',
  //     minute: '2-digit',
  //   });
  // };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-secondary-200" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-3 rounded-md mt-5">{error}</div>
    );
  }

  if (!loanNumber) {
    return (
      <div className="bg-[#f9f9f9] mt-5 p-4 md:p-5 flex justify-center items-center h-40">
        <p className="text-gray-500">No loan selected</p>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="bg-[#f9f9f9] mt-5 p-4 md:p-5 flex justify-center items-center h-40">
        <p className="text-gray-500">No activity history found</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex justify-end items-center mb-4">
        {/* <p className="text-gray-700 font-medium">Activity Log</p> */}
        <button className="text-secondary-200 flex text-sm gap-1 items-center hover:underline">
          <ArrowUpTrayIcon className="w-4 h-4 stroke-2" />
          <span>Export</span>
        </button>
      </div>

      <div className="flex flex-col gap-5">
        {activities.map((activity) => (
          <div key={activity.id} className="border-b border-b-gray-50 pb-5">
            <div className="flex items-center gap-2">
              <span className="bg-primary-200 h-2 w-2 rounded-full"></span>
              <p className="text-sm font-medium text-gray-800">
                {activity.actionType}
              </p>
            </div>
            <div className="pl-4 mt-1 space-y-1">
              <div className="flex justify-between items-center gap-5">
                <p className="text-xs font-medium text-secondary-200">
                  {activity.actionBy} ({activity.role})
                </p>
                <p className="text-xs text-gray-300">
                  {formatDate(activity.date)}
                </p>
              </div>
              {activity.comment && (
                <p className="text-sm text-gray-500">{activity.comment}</p>
              )}
            </div>
          </div>
        ))}
        <div className="border-b border-b-gray-50 pb-5">
          <div className="flex items-center gap-2">
            <span className="bg-primary-200 h-2 w-2 rounded-full"></span>
            <p className="text-sm font-medium text-gray-800">Loan Approval</p>
          </div>
          <div className="pl-4 mt-1 space-y-1.5">
            <div className="flex justify-between items-center gap-5">
              <p className="text-xs font-medium text-secondary-200">
                Kolawole Adebayo (CAM)
              </p>
              <p className="text-xs text-gray-300">
                {formatDate('2025-04-12T16:05:33')}
              </p>
            </div>

            <p className="text-sm text-gray-500">
              Approved loan amount of NGN 200,000 after customer uploaded
              documents I requested.
            </p>
            {/* If documents */}
            <div className="flex gap-8 mt-5">
              <button className="flex flex-col items-center gap-1">
                <Image
                  src={'/shapes/pdf-icon.svg'}
                  alt="XXX upload"
                  height={40}
                  width={41}
                />
                <p className="text-xs text-gray-300">Bank Statement</p>
              </button>
              <button className="flex flex-col items-center gap-1">
                <Image
                  src={'/shapes/pdf-icon.svg'}
                  alt="XXX upload"
                  height={40}
                  width={41}
                />
                <p className="text-xs text-gray-300">Land Deeds</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityHistory;
