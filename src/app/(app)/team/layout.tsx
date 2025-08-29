'use client';

import { ReactNode, useState } from 'react';
import { PageTab } from '@/components/navigation/PageTab';
import { ExportProvider } from '@/components/table/MultiTableExportButton';
import { PeriodFilterContext } from '@/contexts/PeriodFilterContext';

const teamPageTabs = [
  { label: 'Team Members', url: 'members' },
  { label: 'Roles', url: 'roles' },
];

function TeamLayoutInner({ children }: { children: ReactNode }) {
  const [appliedRange, setAppliedRange] = useState<{ from?: Date; to?: Date }>(
    {}
  );

  return (
    <PeriodFilterContext.Provider value={{ appliedRange, setAppliedRange }}>
      <PageTab pageTitle="Team" tabs={teamPageTabs} />
      <div className="mt-8">{children}</div>
    </PeriodFilterContext.Provider>
  );
}

export default function TeamLayout({ children }: { children: ReactNode }) {
  return (
    <ExportProvider availableTabs={teamPageTabs}>
      <TeamLayoutInner>{children}</TeamLayoutInner>
    </ExportProvider>
  );
}
