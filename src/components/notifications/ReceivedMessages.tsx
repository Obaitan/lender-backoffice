'use client';

import { useState } from 'react';
import { Bell, BellRing } from 'lucide-react';
import { formatDate } from '@/utils/functions';
import 'react-day-picker/style.css';
import PeriodFilter from '../general/PeriodFilter';

interface Message {
  id: number;
  subject: string;
  content: string;
  date: string;
  from: string;
  read: boolean;
  expanded: boolean;
}

const initialMessages: Message[] = [
  {
    id: 1,
    subject: 'Loan Application Approved',
    content:
      'Congratulations! Your loan application has been approved. The funds will be disbursed to your account within 24-48 hours. Please contact support on 0806 345 9102 to stop the loan disbursement if it is no longer needed.',
    date: 'march 14 2025 12:34:26',
    from: 'Approval Manager',
    read: false,
    expanded: false,
  },
  {
    id: 2,
    subject: 'Payment Due Reminder',
    content:
      'Your loan payment of $500 is due in 3 days. Please ensure sufficient funds are available in your account.',
    date: 'march 12 2025 11:25:47',
    from: 'Ben Ayodele (CRO)',
    read: false,
    expanded: false,
  },
  {
    id: 3,
    subject: 'Loan Statement Available',
    content:
      'Your monthly loan statement is now available. You can view it in your dashboard or download it as a PDF.',
    date: 'march 1 2025 15:45:12',
    from: 'System Admin',
    read: false,
    expanded: false,
  },
  {
    id: 4,
    subject: 'Interest Rate Update',
    content:
      'Your loan interest rate has been updated to 5.25% APR effective from April 1, 2025. This change will be reflected in your next payment.',
    date: 'february 28 2025 14:20:33',
    from: 'System Admin',
    read: true,
    expanded: false,
  },
  {
    id: 5,
    subject: 'Early Repayment Option',
    content:
      'You are now eligible for early loan repayment. Contact our customer service to discuss the available options and potential savings.',
    date: 'february 20 2025 10:15:45',
    from: 'Customer Relations',
    read: true,
    expanded: false,
  },
  {
    id: 6,
    subject: 'Payment Received',
    content:
      'We have received your payment of $500. Your next payment of $500 is due on April 15, 2025.',
    date: 'february 24 2025 09:23:57',
    from: 'System Admin',
    read: true,
    expanded: false,
  },
];

export default function ReceivedMessagesComponent() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [appliedRange, setAppliedRange] = useState<{ from?: Date; to?: Date }>(
    {}
  );

  const toggleReadAndExpand = (id: number) => {
    setMessages(
      messages.map((msg) => (msg.id === id ? { ...msg, read: true } : msg))
    );
  };

  const unreadCount = messages.filter((msg) => !msg.read).length;

  const filteredMessages = messages.filter((msg) => {
    const msgDate = new Date(msg.date);
    if (appliedRange.from && msgDate < appliedRange.from) return false;
    if (appliedRange.to && msgDate > appliedRange.to) return false;
    return true;
  });

  return (
    <div className="grid grid-cols-1 gap-5">
      <div className="grid grid-cols-1 lg:grid-cols-10 xl:grid-cols-5 2xl:grid-cols-4 gap-x-12 2xl:gap-x-16 text-sm">
        <div className="col-span-full lg:col-span-9 xl:col-span-4 2xl:col-span-3 space-y-5">
          <div className="flex flex-wrap justify-between text-sm gap-5">
            <p className="text-gray-300">Unread ({unreadCount})</p>
            <div className="flex items-center gap-3">
              <PeriodFilter
                appliedRange={appliedRange}
                setAppliedRange={setAppliedRange}
              />
            </div>
          </div>

          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className="flex gap-3 cursor-pointer border-b border-b-gray-50 transition-all duration-300 pb-4"
              onClick={() => toggleReadAndExpand(msg.id)}
            >
              <div className="w-1/10">
                <div
                  className={`flex justify-center items-center w-9 h-9 rounded-full ${
                    msg.read
                      ? 'text-gray-200 bg-[#f9f9f9]'
                      : 'text-secondary-200 bg-secondary-50'
                  }`}
                >
                  {msg.read ? (
                    <Bell className="w-5 h-5" />
                  ) : (
                    <BellRing className="w-5 h-5" />
                  )}
                </div>
              </div>
              <div className="overflow-hidden transition-all duration-300 space-y-[3px] w-full">
                <div className="flex flex-wrap justify-between gap-x-5 gap-y-2">
                  <div className="flex flex-col">
                    <p
                      className={`capitalize tracking-wide ${
                        msg.read
                          ? 'text-gray-500 font-medium'
                          : 'text-gray-700 font-semibold'
                      }`}
                    >
                      {msg.subject}
                    </p>
                    <p className="text-xs text-gray-400">From: {msg.from}</p>
                  </div>
                  <p className="text-xs text-primary-200 font-medium whitespace-nowrap">
                    {formatDate(msg.date)}
                  </p>
                </div>

                <p
                  className={`${
                    msg.read
                      ? 'text-gray-500 font-light'
                      : 'text-gray-700 font-medium'
                  } ${!msg.read ? 'truncate' : ''}`}
                >
                  {msg.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
