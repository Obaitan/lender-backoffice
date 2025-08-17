import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';

interface DocumentData {
  url: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  category: string;
}

interface ViewCustomerDocumentsProps {
  isOpen: boolean;
  onClose: () => void;
  documents: DocumentData[];
  initialIndex?: number;
}

const ViewCustomerDocuments = ({
  isOpen,
  onClose,
  documents,
  initialIndex = 0,
}: ViewCustomerDocumentsProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const currentDoc = documents[currentIndex];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 md:mx-0 p-0 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold">Customer Documents</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-error-400 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Document Info */}
        <div className="px-6 pt-4 pb-2">
          <p className="text-xs text-secondary-200 font-semibold mb-0.5">
            {currentDoc.category || 'Document'}
          </p>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700 leading-tight">
                {currentDoc.name}
              </p>
              <p className="text-xs text-gray-400">
                File Size: {currentDoc.size}
              </p>
            </div>
            <span className="text-xs text-gray-400">
              {currentDoc.uploadedAt}
            </span>
          </div>
        </div>

        {/* Main Document Preview */}
        <div className="flex items-center justify-center bg-gray-50 min-h-[320px] max-h-[420px] px-2 py-4">
          {currentDoc.url ? (
            currentDoc.type.startsWith('image') ? (
              <Image
                src={currentDoc.url}
                alt={currentDoc.name}
                className="max-h-[380px] max-w-full rounded-md object-contain shadow"
              />
            ) : currentDoc.type === 'application/pdf' ? (
              <iframe
                src={currentDoc.url}
                title={currentDoc.name}
                className="w-full h-[380px] rounded-md border"
              />
            ) : (
              <div className="text-gray-400">
                Document preview not available
              </div>
            )
          ) : (
            <div className="text-gray-400">Document preview not available</div>
          )}
        </div>

        {/* Thumbnails */}
        <div className="flex items-center gap-4 px-6 py-4 bg-white border-t">
          {documents.map((doc, idx) => (
            <button
              key={doc.url}
              onClick={() => setCurrentIndex(idx)}
              className={`flex flex-col items-center px-2 py-1 rounded-lg border transition-all ${
                idx === currentIndex
                  ? 'border-primary-200 bg-primary-50 shadow'
                  : 'border-transparent bg-gray-50 hover:border-primary-100'
              }`}
            >
              {doc.type.startsWith('image') ? (
                <Image
                  src={doc.url}
                  alt={doc.name}
                  className="w-12 h-12 object-cover rounded mb-1"
                />
              ) : (
                <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded mb-1">
                  <span className="text-red-500 font-bold text-xs">PDF</span>
                </div>
              )}
              <span className="text-xs text-gray-500 truncate max-w-[60px]">
                {doc.name.length > 12 ? doc.name.slice(0, 9) + '...' : doc.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewCustomerDocuments;
