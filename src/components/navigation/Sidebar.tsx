'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { NavLinkProps } from '@/types';
import {
  ArrowLeftStartOnRectangleIcon,
  BanknotesIcon,
  BellAlertIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  CreditCardIcon,
  DocumentTextIcon,
  FolderArrowDownIcon,
  QuestionMarkCircleIcon,
  UserGroupIcon,
  UsersIcon,
} from '@heroicons/react/24/solid';
import { Button } from '../general/Button';

const NavLink = ({
  label,
  href,
  icon,
  visible = true,
  moduleName,
}: NavLinkProps) => {
  const pathname = usePathname(); // Always call the hook at the top level
  const hrefPath = href.split('/')[1];
  const pathnamePath = pathname?.split('/')[1] || '';

  return (
    <Link
      href={href}
      className={`flex z-20 items-center gap-2 px-4 h-10 text-sm hover:bg-secondary-50 hover:text-secondary-200 rounded ${
        hrefPath === pathnamePath
          ? 'font-medium text-secondary-200 bg-secondary-50'
          : 'font-light text-gray-400 bg-transparent'
      }`}
    >
      <div className="flex items-center gap-x-2.5">
        {icon}
        {label}
      </div>
    </Link>
  );
};

export const Sidebar = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Redirect to login page
    router.push('/');
  };

  // Define sidebar links with their permissions
  const navigationLinks = [
    {
      href: '/dashboard',
      icon: <ChartBarIcon className="h-4 w-4" />,
      label: 'Dashboard',
    },
    {
      href: '/applications',
      icon: <DocumentTextIcon className="h-4 w-4" />,
      label: 'Applications',
    },
    {
      href: '/requests',
      icon: <FolderArrowDownIcon className="h-4 w-4" />,
      label: 'Requests',
    },
    {
      href: '/recovery',
      icon: <QuestionMarkCircleIcon className="h-4 w-4" />,
      label: 'Recovery',
    },

    {
      href: '/loans',
      icon: <BanknotesIcon className="h-4 w-4" />,
      label: 'Loans',
    },
    {
      href: '/customers',
      icon: <UserGroupIcon className="h-4 w-4" />,
      label: 'Customers',
    },
    {
      href: '/repayments',
      icon: <CreditCardIcon className="h-4 w-4" />,
      label: 'Repayments',
    },
    {
      href: '/team',
      icon: <UsersIcon className="h-4 w-4" />,
      label: 'Team',
    },
    {
      href: '/audit-logs',
      icon: <ClipboardDocumentListIcon className="h-4 w-4" />,
      label: 'Audit Logs',
    },
    {
      href: '/settings',
      icon: <Cog6ToothIcon className="h-4 w-4" />,
      label: 'Settings',
    },
  ];

  return (
    <div className="bg-white fixed z-20 inset-y-0 left-0 w-[215px] px-5 pt-5 shadow-sm overflow-y-auto">
      <h2 className="text-xl font-bold text-secondary-200 uppercase px-4">Lender</h2>
      <hr className="mt-4 mb-6 border-gray-100" />

      <div className="flex flex-col min-h-[85%] justify-between">
        <div className="grid grid-cols-1 gap-1">
          {/* Only render links when permissions are loaded */}
          {navigationLinks.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              icon={link.icon}
              label={link.label}
            />
          ))}
        </div>
        <div className="mt-4">
          <Button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3.5 !h-10 !text-sm !font-normal hover:bg-error-50 hover:bg-opacity-30 !text-error-300 !rounded"
          >
            <ArrowLeftStartOnRectangleIcon className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};
