'use client';

import 'react-day-picker/style.css';
import TileLink from './TileLink';
import BarChartComponent from './BarChart';
import PieChartComponent from './PieChart';
import NewCustomers from './NewCustomers';
import Link from 'next/link';
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from 'lucide-react';
import RecentLoans from './RecentLoans';
import RecentRepayments from './RecentRepayments';
import { dummyDashboardData } from '@/utils/customerDummyData';

// Interface for dashboard data
interface DashboardData {
  loanApplicationCount: number;
  totalCustomerRequestCount: number;
  totalRecoveredLoanCount: number;
  totalOutstandingLoansRecovered: number;
  dailyTrends: {
    loanApplicationsToday: number;
    loanApplicationsYesterday: number;
    loanApplicationTrend: number;
    customerRequestsToday: number;
    customerRequestsYesterday: number;
    customerRequestTrend: number;
    recoveredLoansToday: number;
    recoveredLoansYesterday: number;
    recoveredLoanTrend: number;
  };
  totalApplicationsByMonthByYear: {
    month: number;
    year: number;
    count: number;
  }[];
  loanByStatusCounts: {
    status: string;
    count: number;
  }[];
  customerRequestsByType: {
    requestType: string;
    count: number;
  }[];
  totalRequestByMonthByStatus: Array<{
    month: number;
    year: number;
    status: string;
    count: number;
  }>;
  loans: {
    customerID: string;
    customerName: string;
    loanNumber: string;
    createDate: string;
    duration: number;
    amountPaid: number;
    outstandingAmount: number;
    amount?: number;
  }[];
  customers: {
    customerID: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    maritalStatus: string;
    email: string;
    phoneNumber: string;
    rmCode: string;
    createDate: string;
    status: string;
  }[];
  repayments: {
    loanNumber: string;
    principalAmount: number;
    interestAmount: number;
    lateFee: number;
    amountPaid: number;
    outstandingAmount: number;
    createDate: string;
    dueDate: string;
    repaymentChannel: string;
    repaymentDate: string;
    repaymentNumber: string;
  }[];
}

