import { DataTable } from '@/components/applications/others/applicationDataTable';
import { columns } from '@/components/applications/others/applicationColumns';
import { getDummyApplicationsByStatus } from '@/utils/dummyData';

const InProgressApplicationsPage = () => {
  const applications = getDummyApplicationsByStatus('InProgress');
  return (
    <div className="2xl:px-2">
      <DataTable
        columns={columns}
        data={applications}
        columnFileName="InProgressedApplicationsColumns"
        emptyMessage="No applications in progress found."
      />
    </div>
  );
};

export default InProgressApplicationsPage;
