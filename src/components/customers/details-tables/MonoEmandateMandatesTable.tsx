'use client';

import { columns } from '@/components/customers/details-tables/customer-tables/MonoEmandateMandatesColumns';
import { DataTable } from '@/components/customers/details-tables/customer-tables/dataTable';
import { MonoMandate } from '@/types';

export default function MonoEmandateMandatesTable({
  record,
}: {
  record: MonoMandate[];
}) {
  return <DataTable<MonoMandate, unknown> columns={columns} data={record} />;
}