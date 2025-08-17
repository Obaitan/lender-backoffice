'use client';

import { useState, useEffect } from 'react';
import { AuthService, API_CONFIG } from '@/services/authService';
import { 
  CreditCardIcon, 
  BanknotesIcon, 
  CalendarDaysIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { Loader2, Bell } from 'lucide-react';
import { 
  getUserNotifications, 
  type UserNotification 
} from '@/services/apiQueries/notificationsApi';

interface CustomerOverviewProps {
  customerData: {
    customers: {
      id: number;
      customerID: string;
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
    };
    customerFinancialData?: Record<string, unknown>;
  };
}

export default function CustomerOverview({ customerData }: CustomerOverviewProps) {
  const [loanSummary, setLoanSummary] = useState<{
    totalLoans?: number;
    outstandingBalance?: number;
    nextPaymentDate?: string;
  } | null>(null);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);
  const [greeting, setGreeting] = useState('Hello'); // Default neutral greeting
  const customer = customerData.customers;

  useEffect(() => {
    const fetchLoanSummary = async () => {
      try {
        // Try with auth token first, fallback without
        let response;
        try {
          const token = await AuthService.getValidToken();
          response = await fetch(
            `${API_CONFIG.baseUrl}/api/V2/Loan/getCustomerLoanSummary?customerID=${customer.customerID}`,
            {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
        } catch {
          // If auth fails, try without token
          response = await fetch(
            `${API_CONFIG.baseUrl}/api/V2/Loan/getCustomerLoanSummary?customerID=${customer.customerID}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
        }

        if (response.ok) {
          const data = await response.json();
          setLoanSummary(data);
        }
      } catch (error) {
        console.error('Error fetching loan summary:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoanSummary();
  }, [customer.customerID]);

  // Fetch customer notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!customer.email) return;
      
      try {
        setIsLoadingNotifications(true);
        
        // Try to fetch notifications using customer email
        // First attempt with auth token (if customer is also an admin user)
        let response;
        try {
          response = await getUserNotifications(customer.email, 1, 5); // Get latest 5 notifications
        } catch {
          // If auth fails, try without token - but this might not work for customer notifications
          console.log('Auth failed for notifications, customer may not have admin access');
          setNotifications([]);
          setUnreadCount(0);
          return;
        }

        setNotifications(response.data);
        const unread = response.data.filter(n => !n.read).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error('Error fetching customer notifications:', error);
        setNotifications([]);
        setUnreadCount(0);
      } finally {
        setIsLoadingNotifications(false);
      }
    };

    fetchNotifications();
  }, [customer.email]);

   useEffect(() => {
    // Set greeting based on current time (client-side only)
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) setGreeting('Good morning');
      else if (hour < 17) setGreeting('Good afternoon');
      else setGreeting('Good evening');
    };

    updateGreeting();
    const greetingTimer = setInterval(updateGreeting, 60000); // Update every minute

    return () => {
      clearInterval(greetingTimer);
    };
  }, []);


  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Account Overview</h2>
      </div>

        {/* Welcome Section */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {greeting}, {customer.firstName}!
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Welcome to your personal dashboard. Manage your loans and account details here.
              </p>
            </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
        {/* Total Loans */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3 sm:p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CreditCardIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-blue-800">Total Loans</p>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-blue-600 mt-1" />
              ) : (
                <p className="text-xl sm:text-2xl font-bold text-blue-900">
                  {loanSummary?.totalLoans || 0}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Outstanding Balance */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-3 sm:p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BanknotesIcon className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-orange-800">Outstanding</p>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-orange-600 mt-1" />
              ) : (
                <p className="text-lg sm:text-2xl font-bold text-orange-900">
                  ₦{(loanSummary?.outstandingBalance || 0).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Next Payment */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-3 sm:p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CalendarDaysIcon className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-green-800">Next Payment</p>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-green-600 mt-1" />
              ) : (
                <p className="text-base sm:text-lg font-bold text-green-900">
                  {loanSummary?.nextPaymentDate 
                    ? new Date(loanSummary.nextPaymentDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })
                    : 'N/A'
                  }
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="border-t border-gray-100 pt-4 sm:pt-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg font-medium text-gray-900">Recent Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-secondary-100 text-secondary-700 text-xs px-2 py-1 rounded-full font-medium">
              {unreadCount} new
            </span>
          )}
        </div>
        
        {isLoadingNotifications ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            <span className="ml-2 text-sm text-gray-500">Loading notifications...</span>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-6">
            <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm text-gray-500">No recent notifications</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.slice(0, 3).map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg border transition-colors ${
                  !notification.read 
                    ? 'bg-secondary-25 border-secondary-100' 
                    : 'bg-gray-50 border-gray-100'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      !notification.read
                        ? 'bg-secondary-100 text-secondary-600'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    <BellIcon className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`text-sm font-medium truncate ${
                        !notification.read ? 'text-gray-900' : 'text-gray-700'
                      }`}
                    >
                      {notification.subject}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {notification.content}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400">
                        From: {notification.from}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(notification.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {notifications.length > 3 && (
              <div className="text-center pt-2">
                <button className="text-sm text-secondary-600 hover:text-secondary-700 font-medium">
                  View all notifications ({notifications.length})
                </button>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}