'use client';

import TileLink from '../TileLink';
import { TileItem } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useSearchParams } from 'next/navigation';

const TaskBoardApplications = ({
  applications,
}: {
  applications: TileItem[];
}) => {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  
  // Get team member information from URL parameters
  const teamMemberEmail = searchParams.get('email');
  const rmCode = searchParams.get('rmCode');
  
  // Determine if user is admin or superior officer
  const userRoleCode = typeof user?.role === 'object' && user?.role !== null 
    ? (user.role as { roleCode: string }).roleCode 
    : user?.roleCode || undefined;
  const isSuperiorOfficer = ['ADM', 'CAM', 'CRO'].includes(userRoleCode || '');
  
  // Function to modify application URLs for team member view
  const getApplicationUrl = (originalHref: string) => {
    // Only modify URLs if user is admin/superior officer viewing team member's taskboard
    if (!isSuperiorOfficer || (!teamMemberEmail && !rmCode)) {
      return originalHref;
    }
    
    // Map taskboard hrefs to application tabs
    const applicationTabMapping: Record<string, string> = {
      'applications/incomplete-signups': '/applications/incomplete-signups',
      'applications/ready': '/applications/ready',
      '/applications/in-progress': '/applications/in-progress',
      '/applications/new': '/applications/new',
      '/applications/approved': '/applications/approved',
      '/applications/declined': '/applications/declined',
      '/applications/dropped': '/applications/dropped',
    };
    
    // Get the mapped application URL
    const applicationUrl = applicationTabMapping[originalHref];
    
    if (applicationUrl) {
      // Add team member parameters to the URL
      const urlParams = new URLSearchParams();
      if (teamMemberEmail) {
        urlParams.append('email', teamMemberEmail);
      }
      if (rmCode) {
        urlParams.append('rmCode', rmCode);
      }
      
      return `${applicationUrl}?${urlParams.toString()}`;
    }
    
    return originalHref;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
      {applications.map((application) => (
        <TileLink
          key={application.label}
          href={getApplicationUrl(application.href)}
          icon={application.icon}
          label={application.label}
          count={application.count}
          countDiff={application.countDiff}
          percentageDiff={application.percentageDiff}
        />
      ))}
    </div>
  );
};

export default TaskBoardApplications;
