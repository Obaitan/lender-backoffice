import { columns } from '@/components/notifications/setupColumns';
import { DataTable } from '@/components/notifications/setupDataTable';

export default async function MessageSetupPage() {
  const messageTypes = [
    {
      title: 'Loan Application Approved',
      message:
        'Congratulations! Your loan application has been approved. The funds will be disbursed to your account within 24-48 hours. Please contact support on 0806 345 9102 to stop the loan disbursement if it is no longer needed.',
      createdByName: 'Adebayo Michael',
      createdByEmail: 'adebayo.michael@paylaterhub.co',
      createdAt: '2024-01-15 09:00:00',
      status: 'Active',
    },
    {
      title: 'Payment Due Reminder',
      message:
        'Your loan payment of {amount} is due in {days} days. Please ensure sufficient funds are available in your account to avoid any late payment charges.',
      createdByName: 'Shola Adamu',
      createdByEmail: 'shola.adamu@paylaterhub.co',
      createdAt: '2024-01-15 09:00:00',
      status: 'Active',
    },
    {
      title: 'Payment Received',
      message:
        'We have received your payment of {amount}. Your next payment of {nextAmount} is due on {dueDate}. Thank you for your prompt payment.',
      createdByName: 'Odey Samson',
      createdByEmail: 'oday.samson@paylaterhub.co',
      createdAt: '2024-01-15 09:00:00',
      status: 'Active',
    },
    {
      title: 'Loan Statement Available',
      message:
        'Your monthly loan statement is now available. You can view it in your dashboard or download it as a PDF. For any queries, please contact our customer service.',
      createdByName: 'Fiyin Samuel',
      createdByEmail: 'fiyin.samuel@paylaterhub.co',
      createdAt: '2024-01-15 09:00:00',
      status: 'Active',
    },
    {
      title: 'Interest Rate Update',
      message:
        'Your loan interest rate has been updated to {newRate}% APR effective from {effectiveDate}. This change will be reflected in your next payment.',
      createdByName: 'Eugene Otabor',
      createdByEmail: 'eugene.otabor@paylaterhub.co',
      createdAt: '2024-01-15 09:00:00',
      status: 'Active',
    },
  ];

  return (
    <div className="2xl:px-2 mt-8">
      <DataTable columns={columns} data={messageTypes} />
    </div>
  );
}
