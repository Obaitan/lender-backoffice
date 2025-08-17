'use client';

import { columns } from '@/components/customers/details-tables/customer-tables/WacsMandatesColumns';
import { WacsMandate } from '@/types';
import { DataTable } from '@/components/customers/details-tables/customer-tables/dataTable';

export default function WacsMandateTable({
  record,
}: {
  record: WacsMandate[];
}) {
  return <DataTable<WacsMandate, unknown> columns={columns} data={record} />;
}
