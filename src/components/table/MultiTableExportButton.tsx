'use client';

import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
  useCallback,
} from 'react';
import { formatDate } from '@/utils/functions';
import ExportModal from '@/components/modals/ExportModal';
import { exportToCSV } from '@/utils/functions';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

// Types for the export context
interface TableData {
  tableName: string;
  allData: Record<string, unknown>[];
  selectedData: Record<string, unknown>[];
  selectedCount: number;
  allCount: number;
}

interface TabInfo {
  label: string;
  url: string;
}

interface ExportContextType {
  registerTable: (tableData: TableData) => void;
  unregisterTable: (tableName: string) => void;
  tables: Map<string, TableData>;
  availableTabs: TabInfo[];
}

interface MultiTableExportButtonProps {
  className?: string;
  disabled?: boolean;
  children?: ReactNode;
}

interface ExportProviderProps {
  children: ReactNode;
  availableTabs?: TabInfo[];
}

// Create context for managing table data
const ExportContext = createContext<ExportContextType | null>(null);

// Provider component to wrap around layouts/pages that contain tables
export const ExportProvider: React.FC<ExportProviderProps> = ({
  children,
  availableTabs = [],
}) => {
  const [tables, setTables] = useState<Map<string, TableData>>(new Map());

  const registerTable = useCallback((tableData: TableData) => {
    setTables((prev) => {
      const newTables = new Map(prev);
      newTables.set(tableData.tableName, tableData);
      return newTables;
    });
  }, []);

  const unregisterTable = useCallback((tableName: string) => {
    setTables((prev) => {
      const newTables = new Map(prev);
      newTables.delete(tableName);
      return newTables;
    });
  }, []);

  return (
    <ExportContext.Provider
      value={{ registerTable, unregisterTable, tables, availableTabs }}
    >
      {children}
    </ExportContext.Provider>
  );
};

// Hook to use the export context
export const useExportContext = () => {
  const context = useContext(ExportContext);
  if (!context) {
    throw new Error('useExportContext must be used within an ExportProvider');
  }
  return context;
};

// Hook for tables to register themselves
export const useTableRegistration = (
  tableName: string,
  allData: Record<string, unknown>[],
  selectedData: Record<string, unknown>[],
  selectedCount: number
) => {
  const { registerTable, unregisterTable } = useExportContext();

  // Register/update table data
  useEffect(() => {
    const tableData: TableData = {
      tableName,
      allData,
      selectedData,
      selectedCount,
      allCount: allData.length,
    };

    registerTable(tableData);

    return () => {
      unregisterTable(tableName);
    };
  }, [tableName, allData, selectedData, selectedCount]);
};

