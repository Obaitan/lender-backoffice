import { DataTable } from '@/components/applications/others/applicationDataTable';
import { columns } from '@/components/applications/others/incompletSignupColumns';
import { dummyInactiveCustomers } from '@/utils/dummyData';

export default function IncompleteSignupsPage() {
  const customers = dummyInactiveCustomers; // Use inactive customers for incomplete signups
  return (
    <div className="2xl:px-2">
      <DataTable
        columns={columns}
        data={customers} // ✅ Now correctly using customers data
        columnFileName="IncomepleteSignUpColumns"
        emptyMessage="No incomplete sign up records found."
      />
    </div>
  );
}
