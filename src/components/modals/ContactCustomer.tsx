'use client';

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { ArrowUpFromLineIcon } from 'lucide-react'; // Using a similar icon for upload

interface ContactCustomerProps {
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (subject: string, message: string, files: File[]) => void;
}

const ContactCustomer = ({
  isOpen,
  onClose,
  onSendMessage,
}: ContactCustomerProps) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  // Basic state for drag/drop visual feedback - can be enhanced later
  const [isDragging, setIsDragging] = useState(false);

  if (!isOpen) return null;

  const handleSendMessage = () => {
    // Basic validation (can be enhanced)
    if (subject && message) {
      onSendMessage(subject, message, attachedFiles);
      // Reset form
      setSubject('');
      setMessage('');
      setAttachedFiles([]);
      onClose();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    // Optional: Add validation for file count (max 10) and size (max 10MB each)
    const validFiles = files.filter((file) => file.size <= 10 * 1024 * 1024); // 10MB
    // Optional: Limit to 10 files total
    setAttachedFiles((prev) => {
      const newFiles = [...prev, ...validFiles];
      return newFiles.slice(0, 10);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    // Optional: Add validation for file count (max 10) and size (max 10MB each)
    const validFiles = files.filter((file) => file.size <= 10 * 1024 * 1024); // 10MB
    // Optional: Limit to 10 files total
    setAttachedFiles((prev) => {
      const newFiles = [...prev, ...validFiles];
      return newFiles.slice(0, 10);
    });
  };

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto p-0 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-b-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Contact Customer
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-error-400 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Subject */}
          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              className="w-full border border-gray-100 rounded-md shadow-sm px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-primary-200 focus:border-primary-200"
              placeholder="Enter subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Message
            </label>
            <textarea
              id="message"
              rows={6}
              className="w-full border border-gray-100 rounded-md shadow-sm px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-primary-200 focus:border-primary-200"
              placeholder="Enter message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>

          {/* Attachments */}
          <div>
            <p className="block text-sm font-medium text-gray-700 mb-1">
              Attachments
            </p>
            <label
              htmlFor="attachment-upload"
              className={`w-full flex flex-col items-center justify-center px-4 py-6 border-2 border-dashed rounded-md cursor-pointer ${
                isDragging
                  ? 'border-primary-200 bg-primary-50'
                  : 'border-secondary-200 bg-secondary-50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex items-center justify-center text-secondary-200">
                <ArrowUpFromLineIcon className="w-5 h-5 mr-2" />
                <p className="text-sm">
                  <span className="font-semibold">Upload files</span>
                </p>
              </div>
              <input
                id="attachment-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                multiple
                accept=".pdf,.png,.jpg,.jpeg"
              />
            </label>
            <p className="text-xs text-gray-500 mt-2">
              You can upload a maximum of 5 files, 5MB each
            </p>

            {/* Display attached files */}
            {attachedFiles.length > 0 && (
              <div className="mt-3 space-y-2">
                {attachedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                  >
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-5 h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        ></path>
                      </svg>
                      <span className="text-sm text-gray-700 truncate max-w-[200px]">
                        {file.name}
                      </span>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-gray-400 hover:text-error-400 transition-colors"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t">
          <button
            onClick={handleSendMessage}
            disabled={!subject || !message} // Disable if subject or message is empty
            className="w-full px-6 py-2 text-sm font-medium text-white bg-secondary-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactCustomer;
