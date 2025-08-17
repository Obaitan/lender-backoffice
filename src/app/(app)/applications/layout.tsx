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
  dummyInactiveCustomers,
  getDummyApplicationsByStatus,
} from '@/utils/dummyData';

// Inner component that uses the export context
function ApplicationsLayoutInner({ children }: { children: ReactNode }) {
  const { registerTable } = useExportContext();

  const [tabCounts, setTabCounts] = useState({
    incompleteSignups: 0,
    readyToDisburse: 0,
    inProgress: 0,
    newApplications: 0,
    approved: 0,
    declined: 0,
  });

  const [tabTrends, setTabTrends] = useState({
    incompleteSignups: 0,
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
      console.log('🔄 Registering dummy tables data for export...');

      // Register incomplete signups table
      if (dummyInactiveCustomers.length > 0) {
        registerTable({
          tableName: 'IncomepleteSignUpColumns',
          allData: dummyInactiveCustomers as unknown as Record<
            string,
            unknown
          >[],
          selectedData: [],
          selectedCount: 0,
          allCount: dummyInactiveCustomers.length,
        });
        console.log(
          `✅ Registered Incomplete Signups table with ${dummyInactiveCustomers.length} rows`
        );
      }

      // Register application tables by status
      const statuses = [
        { status: 'New', tableName: 'NewApplicationsColumns' },
        { status: 'ReadyToDisburse', tableName: 'ReadyToDisburseColumns' },
        { status: 'InProgress', tableName: 'InProgressColumns' },
        { status: 'Approved', tableName: 'ApprovedColumns' },
        { status: 'Declined', tableName: 'DeclinedColumns' },
        { status: 'Dropped', tableName: 'DroppedColumns' },
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
          console.log(`✅ Registered ${status} table with ${data.length} rows`);
        }
      });

      console.log('🎉 All dummy tables data registered successfully');
    };

    registerDummyTablesData();
  }, []);

  const tabs = [
    {
      label: 'Incomplete Sign Ups',
      url: 'incomplete-signups',
      value: tabCounts.incompleteSignups,
      difference: tabTrends.incompleteSignups,
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
      label: 'Ready To Disburse',
      url: 'ready',
      value: tabCounts.readyToDisburse,
      difference: tabTrends.readyToDisburse,
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
      label: 'Incomplete Sign Ups',
      url: 'incomplete-signups',
      value: 0,
      difference: 0,
    },
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
