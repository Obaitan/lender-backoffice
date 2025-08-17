'use client';

import { columns } from '@/components/customers/details-tables/customer-tables/salaryHistoryColumns';
import { InflightSalaryRecord } from '@/types';
import { DataTable } from '@/components/customers/details-tables/customer-tables/dataTable';

export default function SalaryTable({
  record,
}: {
  record: InflightSalaryRecord[];
}) {
  return <DataTable<InflightSalaryRecord, unknown> columns={columns} data={record} />;
}
