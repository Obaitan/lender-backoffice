'use client';

import { columns } from '@/components/customers/details-tables/customer-tables/loanRecordsColumns';
import { InflightLoanRecord } from '@/types';
import { DataTable } from '@/components/customers/details-tables/customer-tables/dataTable';

export default function LoansTable({
  record,
}: {
  record: InflightLoanRecord[];
}) {
  return (
    <DataTable<InflightLoanRecord, unknown> columns={columns} data={record} />
  );
}
