'use client';

import { Switch as SwitchItem } from '@/components/forms/Switch';

export const Notifications = () => {
  return (
    <div className="flex flex-col gap-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="flex flex-col gap-1">
          <p className="capitalize text-gray-800 font-medium">
            Email notifications
          </p>
          <p className="text-xs text-gray-400">
            Adjust email notification settings here
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <SwitchItem>
            <div className="ml-1.5 flex flex-col gap-1">
              <p className="capitalize text-sm font-medium text-gray-800">
                New Applications
              </p>
              <p className="text-xs text-gray-400">
                Receive email notifications for new and assigned applications.
              </p>
            </div>
          </SwitchItem>
          <SwitchItem>
            <div className="ml-1.5 flex flex-col gap-1">
              <p className="capitalize text-sm font-medium text-gray-800">
                New Requests
              </p>
              <p className="text-xs text-gray-400">
                Receive email notifications for new customer requests.
              </p>
            </div>
          </SwitchItem>
          <SwitchItem>
            <div className="ml-1.5 flex flex-col gap-1">
              <p className="capitalize text-sm font-medium text-gray-800">
                Overdue Loans
              </p>
              <p className="text-xs text-gray-400">
                Receive email notifications for overdue loans.
              </p>
            </div>
          </SwitchItem>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="flex flex-col gap-1">
          <p className="capitalize text-gray-800 font-medium">
            Push notifications
          </p>
          <p className="text-xs text-gray-400">
            Adjust push notification settings here
          </p>
        </div>
        <div className="flex flex-col gap-5">
          <SwitchItem>
            <div className="ml-1.5 flex flex-col gap-1">
              <p className="capitalize text-sm font-medium text-gray-800">
                New Applications
              </p>
              <p className="text-xs text-gray-400">
                Get notifications for new and assigned applications.
              </p>
            </div>
          </SwitchItem>
          <SwitchItem>
            <div className="ml-1.5 flex flex-col gap-1">
              <p className="capitalize text-sm font-medium text-gray-800">
                New Requests
              </p>
              <p className="text-xs text-gray-400">
                Get notifications for new customer requests.
              </p>
            </div>
          </SwitchItem>
          <SwitchItem>
            <div className="ml-1.5 flex flex-col gap-1">
              <p className="capitalize text-sm font-medium text-gray-800">
                Overdue Loans
              </p>
              <p className="text-xs text-gray-400">
                Get notifications for overdue loans.
              </p>
            </div>
          </SwitchItem>
        </div>
      </div>
    </div>
  );
};
