'use client'
import React, { useState, useEffect } from 'react';
import { DataTable } from '@/components/applications/others/applicationDataTable';
import { columns } from '@/components/applications/others/applicationColumns';
import { LoanApplicationDisplay } from '@/services/apiQueries/customersDetails';
import { Loader2 } from 'lucide-react';
import { getDummyApplicationsByStatus } from '@/utils/dummyData';

const ApprovedApplicationsPage = () => {
  const [applications, setApplications] = useState<LoanApplicationDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDummyApplications = () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Use dummy data instead of API call
        const data = getDummyApplicationsByStatus('Approved');
        setApplications(data);
      } catch (error) {
        console.error('Error loading dummy approved applications:', error);
        setError('Failed to load applications');
      } finally {
        setIsLoading(false);
      }
    };

    // Simulate loading delay
    setTimeout(loadDummyApplications, 500);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-6 h-6 text-secondary-200" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        {error}
      </div>
    );
  }

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