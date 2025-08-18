import { DataTable } from '@/components/applications/others/applicationDataTable';
import { columns } from '@/components/applications/others/applicationColumns';
import { getDummyApplicationsByStatus } from '@/utils/dummyData';

const ApprovedApplicationsPage = () => {
  const applications = getDummyApplicationsByStatus('Approved');
  return (
    <div className="2xl:px-2">
      <DataTable
        columns={columns}
        data={applications}
        columnFileName="ApproveApplicationsColumns"
        emptyMessage="No approved applications found."
      />
    </div>
  );
};

export default ApprovedApplicationsPage;