const AdminDashboard = () => {
  const dashboardData: DashboardData = dummyDashboardData;
  // Transform totalApplicationsByMonthByYear data for the bar chart
  const transformApplicationsData = () => {
    const rawData = dashboardData.totalApplicationsByMonthByYear || [];
    const statusData = dashboardData.loanByStatusCounts || [];

    // Create a map to store data by month/year
    const groupedData = new Map<
      string,
      {
        month: number;
        year: number;
        approved: number;
        declined: number;
        inProgress: number;
      }
    >();

    // First, create entries for each month/year with total counts
    rawData.forEach((item) => {
      const key = `${item.year}-${item.month}`;
      if (!groupedData.has(key)) {
        groupedData.set(key, {
          month: item.month,
          year: item.year,
          approved: 0,
          declined: 0,
          inProgress: 0,
        });
      }
    });

    // Then distribute the status counts proportionally across the months
    // This is an approximation since we don't have status breakdown by month
    const totalCount = rawData.reduce((sum, item) => sum + item.count, 0);
    const statusDistribution = {
      approved:
        statusData.find((s) => s.status.toLowerCase() === 'approved')?.count ||
        0,
      declined:
        statusData.find((s) => s.status.toLowerCase() === 'declined')?.count ||
        0,
      inProgress:
        statusData.find((s) => s.status.toLowerCase() === 'inprogress')
          ?.count || 0,
    };

    // Distribute status counts proportionally
    rawData.forEach((item) => {
      const key = `${item.year}-${item.month}`;
      const data = groupedData.get(key)!;
      const monthProportion = totalCount > 0 ? item.count / totalCount : 0;

      data.approved = Math.round(statusDistribution.approved * monthProportion);
      data.declined = Math.round(statusDistribution.declined * monthProportion);
      data.inProgress = Math.round(
        statusDistribution.inProgress * monthProportion
      );
    });

    // Sort and return the data
    const sortedData = Array.from(groupedData.values()).sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });

    return sortedData.length > 0
      ? sortedData
      : [
          // Fallback data if no data available
          {
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            approved: 0,
            declined: 0,
            inProgress: 0,
          },
        ];
  };

  const transformedApplicationsData = transformApplicationsData();

  // Get the most recent customers (up to 3)
  const recentCustomers = [...(dashboardData.customers || [])]
    .sort(
      (a, b) =>
        new Date(b.createDate).getTime() - new Date(a.createDate).getTime()
    )
    .slice(0, 3);

  // Get the most recent loans (up to 3)
  const recentLoans = [...(dashboardData.loans || [])]
    .sort(
      (a, b) =>
        new Date(b.createDate).getTime() - new Date(a.createDate).getTime()
    )
    .slice(0, 3)
    .map((loan) => {
      // Calculate loan amount from repayments data
      const loanRepayments = dashboardData.repayments.filter(
        (r) => r.loanNumber === loan.loanNumber
      );
      const totalLoanAmount =
        loanRepayments.length > 0
          ? loanRepayments.reduce((sum, r) => sum + r.principalAmount, 0)
          : 300000; // Fallback amount

      return {
        ...loan,
        firstName: loan.customerName.split(' ')[0] || '',
        lastName: loan.customerName.split(' ').slice(1).join(' ') || '',
        signUpTime: loan.createDate,
        amount: totalLoanAmount,
      };
    });

  // Get the most recent repayments (up to 3)
  const recentRepayments = [...(dashboardData.repayments || [])]
    .filter((repayment) => repayment.amountPaid > 0) // Only show actual repayments
    .sort((a, b) => {
      // Sort by repayment date if available, otherwise by create date
      const dateA =
        a.repaymentDate && a.repaymentDate !== a.dueDate
          ? new Date(a.repaymentDate)
          : new Date(a.createDate);
      const dateB =
        b.repaymentDate && b.repaymentDate !== b.dueDate
          ? new Date(b.repaymentDate)
          : new Date(b.createDate);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 3)
    .map((repayment) => {
      // Find the loan to get customer info
      const loan = dashboardData.loans.find(
        (l) => l.loanNumber === repayment.loanNumber
      );
      const customerName = loan?.customerName || 'Unknown Customer';

      return {
        firstName: customerName.split(' ')[0] || '',
        lastName: customerName.split(' ').slice(1).join(' ') || '',
        customerID: loan?.customerID || 'N/A',
        repayment: repayment.amountPaid,
        repaymentChannel: repayment.repaymentChannel || 'N/A',
        signUpTime:
          repayment.repaymentDate &&
          repayment.repaymentDate !== repayment.dueDate
            ? repayment.repaymentDate
            : repayment.createDate,
      };
    });

  // Calculate percentage changes from dailyTrends
  const calculatePercentageChange = (
    today: number,
    yesterday: number
  ): number => {
    if (yesterday === 0) return today > 0 ? 100 : 0;
    return ((today - yesterday) / yesterday) * 100;
  };

  // Calculate customer growth percentage (approximation based on recent customers)
  const recentCustomerGrowth = () => {
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const todayCustomers = dashboardData.customers.filter(
      (c) => new Date(c.createDate).toDateString() === today.toDateString()
    ).length;
    const yesterdayCustomers = dashboardData.customers.filter(
      (c) => new Date(c.createDate).toDateString() === yesterday.toDateString()
    ).length;
    return { today: todayCustomers, yesterday: yesterdayCustomers };
  };

  const customerGrowth = recentCustomerGrowth();
  const customerPercentageChange = calculatePercentageChange(
    customerGrowth.today,
    customerGrowth.yesterday
  );

  // Summary data using actual API response
  const info = {
    customer: dashboardData.customers?.length || 0,
    customerDiff: customerGrowth.today - customerGrowth.yesterday,
    customerPercentageChange: Math.abs(customerPercentageChange),
    loans: dashboardData.loans?.length || 0,
    loansDiff:
      dashboardData.dailyTrends.loanApplicationsToday -
      dashboardData.dailyTrends.loanApplicationsYesterday,
    loansPercentageChange: Math.abs(
      dashboardData.dailyTrends.loanApplicationTrend
    ),
    repayments: dashboardData.totalRecoveredLoanCount || 0,
    repaymentsDiff:
      dashboardData.dailyTrends.recoveredLoansToday -
      dashboardData.dailyTrends.recoveredLoansYesterday,
    repaymentsPercentageChange: Math.abs(
      dashboardData.dailyTrends.recoveredLoanTrend
    ),
  };

  const summary = [
    {
      label: 'Applications',
      href: '/applications',
      icon: '/icons/open.svg',
      count: dashboardData.loanApplicationCount || 0,
      countDiff:
        dashboardData.dailyTrends.loanApplicationsToday -
        dashboardData.dailyTrends.loanApplicationsYesterday,
      percentageDiff: Math.abs(dashboardData.dailyTrends.loanApplicationTrend),
    },
    {
      label: 'Loans',
      href: '/loans',
      icon: '/icons/restructure.svg',
      count: dashboardData.loans?.length || 0,
      countDiff: info.loansDiff,
      percentageDiff: info.loansPercentageChange,
    },
    {
      label: 'Customers',
      href: '/customers',
      icon: '/icons/recovery.svg',
      count: dashboardData.customers?.length || 0,
      countDiff: info.customerDiff,
      percentageDiff: info.customerPercentageChange,
    },
    {
      label: 'Requests',
      href: '/requests',
      icon: '/icons/update.svg',
      count: dashboardData.totalCustomerRequestCount || 0,
      countDiff:
        dashboardData.dailyTrends.customerRequestsToday -
        dashboardData.dailyTrends.customerRequestsYesterday,
      percentageDiff: Math.abs(dashboardData.dailyTrends.customerRequestTrend),
    },
  ];

  return (
    <div className="pr-4">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 mt-3">
        {summary.map((item) => (
          <TileLink
            key={item.label}
            href={item.href}
            icon={item.icon}
            label={item.label}
            count={item.count}
            countDiff={item.countDiff}
            percentageDiff={item.percentageDiff}
          />
        ))}
      </div>
      <hr className="mt-9 mb-7 border-gray-100" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10">
        <div className="md:col-span-2 lg:pr-10">
          <BarChartComponent customData={transformedApplicationsData} />
        </div>
        <div className="mx-auto">
          <PieChartComponent
            customData={dashboardData.customerRequestsByType}
          />
        </div>
      </div>
      <hr className="my-7 border-gray-100" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
        <Link href={'/customers'}>
          <div className="flex flex-col border border-gray-50 py-5 px-4 shadow-sm rounded-lg col-span-full">
            <div className="bg-white flex gap-3 justify-between mb-6 transition-all duration-500 px-1">
              <p className="text-secondary-200 font-medium">New Customers</p>
              <div className="flex items-center gap-1.5">
                <p className="text-primary-200 font-semibold">
                  {info?.customer
                    ? info.customer.toLocaleString('en-US')
                    : 'No Data'}
                </p>
                <div
                  className={`flex items-center text-xs ${
                    info?.customerDiff > 0
                      ? 'text-success-500'
                      : info?.customerDiff === 0
                      ? 'text-gray-600'
                      : 'text-error-300'
                  }`}
                >
                  {info?.customerDiff > 0 ? (
                    <ArrowUpIcon className="w-4 h-4" />
                  ) : info?.customerDiff === 0 ? (
                    <ArrowUpDownIcon className="w-4 h-4" />
                  ) : (
                    <ArrowDownIcon className="w-4 h-4" />
                  )}
                  <span>
                    {info?.customerPercentageChange.toLocaleString('en-US', {
                      maximumFractionDigits: 0,
                    })}
                    %
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {recentCustomers.map((customer) => (
                <NewCustomers
                  key={customer.customerID}
                  profilePix=""
                  firstName={customer.firstName}
                  lastName={customer.lastName}
                  customerID={customer.customerID}
                  signUpTime={customer.createDate}
                />
              ))}
            </div>
          </div>
        </Link>

        <Link href={'/loans'}>
          <div className="flex flex-col border border-gray-50 py-5 px-4 shadow-sm rounded-lg col-span-full">
            <div className="bg-white flex gap-3 justify-between mb-6 transition-all duration-500 px-1">
              <p className="text-secondary-200 font-medium">Recent Loans</p>
              <div className="flex items-center gap-1.5">
                <p className="text-primary-200 font-semibold">
                  {info?.loans ? info.loans.toLocaleString('en-US') : 'No Data'}
                </p>
                <div
                  className={`flex items-center text-xs ${
                    info?.loansDiff > 0
                      ? 'text-success-500'
                      : info?.loansDiff === 0
                      ? 'text-gray-600'
                      : 'text-error-300'
                  }`}
                >
                  {info?.loansDiff > 0 ? (
                    <ArrowUpIcon className="w-4 h-4" />
                  ) : info?.loansDiff === 0 ? (
                    <ArrowUpDownIcon className="w-4 h-4" />
                  ) : (
                    <ArrowDownIcon className="w-4 h-4" />
                  )}
                  <span>
                    {info?.loansPercentageChange.toLocaleString('en-US', {
                      maximumFractionDigits: 0,
                    })}
                    %
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {recentLoans.map((loan) => (
                <RecentLoans
                  key={loan.customerID + loan.loanNumber}
                  firstName={loan.firstName}
                  lastName={loan.lastName}
                  customerID={loan.customerID}
                  amount={loan.amount || 300000}
                  signUpTime={loan.createDate}
                />
              ))}
            </div>
          </div>
        </Link>

        <Link href={'/repayments'}>
          <div className="flex flex-col border border-gray-50 py-5 px-4 shadow-sm rounded-lg col-span-full">
            <div className="bg-white flex gap-3 justify-between mb-6 transition-all duration-500 px-1">
              <p className="text-secondary-200 font-medium">
                Recent Repayments
              </p>
              <div className="flex items-center gap-1.5">
                <p className="text-primary-200 font-semibold">
                  {info?.repayments
                    ? info.repayments.toLocaleString('en-US')
                    : 'No Data'}
                </p>
                <div
                  className={`flex items-center text-xs ${
                    info?.repaymentsDiff > 0
                      ? 'text-success-500'
                      : info?.repaymentsDiff === 0
                      ? 'text-gray-600'
                      : 'text-error-300'
                  }`}
                >
                  {info?.repaymentsDiff > 0 ? (
                    <ArrowUpIcon className="w-4 h-4" />
                  ) : info?.repaymentsDiff === 0 ? (
                    <ArrowUpDownIcon className="w-4 h-4" />
                  ) : (
                    <ArrowDownIcon className="w-4 h-4" />
                  )}
                  <span>
                    {info?.repaymentsPercentageChange.toLocaleString('en-US', {
                      maximumFractionDigits: 0,
                    })}
                    %
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {recentRepayments.map((repayment, index) => (
                <RecentRepayments
                  key={`${repayment.customerID}-${index}`}
                  firstName={repayment.firstName}
                  lastName={repayment.lastName}
                  customerID={repayment.customerID}
                  repayment={repayment.repayment}
                  repaymentChannel={repayment.repaymentChannel}
                  signUpTime={repayment.signUpTime}
                />
              ))}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
