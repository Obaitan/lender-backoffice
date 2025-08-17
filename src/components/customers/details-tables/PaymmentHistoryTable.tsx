'use client';

import { columns } from '@/components/customers/details-tables/customer-tables/PaymentsHistoryColumns';
import { DataTable } from '@/components/customers/details-tables/customer-tables/dataTable';
import { MonoPaymentHistory } from '@/types';

export default function MonoPaymentTable({
  record,
}: {
  record: MonoPaymentHistory[];
}) {
  return (
    <DataTable<MonoPaymentHistory, unknown> columns={columns} data={record} />
  );
}
