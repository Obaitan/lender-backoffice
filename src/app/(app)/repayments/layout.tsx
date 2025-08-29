'use client';

import { ReactNode, useState, useEffect } from 'react';
import TabsWithMetrics from '@/components/navigation/TabsWithMetrics';
import {
  ExportProvider,
  useExportContext,
} from '@/components/table/MultiTableExportButton';
import { PeriodFilterContext } from '@/contexts/PeriodFilterContext';

const tabs = [
  {
    label: 'Expected Repayments',
    url: 'expected',
    value: 2,
    difference: 0.5,
  },
  {
    label: 'All',
    url: 'all',
    value: 3,
    difference: 1,
  },
  {
    label: 'Inflight',
    url: 'inflight',
    value: 2,
    difference: 1,
  },
  {
    label: 'Paystack DD',
    url: 'paystack-dd',
    value: 0,
    difference: 0,
  },
  {
    label: 'Paystack Card',
    url: 'paystack-card',
    value: 0,
    difference: 0,
  },
  {
    label: 'Virtual Account',
    url: 'virtual-account',
    value: 2,
    difference: 0,
  },
];

// Inner component that uses the export context
function RepaymentsLayoutInner({ children }: { children: ReactNode }) {
  const [appliedRange, setAppliedRange] = useState<{ from?: Date; to?: Date }>(
    {}
  );

  return (
    <PeriodFilterContext.Provider value={{ appliedRange, setAppliedRange }}>
      <TabsWithMetrics
        pageTitle="Repayments"
        links={tabs}
        filter
        appliedRange={appliedRange}
        setAppliedRange={setAppliedRange}
      />
      <div className="mt-8">{children}</div>
    </PeriodFilterContext.Provider>
  );
}

// Main layout component that provides the export context
export default function RepaymentsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ExportProvider availableTabs={tabs}>
      <RepaymentsLayoutInner>{children}</RepaymentsLayoutInner>
    </ExportProvider>
  );
}
