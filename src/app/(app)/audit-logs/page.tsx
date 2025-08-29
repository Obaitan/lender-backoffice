import AuditLogsClient from '@/components/logs/AuditLogsClient';
import { dummyAuditLogs } from '@/utils/dummyData';

export default async function AuditLogsPage() {
  // Using dummy data instead of API call
  const logsData = dummyAuditLogs;

  return <AuditLogsClient logsData={logsData} />;
}
