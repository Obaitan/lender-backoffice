'use client';

import { ReactNode, useEffect, useState } from 'react';
import TabsWithMetrics from '@/components/navigation/TabsWithMetrics';
import {
  ExportProvider,
  useExportContext,
} from '@/components/table/MultiTableExportButton';
import {
  dummyTabCounts,
  dummyTabTrends,
  getDummyApplicationsByStatus,
} from '@/utils/dummyData';

// Inner component that uses the export context
function ApplicationsLayoutInner({ children }: { children: ReactNode }) {
  const { registerTable } = useExportContext();

  const [tabCounts, setTabCounts] = useState({
    readyToDisburse: 0,
    inProgress: 0,
    newApplications: 0,
    approved: 0,
    declined: 0,
  });

  const [tabTrends, setTabTrends] = useState({
    readyToDisburse: 0,
    inProgress: 0,
    newApplications: 0,
    approved: 0,
    declined: 0,
  });

  useEffect(() => {
    // Use dummy data instead of API calls
    setTabCounts(dummyTabCounts);
    setTabTrends(dummyTabTrends);
  }, []);

  // Register dummy data for export functionality
  useEffect(() => {
    const registerDummyTablesData = () => {
      // Register application tables by status
      const statuses = [
        { status: 'New', tableName: 'NewApplicationsColumns' },
        { status: 'ReadyToDisburse', tableName: 'ReadyToDisburseColumns' },
        { status: 'InProgress', tableName: 'InProgressColumns' },
        { status: 'Approved', tableName: 'ApprovedColumns' },
        { status: 'Declined', tableName: 'DeclinedColumns' },
      ];

      statuses.forEach(({ status, tableName }) => {
        const data = getDummyApplicationsByStatus(status);
        if (data.length > 0) {
          registerTable({
            tableName,
            allData: data as unknown as Record<string, unknown>[],
            selectedData: [],
            selectedCount: 0,
            allCount: data.length,
          });
        }
      });
    };

    registerDummyTablesData();
  }, [registerTable]); // ✅ Added dependency array with registerTable

  const tabs = [
    {
      label: 'Ready To Disburse',
      url: 'ready',
      value: tabCounts.readyToDisburse,
      difference: tabTrends.readyToDisburse,
    },
    {
      label: 'New',
      url: 'new',
      value: tabCounts.newApplications,
      difference: tabTrends.newApplications,
    },
    {
      label: 'In-Progress',
      url: 'in-progress',
      value: tabCounts.inProgress,
      difference: tabTrends.inProgress,
    },
    {
      label: 'Approved',
      url: 'approved',
      value: tabCounts.approved,
      difference: tabTrends.approved,
    },
    {
      label: 'Declined',
      url: 'declined',
      value: tabCounts.declined,
      difference: tabTrends.declined,
    },
  ];

  return (
    <>
      <TabsWithMetrics pageTitle="Applications" links={tabs} filter={false} />
      <div className="mt-8">{children}</div>
    </>
  );
}

// Main layout component that provides the export context
export default function ApplicationsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const tabs = [
    {
      label: 'New',
      url: 'new',
      value: 0,
      difference: 0,
    },
    {
      label: 'In-Progress',
      url: 'in-progress',
      value: 0,
      difference: 0,
    },
    {
      label: 'Ready To Disburse',
      url: 'ready',
      value: 0,
      difference: 0,
    },
    {
      label: 'Approved',
      url: 'approved',
      value: 0,
      difference: 0,
    },
    {
      label: 'Declined',
      url: 'declined',
      value: 0,
      difference: 0,
    },
  ];

  return (
    <ExportProvider availableTabs={tabs}>
      <ApplicationsLayoutInner>{children}</ApplicationsLayoutInner>
    </ExportProvider>
  );
}
