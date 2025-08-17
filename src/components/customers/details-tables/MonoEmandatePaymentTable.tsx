'use client';

import { columns } from '@/components/customers/details-tables/customer-tables/MonoEmandatePaymentColumns';
import { DataTable } from '@/components/customers/details-tables/customer-tables/dataTable';
import { MonoPaymentHistory } from '@/types';

export default function MonoEmandatePaymentTable({
  record,
}: {
  record: MonoPaymentHistory[];
}) {
  return <DataTable<MonoPaymentHistory, unknown> columns={columns} data={record} />;
}