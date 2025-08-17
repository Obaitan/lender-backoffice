'use client';

import { columns } from '@/components/customers/details-tables/customer-tables/PaystackDdMandateColumns';
import { DataTable } from '@/components/customers/details-tables/customer-tables/dataTable';
import { MonoMandate } from '@/types';

export default function PaystackddMandatesTable({
  record,
}: {
  record: MonoMandate[];
}) {
  return <DataTable<MonoMandate, unknown> columns={columns} data={record} />;
}
