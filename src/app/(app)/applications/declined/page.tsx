import { DataTable } from '@/components/applications/others/applicationDataTable';
import { columns } from '@/components/applications/others/applicationColumns';
import { getDummyApplicationsByStatus } from '@/utils/dummyData';

const DeclinedApplicationsPage = () => {
  const applications = getDummyApplicationsByStatus('Declined');

  return (
    <div className="2xl:px-2">
      <DataTable
        columns={columns}
        data={applications}
        columnFileName="DeclinedApplicationsColumns"
        emptyMessage="No declined applications found."
      />
    </div>
  );
};

export default DeclinedApplicationsPage;
