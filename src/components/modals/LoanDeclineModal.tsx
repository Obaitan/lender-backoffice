'use client';

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

interface LoanDeclineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reasons: string[], comment?: string) => void;
}

const LoanDeclineModal = ({ isOpen, onClose, onConfirm }: LoanDeclineModalProps) => {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [comment, setComment] = useState('');

  const declineReasons = [
    'State of Residence not supported',
    'Salary not sufficient',
    'Outstanding unpaid loan(s)',
    'Unverified Documents',
    'Debt service ratio exceeded',
    'Others'
  ];

  const handleReasonChange = (reason: string) => {
    setSelectedReasons(prev => 
      prev.includes(reason) 
        ? prev.filter(r => r !== reason)
        : [...prev, reason]
    );
  };

  const handleConfirm = () => {
    if (selectedReasons.length === 0) return;
    
    const finalComment = selectedReasons.includes('Others') ? comment : undefined;
    onConfirm(selectedReasons, finalComment);
    
    // Reset form
    setSelectedReasons([]);
    setComment('');
    onClose();
  };

  const handleClose = () => {
    setSelectedReasons([]);
    setComment('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Decline Application</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Please select one or more reasons for the decline
        </p>
        
        <div className="space-y-3 mb-4">
          {declineReasons.map((reason) => (
            <label key={reason} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedReasons.includes(reason)}
                onChange={() => handleReasonChange(reason)}
                className="w-4 h-4 text-secondary-200 border-gray-300 rounded focus:ring-secondary-200"
              />
              <span className="text-sm text-gray-700">{reason}</span>
            </label>
          ))}
        </div>

        {selectedReasons.includes('Others') && (
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-2">Comments</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Please provide additional details..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-secondary-200 focus:border-transparent"
              rows={4}
            />
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={selectedReasons.length === 0}
            className="px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Confirm Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoanDeclineModal;