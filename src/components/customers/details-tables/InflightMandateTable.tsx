'use client';

import { columns } from '@/components/customers/details-tables/customer-tables/InflightMandatesColumns';
import { InflightMandate } from '@/types';
import { DataTable } from '@/components/customers/details-tables/customer-tables/dataTable';

export default function InflightMandateTable({
  record,
}: {
  record: InflightMandate[];
}) {
  return (
    <DataTable
      columns={columns}
      data={record}
      columnFileName="InflightMandatesColumns"
    />
  );
}
