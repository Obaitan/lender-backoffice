'use client';

import { useState } from 'react';
import { Upload, X, FileText } from 'lucide-react';

interface UploadDocumentProps {
  onUpload: (files: File[]) => void;
}

const UploadFile = ({ onUpload }: UploadDocumentProps) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      onUpload([selectedFile]);
    }
  };

  const removeFile = () => {
    setFile(null);
    onUpload([]);
  };

  return (
    <div
      className={`w-full h-[200px] border-2 border-dashed rounded-lg p-6 text-center transition-colors my-auto hover:border-secondary-200 hover:bg-secondary-50 ${
        file ? 'border-secondary-200 bg-secondary-50' : 'border-gray-300'
      }`}
    >
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFileChange}
        accept=".pdf,.png,.jpg,.jpeg"
      />
      <div className="flex flex-col items-center justify-center gap-2 w-full h-full">
        {file ? (
          <div className="flex items-center gap-2 h-full p-4 md:p-8">
            <FileText className="w-6 h-6 text-secondary-200" />
            <span className="text-sm text-gray-700 truncate max-w-full">
              {file.name}
            </span>
            <button
              type="button"
              onClick={removeFile}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center justify-center gap-2 h-full"
          >
            <Upload className="w-6 h-6 text-secondary-200" />
            <div className="flex flex-col gap-0.5">
              <span className="text-sm text-gray-600">
                Click to upload or drag and drop
              </span>
              <span className="text-xs text-gray-500">
                PDF, PNG, JPG up to 3MB
              </span>
            </div>
          </label>
        )}
      </div>
    </div>
  );
};

export default UploadFile;
