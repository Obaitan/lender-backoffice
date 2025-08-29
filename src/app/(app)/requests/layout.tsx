'use client';

import { ReactNode, useState, useEffect } from 'react';
import TabsWithMetrics from '@/components/navigation/TabsWithMetrics';
import { ExportProvider } from '@/components/table/MultiTableExportButton';
import { PeriodFilterContext } from '@/contexts/PeriodFilterContext';

// Inner component that uses the export context
function RequestsLayoutInner({ children }: { children: ReactNode }) {
  const [appliedRange, setAppliedRange] = useState<{ from?: Date; to?: Date }>(
    {}
  );

  // Mock data for request counts and trends
  const [requestCounts, setRequestCounts] = useState({
    topUp: 0,
    customerIssues: 0,
    accountStatement: 0,
  });

  const [requestTrends, setRequestTrends] = useState({
    topUp: 0,
    customerIssues: 0,
    accountStatement: 0,
  });

  useEffect(() => {
    // Simulate fetching request metrics data
    // In a real app, this would be API calls
    setRequestCounts({
      topUp: 3,
      customerIssues: 3,
      accountStatement: 3,
    });
    setRequestTrends({
      topUp: 2,
      customerIssues: -2,
      accountStatement: 1,
    });
  }, [appliedRange]);

  const requestsPageTabs = [
    {
      label: 'Top Up',
      url: 'top-up',
      value: requestCounts.topUp,
      difference: requestTrends.topUp,
    },
    {
      label: 'Customer Issues',
      url: 'customer-issues',
      value: requestCounts.customerIssues,
      difference: requestTrends.customerIssues,
    },
    {
      label: 'Account Statement',
      url: 'account-statement',
      value: requestCounts.accountStatement,
      difference: requestTrends.accountStatement,
    },
  ];

  return (
    <PeriodFilterContext.Provider value={{ appliedRange, setAppliedRange }}>
      <TabsWithMetrics
        pageTitle="Requests"
        links={requestsPageTabs}
        filter
        appliedRange={appliedRange}
        setAppliedRange={setAppliedRange}
      />
      <div className="mt-8">{children}</div>
    </PeriodFilterContext.Provider>
  );
}

// Main layout component that provides the export context
export default function RequestsLayout({ children }: { children: ReactNode }) {
  const tabs = [
    {
      label: 'Top Up',
      url: 'top-up',
      value: 0,
      difference: 0,
    },
    {
      label: 'Account Statement',
      url: 'account-statement',
      value: 0,
      difference: 0,
    },
    {
      label: 'Customer Issues',
      url: 'customer-issues',
      value: 0,
      difference: 0,
    },
  ];

  return (
    <ExportProvider availableTabs={tabs}>
      <RequestsLayoutInner>{children}</RequestsLayoutInner>
    </ExportProvider>
  );
}
