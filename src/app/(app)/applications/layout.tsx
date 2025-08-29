'use client';

import { ReactNode } from 'react';
import TabsWithMetrics from '@/components/navigation/TabsWithMetrics';
import { ExportProvider } from '@/components/table/MultiTableExportButton';

const tabs = [
  {
    label: 'New',
    url: 'new',
    value: 1,
    difference: -1,
  },
  {
    label: 'In-Progress',
    url: 'in-progress',
    value: 1,
    difference: -0.5,
  },
  {
    label: 'Ready To Disburse',
    url: 'ready',
    value: 1,
    difference: -1,
  },
  {
    label: 'Approved',
    url: 'approved',
    value: 1,
    difference: 0,
  },
  {
    label: 'Declined',
    url: 'declined',
    value: 2,
    difference: 1,
  },
];

// Inner component that uses the export context
function ApplicationsLayoutInner({ children }: { children: ReactNode }) {
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
  return (
    <ExportProvider availableTabs={tabs}>
      <ApplicationsLayoutInner>{children}</ApplicationsLayoutInner>
    </ExportProvider>
  );
}
