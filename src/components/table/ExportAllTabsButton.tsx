'use client';

import { useState } from 'react';
import { Loader2, Download } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { exportToCSV } from '@/utils/functions';
import { GetLoanApplications, GetInactiveCustomers } from '@/services/apiQueries/customersDetails';
import { toast } from 'react-toastify';

interface ExportAllTabsButtonProps {
  teamMemberEmail?: string;
  className?: string;
}

interface TabData {
  name: string;
  key: string;
  fetchFunction: (email?: string) => Promise<Record<string, unknown>[]>;
}

const TABS_DATA: TabData[] = [
  {
    name: 'Incomplete Sign Ups',
    key: 'incomplete-signups',
    fetchFunction: async (email?: string) => {
      const result = await GetInactiveCustomers.getCustomers(email);
      return result as unknown as Record<string, unknown>[];
    },
  },
  {
    name: 'New Applications',
    key: 'new-applications',
    fetchFunction: async (email?: string) => {
      const result = await GetLoanApplications.getNewApplications(email);
      return result as unknown as Record<string, unknown>[];
    },
  },
  {
    name: 'In Progress',
    key: 'in-progress',
    fetchFunction: async (email?: string) => {
      const result = await GetLoanApplications.getInProgressApplications(email);
      return result as unknown as Record<string, unknown>[];
    },
  },
  {
    name: 'Ready to Disburse',
    key: 'ready-to-disburse',
    fetchFunction: async (email?: string) => {
      const result = await GetLoanApplications.getReadyToDisburseApplications(email);
      return result as unknown as Record<string, unknown>[];
    },
  },
  {
    name: 'Approved',
    key: 'approved',
    fetchFunction: async (email?: string) => {
      const result = await GetLoanApplications.getApprovedApplications(email);
      return result as unknown as Record<string, unknown>[];
    },
  },
  {
    name: 'Declined',
    key: 'declined',
    fetchFunction: async (email?: string) => {
      const result = await GetLoanApplications.getDeclinedApplications(email);
      return result as unknown as Record<string, unknown>[];
    },
  },
  {
    name: 'Abandoned',
    key: 'abandoned',
    fetchFunction: async (email?: string) => {
      const result = await GetLoanApplications.getDroppedApplications(email);
      return result as unknown as Record<string, unknown>[];
    },
  },
];

const ExportAllTabsButton: React.FC<ExportAllTabsButtonProps> = ({
  teamMemberEmail,
  className,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportingTab, setExportingTab] = useState<string | null>(null);

  const handleExportSingleTab = async (tab: TabData) => {
    try {
      setIsExporting(true);
      setExportingTab(tab.key);
      
      // Fetch data for the specific tab
      const data = await tab.fetchFunction(teamMemberEmail);
      
      if (!data || data.length === 0) {
        toast.warning(`No data to export for ${tab.name}`);
        return;
      }
      
      // Export to CSV with tab-specific filename
      const filename = `${tab.key}-export-${new Date().toISOString().split('T')[0]}.csv`;
      exportToCSV(data, filename);
      
      toast.success(`Successfully exported ${tab.name} data`);
    } catch (error) {
      console.error(`Error exporting ${tab.name}:`, error);
      toast.error(`Failed to export ${tab.name} data`);
    } finally {
      setIsExporting(false);
      setExportingTab(null);
    }
  };

  const handleExportAllTabs = async () => {
    try {
      setIsExporting(true);
      let exportedCount = 0;
      
      for (const tab of TABS_DATA) {
        setExportingTab(tab.key);
        
        try {
          const data = await tab.fetchFunction(teamMemberEmail);
          
          if (data && data.length > 0) {
            const filename = `all-applications-${tab.key}-${new Date().toISOString().split('T')[0]}.csv`;
            exportToCSV(data, filename);
            exportedCount++;
            
            // Small delay between exports to prevent overwhelming the browser
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        } catch (error) {
          console.error(`Error exporting ${tab.name}:`, error);
        }
      }
      
      if (exportedCount > 0) {
        toast.success(`Successfully exported ${exportedCount} tab(s) data`);
      } else {
        toast.warning('No data found to export');
      }
    } catch (error) {
      console.error('Error exporting all tabs:', error);
      toast.error('Failed to export all tabs data');
    } finally {
      setIsExporting(false);
      setExportingTab(null);
    }
  };

  const handleExportCombined = async () => {
    try {
      setIsExporting(true);
      const allData: Record<string, unknown>[] = [];
      
      for (const tab of TABS_DATA) {
        setExportingTab(tab.key);
        
        try {
          const data = await tab.fetchFunction(teamMemberEmail);
          
          if (data && data.length > 0) {
            // Add tab name to each record for identification
            const dataWithTab = data.map(item => ({
              ...item,
              applicationStatus: tab.name,
            }));
            allData.push(...dataWithTab);
          }
        } catch (error) {
          console.error(`Error fetching ${tab.name}:`, error);
        }
      }
      
      if (allData.length > 0) {
        const filename = `all-applications-combined-${new Date().toISOString().split('T')[0]}.csv`;
        exportToCSV(allData, filename);
        toast.success(`Successfully exported ${allData.length} records from all tabs`);
      } else {
        toast.warning('No data found to export');
      }
    } catch (error) {
      console.error('Error exporting combined data:', error);
      toast.error('Failed to export combined data');
    } finally {
      setIsExporting(false);
      setExportingTab(null);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={`bg-secondary-200 text-white px-4 py-1.5 text-[15px] font-medium rounded hover:bg-secondary-300 transition flex items-center gap-2 ${
            className || ''
          }`}
          disabled={isExporting}
        >
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {exportingTab ? `Exporting...` : 'Exporting...'}
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Export All Tabs
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem
          onClick={handleExportCombined}
          disabled={isExporting}
          className="cursor-pointer"
        >
          <div className="flex flex-col">
            <span className="font-medium">Export Combined</span>
            <span className="text-xs text-gray-500">All tabs in one file</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleExportAllTabs}
          disabled={isExporting}
          className="cursor-pointer"
        >
          <div className="flex flex-col">
            <span className="font-medium">Export Separately</span>
            <span className="text-xs text-gray-500">Each tab as separate file</span>
          </div>
        </DropdownMenuItem>
        <div className="border-t my-1"></div>
        <div className="px-2 py-1.5 text-xs font-medium text-gray-500">
          Export Individual Tabs
        </div>
        {TABS_DATA.map((tab) => (
          <DropdownMenuItem
            key={tab.key}
            onClick={() => handleExportSingleTab(tab)}
            disabled={isExporting}
            className="cursor-pointer text-sm"
          >
            {tab.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportAllTabsButton;