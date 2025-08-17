import { useState } from 'react';
import { exportToCSV } from '@/utils/functions';
import 'jspdf-autotable';
import ExportModal from '@/components/modals/ExportModal';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

interface ExportDetailsButtonProps {
  data: Record<string, unknown>[];
  filename: string;
  disabled?: boolean;
  className?: string;
  exportType: 'csv' | 'pdf';
  setExportType: (type: 'csv' | 'pdf') => void;
}

const ExportDetailsButton: React.FC<ExportDetailsButtonProps> = ({
  data,
  filename,
  disabled,
  className,
  exportType,
  setExportType,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleExport = (type: 'csv' | 'pdf') => {
    setExportType(type);
    setModalOpen(true);
  };

  const handleDownload = async () => {
    if (exportType === 'csv') {
      exportToCSV(data, filename);
    } else if (exportType === 'pdf') {
      await exportToPDF(data, filename);
    }
    setModalOpen(false);
  };

  // PDF export utility using jsPDF and autotable
  const exportToPDF = async (
    data: Record<string, unknown>[],
    filename: string
  ) => {
    if (!data || data.length === 0) {
      console.warn('No data to export');
      return;
    }
    const jsPDFModule = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;
    const doc = new jsPDFModule.jsPDF('p', 'pt', 'a4');
    const details = data[0];

    // 1. Print main details (excluding permissions)
    let y = 40;
    doc.setFontSize(16);
    doc.text(filename, 40, y);
    y += 30;
    doc.setFontSize(12);

    Object.entries(details).forEach(([key, value]) => {
      if (key !== 'permissions') {
        doc.text(`${key}: ${value ?? ''}`, 40, y);
        y += 18;
      }
    });

    // 2. Print permissions as a table
    if (Array.isArray(details.permissions) && details.permissions.length > 0) {
      y += 20;
      doc.setFontSize(14);
      doc.text('Permissions', 40, y);
      y += 10;
      const permHeaders = Object.keys(details.permissions[0]);
      const permRows = details.permissions.map((p) =>
        permHeaders.map((h) => String(p[h]))
      );
      autoTable(doc, {
        startY: y + 10,
        head: [permHeaders],
        body: permRows,
        margin: { left: 40, right: 40 },
        styles: { fontSize: 10 },
      });
    }

    doc.save(`${filename}.pdf`);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={`bg-secondary-200 text-white px-4 py-1.5 text-sm font-medium rounded hover:bg-secondary-300 transition ${
              className || ''
            }`}
            disabled={disabled || data.length === 0}
            style={disabled ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
          >
            Export Details
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => handleExport('csv')}
            disabled={data.length === 0}
            className={
              data.length === 0
                ? 'opacity-50 pointer-events-none'
                : 'cursor-pointer'
            }
          >
            Export as CSV
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleExport('pdf')}
            disabled={data.length === 0}
            className={
              data.length === 0
                ? 'opacity-50 pointer-events-none'
                : 'cursor-pointer'
            }
          >
            Export as PDF
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {modalOpen && (
        <ExportModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onDownload={handleDownload}
          selectedCount={data.length}
          filename={filename}
          fileType={exportType}
          exportSource="details"
        />
      )}
    </>
  );
};

export default ExportDetailsButton;
