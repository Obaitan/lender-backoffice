import { InPageTabsComponent } from '@/components/navigation/InPageTabs';
import MonoPaymentTable from '../details-tables/PaymmentHistoryTable';
import MonoMandatesTable from '../details-tables/MonoMandatesTable';
import { mandatesRecord, MonoPaymentRecord } from '@/utils/dummyData';

export default async function MonoGsm() {
  const inFlightTabs = [
    {
      label: 'Mandates',
      content: <MonoMandatesTable record={mandatesRecord} />,
    },
    {
      label: 'Payment History',
      content: <MonoPaymentTable record={MonoPaymentRecord} />,
    },
  ];

  return (
    <div className="xl:px-2">
      <div className="flex justify-end">
        <button className="bg-primary-200 text-sm font-medium text-white px-4 py-2 rounded hover:bg-opacity-90">
          New Mandate
        </button>
      </div>
      <InPageTabsComponent tabs={inFlightTabs} />
    </div>
  );
}
