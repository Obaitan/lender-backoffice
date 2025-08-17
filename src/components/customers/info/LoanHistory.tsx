import { columns } from '@/components/customers/details-tables/customer-tables/loanColumns';
import { DataTable } from '@/components/customers/details-tables/customer-tables/loanDataTable';
import { Loan } from '@/types';

export default async function LoanHistory({
  loanRecord,
}: {
  loanRecord: Loan[] | null;
}) {
  return (
    <>
      {loanRecord && (
        <DataTable<Loan, unknown> columns={columns} data={loanRecord} />
      )}
    </>
  );
}
