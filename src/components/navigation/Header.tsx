'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Bars3CenterLeftIcon } from '@heroicons/react/24/solid';
import { Bell, BellRing } from 'lucide-react';
import { dummyUser, getDummyUser } from '@/utils/dummyUser';

const HeaderComponent = ({ openSidebar }: { openSidebar?: () => void }) => {
  // Generate initials for the avatar, combining first and last name initials
  const getUserInitials = () => {
    return `${dummyUser.firstName.charAt(0)}`.toUpperCase();
  };

  // Format the full name for display
  const getFullName = () => {
    if (!dummyUser) return 'Loading...';
    return `${dummyUser.firstName} ${dummyUser.lastName}`;
  };

  const unreadCount = 1;

  return (
    <div className="bg-white h-16 shadow xl:shadow-sm fixed top-0 left-0 xl:left-[221px] right-0 z-50 flex items-center px-6 xl:rounded-sm">
      <div className="flex justify-between items-center gap-5 w-full">
        <Image
          src={'/branding/paylaterhub-logo.svg'}
          alt="Paylaterhub logo"
          width={219}
          height={50}
          className="w-36 xl:hidden"
        />
        <p className="hidden xl:block text-[18px] font-medium text-gray-800">
          BackOffice 2.4
        </p>

        <div className="flex items-center gap-4 md:gap-5">
          <button className="bg-[#f9f9f9] w-9 h-9 rounded-full border border-gray-200 flex justify-center items-center hover:bg-secondary-50 relative cursor-pointer">
            <span className="absolute -top-0.5 -right-1.5 flex items-center justify-center bg-error-300 font-semibold text-[10px] text-white h-4 w-4 rounded-full">
              2
            </span>
            <BellRing className="w-6 h-6 text-secondary-200/60" />
          </button>
          <Link href="/settings" className="flex items-center gap-2.5">
            {dummyUser?.profilePicture ? (
              <div className="relative h-9 w-9 overflow-hidden flex justify-center items-center rounded-full border border-disabled">
                <Image
                  src={dummyUser.profilePicture}
                  alt="Profile picture"
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="bg-gray-50 w-9 h-9 rounded-full flex justify-center items-center text-[22px] font-semibold">
                {getUserInitials()}
              </div>
            )}

            <div className="hidden lg:block">
              <p className="text-xs text-gray-600 font-medium mb-0.5">
                {getFullName()}
              </p>
              <p className="text-[11px] text-gray-300">{dummyUser?.roleName}</p>
            </div>
          </Link>

          <button onClick={openSidebar} className="xl:hidden">
            <Bars3CenterLeftIcon className="h-8 w-8 text-gray-900" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeaderComponent;
