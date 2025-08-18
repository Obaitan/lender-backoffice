import { ReactNode } from 'react';
import { Metadata } from 'next';
import { PageTab } from '@/components/navigation/PageTab';

export const metadata: Metadata = {
  title: 'Notifications',
};

export default async function NotificationsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const NotificationPageTabs = [
    { label: 'Received', url: 'received' },
    { label: 'Sent', url: 'sent' },
    { label: 'Setup', url: 'setup' },
  ];
  return (
    <>
      <PageTab pageTitle="Notifications" tabs={NotificationPageTabs} />
      <div className="mt-8">{children}</div>
    </>
  );
}
