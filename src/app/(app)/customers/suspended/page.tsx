import { columns } from '@/components/customers/main/activeColumns';
import { DataTable } from '@/components/customers/main/activeDataTable';
import { getDummySuspendedCustomers } from '@/utils/customerDummyData';

export default function SuspendedCustomersPage() {
  const customers = getDummySuspendedCustomers();
  return (
    <div className="2xl:px-2 mt-8">
      <DataTable
        columns={columns}
        data={customers}
        columnFileName="SuspendedCustomersColumns"
        emptyMessage="No suspended customers found."
      />
    </div>
  );
}
