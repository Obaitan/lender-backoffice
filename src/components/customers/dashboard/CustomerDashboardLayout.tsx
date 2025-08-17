'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/general/Button';
import { getCustomerImageUrl } from '@/utils/functions';
import CustomerOverview from './CustomerOverview';
import LoanStatus from './LoanStatus';
import RecentTransactions from './RecentTransactions';
import QuickActions from './QuickActions';
import { 
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
  ClipboardDocumentIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

interface CustomerDashboardLayoutProps {
  customerData: {
    customers: {
      id: number;
      customerID: string;
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
      status: string;
      createDate: string;
      [key: string]: unknown;
    };
    customerPicture?: {
      filePath: string;
    };
    customerLoan?: Record<string, unknown>;
    customerBankingDetails?: Record<string, unknown>;
    customerDocuments?: Record<string, unknown>;
    customerEmployment?: Record<string, unknown>;
    assignedOfficer?: {
      fullName: string;
      email: string;
      phoneNumber: string;
    };
  };
}

export default function CustomerDashboardLayout({ customerData }: CustomerDashboardLayoutProps) {
  const router = useRouter();
  const customer = customerData.customers;
  const officer = customerData.assignedOfficer;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);

  // Get initials from officer name
  const getOfficerInitials = (fullName: string) => {
    const names = fullName.trim().split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return names[0] ? names[0][0].toUpperCase() : 'AO';
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentCustomerID');
      localStorage.removeItem('customerVerified');
      localStorage.removeItem('customerIdentifier');
      localStorage.removeItem('customerLoginMethod');
    }
    router.push('/loanapplication');
  };

  const handleCopyAccount = (accountNumber: string) => {
    navigator.clipboard.writeText(accountNumber);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-30">
        <div className="w-full px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Left section - Mobile Menu + Logo */}
            <div className="flex items-center">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 mr-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
              
              {/* Logo */}
              <div className="flex-shrink-0">
                <Image
                  src="/branding/paylaterhub-logo.svg"
                  alt="PayLaterHub"
                  height={40}
                  width={200}
                  className="h-10 w-auto"
                  priority
                />
              </div>
            </div>

            {/* Right section - User Menu */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Notification Button */}
              <button 
                className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
                title="Notifications"
              >
                <BellIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
              
              {/* Settings Button */}
              <button 
                className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
                title="Settings"
              >
                <Cog6ToothIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
              
              {/* User Profile Section */}
              <div className="flex items-center space-x-2 sm:space-x-3 pl-2 sm:pl-3 border-l border-gray-200">
                {/* Profile Picture */}
                <div className="flex-shrink-0">
                  {customerData.customerPicture?.filePath ? (
                    <Image
                      src={getCustomerImageUrl(customerData.customerPicture.filePath)}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full object-cover ring-2 ring-gray-100"
                    />
                  ) : (
                    <UserCircleIcon className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                
                {/* User Name - Hidden on mobile */}
                <div className="hidden md:block min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {customer.firstName} {customer.lastName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    Customer
                  </p>
                </div>
                
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                  title="Logout"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex">
        {/* Left Sidebar - Quick Actions */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 sm:w-72 lg:w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:transform-none lg:shadow-md lg:border-r lg:border-gray-200
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="h-full overflow-y-auto pt-6 lg:pt-4 pb-4 px-4">
            {/* Mobile header for sidebar */}
            <div className="lg:hidden mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center justify-center mb-4">
                <Image
                  src="/branding/paylaterhub-logo.svg"
                  alt="PayLaterHub"
                  height={32}
                  width={250}
                  className="h-8 w-auto"
                  priority
                />
              </div>
                 </div>
            
            <QuickActions customerData={customerData} />
            
            {/* Virtual Account Card - Mobile/Sidebar (Mobile Only) */}
            <div className="mt-6 bg-white rounded-lg border border-gray-200 shadow-sm p-4 lg:hidden">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Virtual Bank Account</h3>
              <div className="space-y-3">
                {/* Account Number */}
                <div className="bg-gray-50 rounded-md p-3 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">Account Number</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-mono font-semibold text-gray-900">
                      0123456789
                    </span>
                    <button
                      onClick={() => handleCopyAccount('0123456789')}
                      className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                      title="Copy account number"
                    >
                      {copiedAccount ? (
                        <CheckIcon className="h-4 w-4 text-success-500" />
                      ) : (
                        <ClipboardDocumentIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Bank Details */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Bank</span>
                    <span className="text-xs font-medium text-gray-900">Wema Bank</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Account Name</span>
                    <span className="text-xs font-medium text-gray-900 truncate ml-2">
                      {customer.firstName} {customer.lastName}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Info Note */}
              <div className="mt-3 p-2 bg-amber-50 rounded-md border border-amber-200">
                <p className="text-xs text-amber-800">
                  For loan repayments only
                </p>
              </div>
            </div>

            {/* Account Officer Card - Sidebar (Mobile Only) */}
            {officer && (
              <div className="mt-4 bg-white rounded-lg border border-gray-200 shadow-sm p-4 lg:hidden">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Your Account Officer</h3>
                
                {/* Officer Info */}
                <div className="bg-gradient-to-r from-secondary-50 to-secondary-100 rounded-md p-3 mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center shadow-sm">
                        <span className="text-white text-sm font-bold">{getOfficerInitials(officer.fullName)}</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 truncate">{officer.fullName}</h4>
                      <p className="text-xs text-gray-700 font-medium">Account Officer</p>
                    </div>
                  </div>
                </div>
                
                {/* Contact Details */}
                <div className="space-y-2 bg-gray-50 rounded-md p-3 border border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-secondary-100 rounded">
                      <svg className="h-3.5 w-3.5 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-800 truncate font-medium">{officer.email}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-gray-100 rounded">
                      <svg className="h-3.5 w-3.5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-800 font-medium">{officer.phoneNumber}</span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="mt-3 flex space-x-2">
                  <Button 
                    className="flex-1 bg-secondary-200 text-xs"
                    onClick={() => window.open(`mailto:${officer.email}?subject=Customer Inquiry - ${customer.customerID}`, '_blank')}
                  >
                    Email
                  </Button>
                  <Button 
                    className="flex-1 bg-gray-200 text-gray-700 text-xs"
                    onClick={() => window.open(`tel:${officer.phoneNumber}`, '_self')}
                  >
                    Call
                  </Button>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
          

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              
              {/* Main Content */}
              <div className="xl:col-span-3 space-y-4 sm:space-y-6">
                <CustomerOverview customerData={customerData} />
                <LoanStatus customerData={customerData} />
                <RecentTransactions customerData={customerData} />
              </div>

              {/* Right Column - Account Info (Desktop Only) */}
              <div className="hidden xl:block space-y-6">
                {/* Virtual Account Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Virtual Bank Account</h3>
                  <div className="space-y-4">
                    {/* Account Number */}
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <p className="text-xs text-gray-600 mb-1">Account Number</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-mono font-semibold text-gray-900">
                          0123456789
                        </span>
                        <button
                          onClick={() => handleCopyAccount('0123456789')}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                          title="Copy account number"
                        >
                          {copiedAccount ? (
                            <CheckIcon className="h-5 w-5 text-success-500" />
                          ) : (
                            <ClipboardDocumentIcon className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    {/* Bank Name */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Bank</span>
                      <span className="text-sm font-medium text-gray-900">Wema Bank</span>
                    </div>
                    
                    {/* Account Name */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Account Name</span>
                      <span className="text-sm font-medium text-gray-900">
                        {customer.firstName} {customer.lastName}
                      </span>
                    </div>
                  </div>
                  
                  {/* Info Note */}
                  <div className="mt-4 p-3 bg-amber-50 rounded-md border border-amber-200">
                    <p className="text-xs text-amber-800">
                      Use this account for loan repayments only. Funds will be automatically applied to your loan.
                    </p>
                  </div>
                </div>

                {/* Account Officer Card */}
                {officer && (
                  <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
                    <h3 className="text-base font-semibold text-gray-900 mb-3">Your Account Officer</h3>
                    
                    {/* Officer Info */}
                    <div className="bg-gradient-to-r from-secondary-50 to-secondary-100 rounded-lg p-3 mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center shadow-sm">
                            <span className="text-white text-sm font-bold">{getOfficerInitials(officer.fullName)}</span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">{officer.fullName}</h4>
                          <p className="text-xs text-gray-700 font-medium">Account Officer</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Contact Details */}
                    <div className="space-y-2 bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 bg-secondary-100 rounded">
                          <svg className="h-4 w-4 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <a href={`mailto:${officer.email}`} className="text-xs text-gray-800 hover:text-secondary-600 font-medium truncate">
                          {officer.email}
                        </a>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 bg-gray-100 rounded">
                          <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <a href={`tel:${officer.phoneNumber}`} className="text-xs text-gray-800 hover:text-gray-600 font-medium">
                          {officer.phoneNumber}
                        </a>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="mt-3 space-y-2">
                      <Button 
                        className="bg-secondary-200 text-xs py-2"
                        onClick={() => window.open(`mailto:${officer.email}?subject=Customer Inquiry - ${customer.customerID}`, '_blank')}
                      >
                        Send Email
                      </Button>
                      <Button 
                        className="bg-gray-200 text-gray-700 text-xs py-2"
                        onClick={() => window.open(`tel:${officer.phoneNumber}`, '_self')}
                      >
                        Call Now
                      </Button>
                    </div>
                  </div>
                )}
                
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}