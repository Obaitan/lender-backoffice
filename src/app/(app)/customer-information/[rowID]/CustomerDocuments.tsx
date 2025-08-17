'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Documents } from '@/types';
import { getDummyCustomerDocuments } from '@/utils/dummyData';
import { Loader2 } from 'lucide-react';
import ViewCustomerDocuments from '@/components/modals/ViewCustomerDocuments';

export default function CustomerDocuments({
  phoneNumber,
}: {
  phoneNumber: string;
}) {
  const [documents, setDocuments] = useState<Documents[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  // Map Documents[] to DocumentData[] for the modal
  const mappedDocuments = documents.map((doc) => {
    const extension = doc.documentExtension?.toLowerCase() || '';
    const isPDF = extension === '.pdf' || extension === 'pdf';
    const isImage =
      /\.(jpg|jpeg|png|gif|webp)$/i.test(extension) ||
      ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension);
    
    // Use the file path directly from public folder
    const url = doc.document || '';
    
    return {
      url,
      name: doc.documentTitle || `Document ${doc.id}`,
      type: isPDF
        ? 'application/pdf'
        : isImage
        ? 'image/png'
        : 'application/octet-stream',
      size: 'Unknown', // File size not available for static files
      uploadedAt: doc.createDate
        ? new Date(doc.createDate).toLocaleString()
        : '',
      category: doc.documentTitle || '',
    };
  });

  const handleThumbnailClick = (index: number) => {
    setModalIndex(index);
    setIsModalOpen(true);
  };

  useEffect(() => {
    async function fetchDocuments() {
      if (!phoneNumber) {
        setLoading(false);
        return;
      }

      try {
        // Use dummy data instead of API call
        const docs = getDummyCustomerDocuments(phoneNumber);
        setDocuments(docs);
      } catch (err) {
        setError(
          `Failed to load customer documents: ${
            err instanceof Error ? err.message : 'Unknown error'
          }`
        );
      } finally {
        setLoading(false);
      }
    }

    fetchDocuments();
  }, [phoneNumber]);

  // Helper to format document extension display
  const formatDocumentType = (extension: string) => {
    if (!extension) return 'UNKNOWN';
    return extension.startsWith('.')
      ? extension.substring(1).toUpperCase()
      : extension.toUpperCase();
  };

  if (loading) return <Loader2 className="animate-spin w-6 h-6 text-secondary-200" />;
  if (error) return <p className="text-sm text-error-300">{error}</p>;

  return (
    <>
      {documents.length === 0 ? (
        <p className="text-sm text-gray-600">No documents found.</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {documents.map((doc, idx) => {
            if (!doc) return null;
            const extension = doc.documentExtension?.toLowerCase() || '';
            const isPDF = extension === '.pdf' || extension === 'pdf';
            const isImage =
              /\.(jpg|jpeg|png|gif|webp)$/i.test(extension) ||
              ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension);
            
            // Use the file path directly
            const documentSource = doc.document || '';
            
            return (
              <div
                key={doc.id}
                className="space-y-1.5 text-center cursor-pointer"
                onClick={() => handleThumbnailClick(idx)}
              >
                <div className="relative h-16 w-16 overflow-hidden flex justify-center items-center rounded border border-gray-100 hover:border-secondary-200 bg-gray-50 transition-colors duration-300 mx-auto">
                  {isImage && documentSource ? (
                    <Image
                      src={documentSource}
                      alt={doc.documentTitle || 'Image Document'}
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  ) : isPDF ? (
                    <div className="flex flex-col items-center justify-center">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M7 18H17V16H7V18Z" fill="#FF5722" />
                        <path d="M17 14H7V12H17V14Z" fill="#FF5722" />
                        <path d="M7 10H11V8H7V10Z" fill="#FF5722" />
                        <path
                          d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z"
                          fill="#FF5722"
                        />
                      </svg>
                      <span className="text-[10px] mt-1">PDF</span>
                    </div>
                  ) : (
                    <div className="bg-gray-100 h-full w-full flex items-center justify-center">
                      <span className="text-xs font-medium">
                        {formatDocumentType(extension) || 'DOC'}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-400 line-clamp-1 max-w-16">
                  {doc.documentTitle || `Document ${doc.id}`}
                </p>
              </div>
            );
          })}
        </div>
      )}
      <ViewCustomerDocuments
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        documents={mappedDocuments}
        initialIndex={modalIndex}
      />
    </>
  );
}
