import { DataTable } from '@/components/applications/ready-to-disburse/applicationDataTable';
import { columns } from '@/components/applications/ready-to-disburse/applicationColumns';
import { getDummyApplicationsByStatus } from '@/utils/dummyData';

export default function ReadyToDisburseApplicationsPage() {
  const applications = getDummyApplicationsByStatus('ReadyToDisburse');
  return (
    <div className="2xl:px-2">
      <DataTable
        columns={columns}
        data={applications}
        columnFileName="ReadyToDisburseApplicationsColumns"
        emptyMessage="No ready-to-disburse applications found."
      />
    </div>
  );
}
