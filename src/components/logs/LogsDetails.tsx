import Image from 'next/image';
import { formatDate } from '@/utils/functions';
import { LogData } from './LogsDataTable';

const LogsDetailsComponent = ({
  log,
  profilePicture,
  roleName,
}: {
  log?: LogData;
  profilePicture?: string;
  roleName?: string;
}) => {
  // If no log data is provided, show a placeholder
  if (!log) {
    return (
      <div className="grid grid-cols-1 gap-5">
        <div className="mb-2">
          <p className="font-medium text-gray-800">Log Details</p>
          <hr className="border-gray-50 mt-2" />
        </div>
        <div className="p-4 text-gray-500 text-center">
          No log details available.
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5">
      <div className="mb-2">
        <p className="font-medium text-gray-800">Log Details</p>
        <hr className="border-gray-50 mt-2" />
      </div>

      <div className="grid grid-cols-1 gap-y-7">
        <div className="flex flex-wrap gap-2 md:gap-3">
          <div className="relative h-12 w-12 overflow-hidden flex justify-center items-center rounded-full border border-disabled">
            <Image
              src={profilePicture ? profilePicture : '/images/avatar.svg'}
              alt="Profile picture"
              width={100}
              height={100}
              className="object-cover"
            />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <p className="text-gray-700 capitalize text-[15px]">
                {log.officer}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-sm text-gray-600 capitalize font-medium">
              {(roleName || log.role) && (
                <span className="text-secondary-200">
                  {roleName || log.role}
                </span>
              )}
              <span>|</span>
              <span className="lowercase">
                {log.email || 'No data'}
              </span>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-secondary-50 py-3 px-3.5 md:px-4 text-sm text-gray-800">
            Log Information
          </div>
          <div className="grid grid-cols-2 gap-y-8 border-b border-b-[#eee] px-3.5 py-4 md:px-4 md:py-[18px]">
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">IP Address</p>
              <p className="text-[13px] md:text-sm text-gray-700">
                {log.ipAddress}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Log ID</p>
              <p className="text-[13px] md:text-sm text-gray-700 font-mono">
                {log.id}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Action</p>
              <p className="text-[13px] md:text-sm text-gray-700 capitalize">
                {log.action}
              </p>
            </div>

            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Date / Time</p>
              <p className="text-[13px] md:text-sm text-gray-700">
                {formatDate(log?.dateTime)}
              </p>
            </div>
            <div className="col-span-full space-y-0.5">
              <p className="text-xs text-gray-300">Description</p>
              <p className="text-[13px] md:text-sm text-gray-700">
                {log.comment}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogsDetailsComponent;
