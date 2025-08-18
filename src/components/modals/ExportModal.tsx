import { ExportModalProps } from '@/types';

interface ExportModalWithTypeProps extends ExportModalProps {
  fileType?: 'csv' | 'pdf';
}

const ExportModal: React.FC<ExportModalWithTypeProps> = ({
  isOpen,
  onClose,
  onDownload,
  selectedCount,
  filename,
  fileType,
  exportSource,
}) => {
  if (!isOpen) return null;
  
  const isZeroRows = selectedCount === 0 && exportSource === 'button';
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-2">Export Confirmation</h2>
        <p className="mb-6 text-gray-600">
          {exportSource === 'button' ? (
            <>
              {isZeroRows ? (
                <span className="text-red-600 font-medium">{filename}</span>
              ) : (
                <>You are exporting <b>{selectedCount}</b> rows.</>
              )}
            </>
          ) : (
            <>
              You are exporting <b>{filename}</b> details as{' '}
              <b>{fileType?.toUpperCase() || 'CSV'}</b>.
            </>
          )}
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            className={`w-full py-2 rounded cursor-pointer ${
              isZeroRows
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-secondary-200 text-white hover:opacity-90'
            }`}
            onClick={onDownload}
            disabled={isZeroRows}
          >
            Download {fileType?.toUpperCase() || 'CSV'} File
          </button>
          <button
            className="bg-gray-50 text-gray-700 w-full py-2 rounded hover:bg-gray-100 cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
