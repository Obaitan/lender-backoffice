import { columns } from '@/components/customers/main/activeColumns';
import { DataTable } from '@/components/customers/main/activeDataTable';
import { getDummyActiveCustomers } from '@/utils/customerDummyData';

export default function ActiveCustomersPage() {
  const customers = getDummyActiveCustomers();
  return (
    <div className="2xl:px-2 mt-8">
      <DataTable
        columns={columns}
        data={customers}
        columnFileName="ActiveCustomersColumns"
        emptyMessage="No active customers found."
      />
    </div>
  );
}
