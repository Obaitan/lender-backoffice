'use client';

import { ReactNode, useState } from 'react';
import { PeriodFilterContext } from '@/contexts/PeriodFilterContext';
import TabsWithMetrics from '@/components/navigation/TabsWithMetrics';
import { ExportProvider } from '@/components/table/MultiTableExportButton';

const tabs = [
  {
    label: 'Active',
    url: 'active',
    value: 5,
    difference: -1,
  },
  {
    label: 'Overdue',
    url: 'overdue',
    value: 3,
    difference: 1,
  },
  {
    label: 'Paid Off',
    url: 'paid-off',
    value: 3,
    difference: 0.5,
  },
];

// Inner component that uses both contexts
function LoansLayoutInner({ children }: { children: ReactNode }) {
  const [appliedRange, setAppliedRange] = useState<{ from?: Date; to?: Date }>(
    {}
  );

  return (
    <PeriodFilterContext.Provider value={{ appliedRange, setAppliedRange }}>
      <TabsWithMetrics
        pageTitle="Loans"
        links={tabs}
        filter={true}
        appliedRange={appliedRange}
        setAppliedRange={setAppliedRange}
      />
      <div className="mt-8">{children}</div>
    </PeriodFilterContext.Provider>
  );
}

// Main layout component that provides the export context
export default function LoansLayout({ children }: { children: ReactNode }) {
  return (
    <ExportProvider availableTabs={tabs}>
      <LoansLayoutInner>{children}</LoansLayoutInner>
    </ExportProvider>
  );
}