'use client';

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { formatDate } from '@/utils/functions';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-day-picker/style.css';
import PeriodFilter from '../general/PeriodFilter';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import SearchableDropdown from '../forms/SearchableDropdown';
import Image from 'next/image';

// Mock data for recipients
const teamMembers = [
  { id: 1, name: 'John Doe (CRO)', type: 'team' },
  { id: 2, name: 'Jane Smith (CRO)', type: 'team' },
  { id: 3, name: 'Mike Johnson (CAM)', type: 'team' },
];

const customers = [
  { id: 1, name: 'Customer A (PLH00123/2023)', type: 'customer' },
  { id: 2, name: 'Customer B (PLH00124/2024)', type: 'customer' },
  { id: 3, name: 'Customer C (PLH00125/2025)', type: 'customer' },
];

const sentMessages = [
  {
    id: 1,
    subject: 'Loan Application Follow-up',
    content:
      'Dear Customer, I noticed your loan application is incomplete. Please provide the missing bank statements for the last 3 months to proceed with your application. You can upload them through the customer portal or send them to this email.',
    date: 'march 14 2025 12:34:26',
  },
  {
    id: 2,
    subject: 'Payment Plan Adjustment Request',
    content:
      'Hi Risk Team, I need your approval to adjust the payment plan for customer ID #12345. The customer has requested to extend the loan term from 12 to 18 months due to recent financial constraints. Their payment history has been excellent so far.',
    date: 'march 12 2025 11:25:47',
  },
  {
    id: 3,
    subject: 'Customer Loan Restructuring',
    content:
      'Dear Customer, I am writing to confirm that your loan restructuring request has been processed. Your new monthly payment will be $350 instead of $500, effective from next month. The loan term has been extended by 6 months to accommodate this change.',
    date: 'march 10 2025 09:15:22',
  },
  {
    id: 4,
    subject: 'Document Verification Required',
    content:
      'Hi Compliance Team, Please verify the employment documents submitted by customer ID #12345. The company letterhead seems unusual, and I need your expertise to confirm its authenticity before proceeding with the loan approval.',
    date: 'march 8 2025 14:45:33',
  },
  {
    id: 5,
    subject: 'Early Repayment Confirmation',
    content:
      'Dear Customer, This is to confirm that we have received your request for early loan repayment. The total outstanding amount is $5,000. Please ensure this amount is available in your account by March 20, 2025, for the early repayment process.',
    date: 'march 5 2025 16:20:15',
  },
];

const NewMessageModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [recipientType, setRecipientType] = useState<'team' | 'customer'>(
    'team'
  );
  const [selectedRecipient, setSelectedRecipient] = useState<string>('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const isFormValid =
    subject.trim() !== '' && message.trim() !== '' && selectedRecipient !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Handle form submission
      console.log({
        recipientType,
        selectedRecipient,
        subject,
        message,
      });

      // Show success message
      toast.success('Message sent successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Reset form and close modal
      setSubject('');
      setMessage('');
      setSelectedRecipient('');
      onClose();
    } catch (error) {
      // Show error message
      toast.error(
        `Failed to send message: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] transition-opacity duration-300 ease-in-out">
      <div
        className="fixed inset-0 bg-black/70 transition-opacity duration-300 ease-in-out"
        onClick={onClose}
      />
      <div
        className="fixed inset-0 z-50 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg">
            <div className="flex items-center justify-between p-6">
              <h2 className="text-lg font-semibold text-gray-800">Message</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-error-400 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-5">
              {/* Recipient Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Type
                </label>
                <RadioGroup
                  value={recipientType}
                  onValueChange={(value) => {
                    setRecipientType(value as 'team' | 'customer');
                    setSelectedRecipient('');
                  }}
                  className="flex gap-8"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="team" id="team" />
                    <label
                      htmlFor="team"
                      className="text-sm font-medium text-gray-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Team Member
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="customer" id="customer" />
                    <label
                      htmlFor="customer"
                      className="text-sm font-medium text-gray-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Customer
                    </label>
                  </div>
                </RadioGroup>
              </div>

              {/* Recipient Selection */}
              <SearchableDropdown
                label="Select Recipient"
                options={[
                  ...(recipientType === 'team' ? teamMembers : customers).map(
                    (recipient) => ({
                      label: recipient.name,
                      value: recipient.id.toString(),
                    })
                  ),
                ]}
                selectedValue={selectedRecipient}
                onChange={(value) => setSelectedRecipient(value)}
                placeholder="Select a recipient"
              />

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
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full border border-gray-100 rounded-md shadow-sm px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-primary-200 focus:border-primary-200"
                  placeholder="Enter subject"
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
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full border border-gray-100 rounded-md shadow-sm px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-primary-200 focus:border-primary-200"
                  placeholder="Enter message"
                ></textarea>
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className="w-full px-6 py-2 mt-6 text-sm font-medium text-white bg-secondary-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function SentMessagesComponent() {
  const [appliedRange, setAppliedRange] = useState<{ from?: Date; to?: Date }>(
    {}
  );
  const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false);
  const [recipientType, setRecipientType] = useState<'team' | 'customer'>(
    'team'
  );
  const [selectedRecipient, setSelectedRecipient] = useState<string>('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const isFormValid =
    subject.trim() !== '' && message.trim() !== '' && selectedRecipient !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Handle form submission
      console.log({
        recipientType,
        selectedRecipient,
        subject,
        message,
      });

      // Show success message
      toast.success('Message sent successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Reset form
      setSubject('');
      setMessage('');
      setSelectedRecipient('');
    } catch (error) {
      // Show error message
      toast.error(
        `Failed to send message: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    }
  };

  return (
    <div className="grid grid-cols-1 gap-5">
      <div className="grid grid-cols-1 lg:grid-cols-10 xl:grid-cols-3 items-start gap-x-12 2xl:gap-x-14 text-sm">
        <div className="col-span-full lg:col-span-9 xl:col-span-2 space-y-5">
          <div className="flex flex-wrap justify-end text-sm gap-5">
            <div className="flex items-center gap-3">
              <PeriodFilter
                appliedRange={appliedRange}
                setAppliedRange={setAppliedRange}
              />

              <button
                onClick={() => setIsNewMessageModalOpen(true)}
                id="open-message-modal"
                className="xl:hidden flex items-center justify-center text-secondary-200 h-9 w-9 rounded-full border border-secondary-200 hover:bg-secondary-200 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {sentMessages.map((msg) => (
            <div
              key={msg.id}
              className="flex gap-3 cursor-pointer border-b border-b-gray-50 transition-all duration-300 pb-4"
            >
              <div className="w-1/10 flex justify-center items-center w-9 h-9 rounded-full text-gray-200 bg-[#f9f9f9]">
                <Image
                  src="/shapes/notification.svg"
                  alt=""
                  width={24}
                  height={24}
                />
              </div>
              <div className="overflow-hidden transition-all duration-300 space-y-[3px] w-full">
                <div className="flex flex-wrap justify-between gap-x-5 gap-y-0.5 mb-1.5">
                  <p className="capitalize tracking-wide text-gray-500 font-medium">
                    {msg.subject}
                  </p>
                  <p className="text-xs text-primary-200 font-medium whitespace-nowrap">
                    {formatDate(msg.date)}
                  </p>
                </div>

                <p className="text-gray-500 font-light">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>

        <div
          id="new-message"
          className="hidden xl:block bg-white rounded-md shadow border border-[#f2f2f2]"
        >
          <form
            onSubmit={handleSubmit}
            className="relative w-full max-w-md mx-auto p-6 md:px-8 xl:px-6 2xl:px-8 space-y-5 overflow-hidden"
          >
            <h2 className="text-lg font-semibold text-gray-800">Message</h2>

            {/* Recipient Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipient Type
              </label>
              <RadioGroup
                value={recipientType}
                onValueChange={(value) => {
                  setRecipientType(value as 'team' | 'customer');
                  setSelectedRecipient('');
                }}
                className="flex gap-8"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="team" id="team-main" />
                  <label
                    htmlFor="team-main"
                    className="text-sm font-medium text-gray-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Team Member
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="customer" id="customer-main" />
                  <label
                    htmlFor="customer-main"
                    className="text-sm font-medium text-gray-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Customer
                  </label>
                </div>
              </RadioGroup>
            </div>

            {/* Recipient Selection */}
            <SearchableDropdown
              label="Select Recipient"
              options={[
                ...(recipientType === 'team' ? teamMembers : customers).map(
                  (recipient) => ({
                    label: recipient.name,
                    value: recipient.id.toString(),
                  })
                ),
              ]}
              selectedValue={selectedRecipient}
              onChange={(value) => setSelectedRecipient(value)}
              placeholder="Select a recipient"
            />

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
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full border border-gray-100 rounded-md shadow-sm px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-primary-200 focus:border-primary-200"
                placeholder="Enter subject"
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
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border border-gray-100 rounded-md shadow-sm px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-primary-200 focus:border-primary-200"
                placeholder="Enter message"
              ></textarea>
              <button
                type="submit"
                disabled={!isFormValid}
                className="w-full px-6 py-2 mt-6 text-sm font-medium text-white bg-secondary-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* New Message Modal for mobile/tablet */}
      <NewMessageModal
        isOpen={isNewMessageModalOpen}
        onClose={() => setIsNewMessageModalOpen(false)}
      />
    </div>
  );
}
