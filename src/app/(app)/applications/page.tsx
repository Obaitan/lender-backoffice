import { redirect } from 'next/navigation';

export default function ApplicationsRootPage() {
  redirect('/applications/ready');
}
