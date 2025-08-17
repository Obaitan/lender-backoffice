'use client';

import { columns } from '@/components/customers/details-tables/customer-tables/DebitHistoryColumns';
import { DataTable } from '@/components/customers/details-tables/customer-tables/dataTable';
import { PaystackDdDebitHistory } from '@/types';

export default function DebitHistoryTable({
  record,
}: {
  record: PaystackDdDebitHistory[];
}) {
  return <DataTable columns={columns} data={record} />;
}
