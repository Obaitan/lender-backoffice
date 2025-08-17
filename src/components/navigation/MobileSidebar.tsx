'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { NavLinkProps } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
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
  XMarkIcon,
} from '@heroicons/react/24/solid';
import { Button } from '../general/Button';
import React from 'react';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  openNotifications?: () => void;
}

const MobileNavLink = ({
  label,
  href,
  icon,
  onClose,
}: NavLinkProps & { onClose: () => void }) => {
  const pathname = usePathname();

  const hrefPath = href.split('/')[1];
  const pathnamePath = pathname?.split('/')[1] || '';

  return (
    <Link
      href={href}
      onClick={onClose}
      className={`flex z-20 items-center gap-2 px-4 h-10 text-sm hover:bg-secondary-50 hover:text-secondary-200 rounded ${
        hrefPath === pathnamePath
          ? 'font-medium text-secondary-200 bg-secondary-50'
          : 'font-light text-gray-300 bg-transparent'
      }`}
    >
      <div className="flex items-center gap-x-2.5">
        {icon}
        {label}
      </div>
    </Link>
  );
};

export const MobileSidebar = ({ isOpen, onClose }: MobileSidebarProps) => {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/');
    onClose();
  };

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
      moduleName: 'Customers',
    },
    {
      href: '/repayments',
      icon: <CreditCardIcon className="h-4 w-4" />,
      label: 'Repayments',
      moduleName: 'Repayments',
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
      moduleName: 'Audit Logs',
    },
    {
      href: '/settings',
      icon: <Cog6ToothIcon className="h-4 w-4" />,
      label: 'Settings',
      moduleName: 'Settings',
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/60" onClick={onClose}>
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
            className="fixed inset-y-0 left-0 w-[250px] bg-white shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              <div className="px-5 pt-5">
                <div className="flex justify-between items-center mb-4">
                  <Image
                    src={'/branding/paylaterhub-logo.svg'}
                    alt="Paylaterhub logo"
                    width={150}
                    height={40}
                    className="w-32"
                  />
                  <Button
                    onClick={onClose}
                    className="bg-transparent !p-1 !w-8 !h-8 !rounded-full hover:bg-gray-100"
                  >
                    <XMarkIcon className="h-6 w-6 text-gray-500" />
                  </Button>
                </div>

                <hr className="mt-4 mb-8 border-gray-50" />
              </div>

              <div className="flex-1 overflow-y-auto px-5">
                <div className="flex flex-col min-h-[85%] justify-between">
                  <div className="grid grid-cols-1 gap-1">
                    {navigationLinks.map((link) => {
                      return (
                        <MobileNavLink
                          key={link.href}
                          href={link.href}
                          icon={link.icon}
                          label={link.label}
                          onClose={onClose}
                        />
                      );
                    })}
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
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
