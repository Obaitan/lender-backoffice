'use client';

import { useState, useMemo } from 'react';
import { columns } from './LogsColumns';
import { DataTable, LogData } from './LogsDataTable';
import { PageTab } from '../navigation/PageTab';
import { ExportProvider } from '@/components/table/MultiTableExportButton';

// Define AuditLog interface locally since we're not using the API service
interface AuditLog {
  id: number;
  officer: string;
  email: string;
  ipAddress: string;
  action: string;
  comment: string;
  dateTime: string;
}

export default function AuditLogsClient({
  logsData,
}: {
  logsData: AuditLog[];
}) {
  const [period, setPeriod] = useState<{ from?: Date; to?: Date }>({});

  const formattedLogs: LogData[] = useMemo(
    () =>
      logsData.map((log) => ({
        id: log.id,
        officer: log.officer,
        name: log.officer || 'Unknown User',
        email: log.email,
        role: 'User',
        supervisor: 'N/A',
        ipAddress: log.ipAddress,
        action: log.action,
        comment: log.comment,
        description: log.comment || 'No description available',
        dateTime: log.dateTime,
      })),
    [logsData]
  );

  const filteredLogs = useMemo(() => {
    if (!period.from && !period.to) return formattedLogs;
    return formattedLogs.filter((log) => {
      const logDate = new Date(log.dateTime);
      if (period.from && logDate < period.from) return false;
      if (period.to && logDate > period.to) return false;
      return true;
    });
  }, [formattedLogs, period]);

  const availableTabs = [{ label: 'Audit Logs', url: '/audit-logs' }];

  return (
    <ExportProvider availableTabs={availableTabs}>
      <PageTab
        pageTitle="Audit Logs"
        filter
        appliedRange={period}
        setAppliedRange={setPeriod}
      />

      <div className="2xl:px-2 mt-4">
        <DataTable
          columns={columns}
          data={filteredLogs}
          emptyMessage="No audit logs found. When users perform actions, they will be recorded here."
          columnFileName="LogsColumns"
        />
      </div>
    </ExportProvider>
  );
}
