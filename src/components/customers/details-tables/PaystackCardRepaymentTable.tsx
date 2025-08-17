'use client';

import { columns } from '@/components/customers/details-tables/customer-tables/PaystackCardRepaymentColumns';
import { DataTable } from '@/components/customers/details-tables/customer-tables/dataTable';
import { PaystackCardRepayment } from '@/types';

export default function PaystackCardRepaymentTable({
  record,
}: {
  record: PaystackCardRepayment[];
}) {
  return <DataTable<PaystackCardRepayment, unknown> columns={columns} data={record} />;
}
