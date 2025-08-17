import { useState } from 'react';
import { ExportButtonProps } from '@/types';
import ExportModal from '@/components/modals/ExportModal';
import { exportToCSV } from '@/utils/functions';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

interface ExportDropdownButtonProps extends ExportButtonProps {
  selectedData: Record<string, unknown>[];
  allData: Record<string, unknown>[];
  selectedCount: number;
  allCount: number;
  filename: string;
}

const ExportButton: React.FC<ExportDropdownButtonProps> = ({
  selectedData,
  allData,
  selectedCount,
  allCount,
  filename,
  disabled,
  className,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [exportData, setExportData] = useState<Record<string, unknown>[]>([]);
  const [exportCount, setExportCount] = useState(0);

  const handleExport = (type: 'selected' | 'all') => {
    if (type === 'selected') {
      setExportData(selectedData);
      setExportCount(selectedCount);
    } else {
      setExportData(allData);
      setExportCount(allCount);
    }
    setModalOpen(true);
  };

  const handleDownload = () => {
    exportToCSV(exportData, filename);
    setModalOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={`bg-secondary-200 text-white px-4 py-1.5 text-[15px] font-medium rounded hover:bg-secondary-300 transition ${
              className || ''
            }`}
            disabled={disabled || (selectedCount === 0 && allCount === 0)}
            style={disabled ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
          >
            Export
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => handleExport('selected')}
            disabled={selectedCount === 0}
            className={
              selectedCount === 0
                ? 'opacity-50 pointer-events-none'
                : 'cursor-pointer'
            }
          >
            Export Selected
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleExport('all')}
            disabled={allCount === 0}
            className={
              allCount === 0
                ? 'opacity-50 pointer-events-none'
                : 'cursor-pointer'
            }
          >
            Export All
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {modalOpen && (
        <ExportModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onDownload={handleDownload}
          selectedCount={exportCount}
          filename={filename}
          exportSource="button"
        />
      )}
    </>
  );
};

export default ExportButton;
