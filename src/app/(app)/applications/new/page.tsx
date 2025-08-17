import { DataTable } from '@/components/applications/others/applicationDataTable';
import { columns } from '@/components/applications/others/applicationColumns';
import { getDummyApplicationsByStatus } from '@/utils/dummyData';

export default function NewApplicationsPage() {
  const applications = getDummyApplicationsByStatus('New');
  return (
    <div className="2xl:px-2">
      <DataTable
        columns={columns}
        data={applications}
        columnFileName="NewApplicationsColumns"
        emptyMessage="No new applications found."
      />
    </div>
  );
}
