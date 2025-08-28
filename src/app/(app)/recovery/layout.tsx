'use client';

import { ReactNode, useEffect, useState } from 'react';
import TabsWithMetrics from '@/components/navigation/TabsWithMetrics';
import { PeriodFilterContext } from '@/contexts/PeriodFilterContext';
import { ExportProvider } from '@/components/table/MultiTableExportButton';

export default function RecoveryLayout({ children }: { children: ReactNode }) {
  const [tabData, setTabData] = useState({
    overduePaymentsCount: 0,
    recoveredPaymentsCount: 0,
    overdueDifference: 0,
    recoveredDifference: 0,
  });
  // Period filter state
  const [appliedRange, setAppliedRange] = useState<{ from?: Date; to?: Date }>(
    {}
  );

  // Mock data fetching effect
  useEffect(() => {
    // Simulate API call to fetch recovery metrics
    const fetchRecoveryData = () => {
      setTabData({
        overduePaymentsCount: 3,
        recoveredPaymentsCount: 3,
        overdueDifference: 1,
        recoveredDifference: 0,
      });
    };

    fetchRecoveryData();
  }, [appliedRange]);

  const recoveryPageTabs = [
    {
      label: 'Overdue Payments',
      url: 'overdue-payments',
      value: tabData.overduePaymentsCount,
      difference: tabData.overdueDifference,
    },
    {
      label: 'Recovered Payments',
      url: 'recovered-payments',
      value: tabData.recoveredPaymentsCount,
      difference: tabData.recoveredDifference,
    },
   
  ];

  const tabs = [
    {
      label: 'Overdue Payments',
      url: 'overdue-payments',
      value: 0,
      difference: 0,
    },
    {
      label: 'Recovered Payments',
      url: 'recovered-payments',
      value: 0,
      difference: 0,
    },
  ];

  return (
    <PeriodFilterContext.Provider value={{ appliedRange, setAppliedRange }}>
      <ExportProvider availableTabs={tabs}>
        <TabsWithMetrics
          pageTitle="Recovery"
          links={recoveryPageTabs}
          appliedRange={appliedRange}
          setAppliedRange={setAppliedRange}
        />
        <div className="mt-9">{children}</div>
      </ExportProvider>
    </PeriodFilterContext.Provider>
  );
}