// Main export button component
const MultiTableExportButton: React.FC<MultiTableExportButtonProps> = ({
  className,
  disabled,
  children,
}) => {
  const { tables, availableTabs } = useExportContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [exportData, setExportData] = useState<Record<string, unknown>[]>([]);
  const [exportCount, setExportCount] = useState(0);
  const [exportFilename, setExportFilename] = useState('');
  const [isWarningModal, setIsWarningModal] = useState(false);

  const currentDate = formatDate(new Date(), false);
  const tablesArray = Array.from(tables.values());
  const hasSelectedData = tablesArray.some((table) => table.selectedCount > 0);

  // Helper function to get user-friendly table name from available tabs
  const getTableDisplayName = (tableName: string): string => {
    // Try to find matching tab label
    const matchingTab = availableTabs.find(
      (tab) =>
        tab.label.toLowerCase().includes(tableName.toLowerCase()) ||
        tableName.toLowerCase().includes(tab.label.toLowerCase())
    );

    return matchingTab ? matchingTab.label : tableName;
  };

  const handleExportAll = () => {
    // Check if any table has data
    const totalCount = tablesArray.reduce(
      (sum, table) => sum + table.allCount,
      0
    );

    console.log('Total count calculated:', totalCount);

    if (totalCount === 0) {
      setIsWarningModal(true);
      setModalOpen(true);
      return;
    }

    // Combine all data from all tables
    const combinedData: Record<string, unknown>[] = [];
    let count = 0;

    tablesArray.forEach((table) => {
      // Add table identifier to each row with user-friendly name
      const tableDisplayName = getTableDisplayName(table.tableName);
      const tableDataWithSource = table.allData.map((row) => ({
        'Source Table': tableDisplayName,
        ...row,
      }));
      combinedData.push(...tableDataWithSource);
      count += table.allCount;
    });

    setExportData(combinedData);
    setExportCount(count);
    setExportFilename(`all-records-export-${currentDate}.csv`);
    setIsWarningModal(false);
    setModalOpen(true);
  };

  const handleExportPage = (pageName: string) => {
    // Find table that matches this page name
    const matchingTable = tablesArray.find(
      (table) =>
        table.tableName.toLowerCase().includes(pageName.toLowerCase()) ||
        pageName.toLowerCase().includes(table.tableName.toLowerCase())
    );

    if (!matchingTable || matchingTable.allCount === 0) {
      setIsWarningModal(true);
      setModalOpen(true);
      return;
    }

    setExportData(matchingTable.allData);
    setExportCount(matchingTable.allCount);
    setExportFilename(
      `${pageName.toLowerCase().replace(/\s+/g, '-')}-export-${currentDate}.csv`
    );
    setIsWarningModal(false);
    setModalOpen(true);
  };

  const handleExportSelected = () => {
    if (!hasSelectedData) {
      return; // This shouldn't happen as the option should be disabled
    }

    // Combine selected data from all tables
    const combinedSelectedData: Record<string, unknown>[] = [];
    let totalSelectedCount = 0;

    tablesArray.forEach((table) => {
      if (table.selectedCount > 0) {
        const tableDisplayName = getTableDisplayName(table.tableName);
        const selectedDataWithSource = table.selectedData.map((row) => ({
          'Source Table': tableDisplayName,
          ...row,
        }));
        combinedSelectedData.push(...selectedDataWithSource);
        totalSelectedCount += table.selectedCount;
      }
    });

    setExportData(combinedSelectedData);
    setExportCount(totalSelectedCount);
    setExportFilename(`selected-rows-export-${currentDate}.csv`);
    setIsWarningModal(false);
    setModalOpen(true);
  };

  const handleDownload = () => {
    if (!isWarningModal) {
      exportToCSV(exportData, exportFilename);
    }
    setModalOpen(false);
  };

  const renderDropdownItems = () => {
    const items: ReactNode[] = [];

    // Add "All Records" option
    items.push(
      <DropdownMenuItem
        key="all-records"
        onClick={handleExportAll}
        className="cursor-pointer"
      >
        All Records
      </DropdownMenuItem>
    );

    // Only add separator and page options if there are available tabs
    if (availableTabs.length > 0) {
      items.push(<DropdownMenuSeparator key="separator-1" />);

      // Add page name options based on available tabs
      availableTabs.forEach((tab, index) => {
        items.push(
          <DropdownMenuItem
            key={`page-${index}`}
            onClick={() => handleExportPage(tab.label)}
            className="cursor-pointer"
          >
            {tab.label}
          </DropdownMenuItem>
        );
      });
    }

    items.push(<DropdownMenuSeparator key="separator-2" />);

    // Add "Selected Rows" option
    items.push(
      <DropdownMenuItem
        key="selected-rows"
        onClick={handleExportSelected}
        className={`cursor-pointer ${
          !hasSelectedData ? 'opacity-50 pointer-events-none' : ''
        }`}
        disabled={!hasSelectedData}
      >
        Selected Rows
      </DropdownMenuItem>
    );

    return items;
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          {children || (
            <button
              type="button"
              className={`bg-secondary-200 text-white px-4 py-1.5 text-[15px] font-medium rounded hover:bg-secondary-300 transition ${
                className || ''
              }`}
              disabled={disabled} // Never disabled by default
            >
              Export
            </button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-auto text-gray-500">
          {renderDropdownItems()}
        </DropdownMenuContent>
      </DropdownMenu>

      {modalOpen && (
        <ExportModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onDownload={isWarningModal ? () => {} : handleDownload}
          selectedCount={isWarningModal ? 0 : exportCount}
          filename={
            isWarningModal ? 'No data available for export' : exportFilename
          }
          exportSource="button"
        />
      )}
    </>
  );
};

export default MultiTableExportButton;
