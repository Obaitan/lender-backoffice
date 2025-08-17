import { InPageTabsComponent } from '@/components/navigation/InPageTabs';
import { mandatesRecord, paystackDebitHistoryRecords } from '@/utils/dummyData';
import PaystackddMandatesTable from '../details-tables/PaystackddMandateTable';
import DebitHistoryTable from '../details-tables/DebitHistoryTable';

export default async function MonoGsm() {
  const inFlightTabs = [
    {
      label: 'Mandates',
      content: <PaystackddMandatesTable record={mandatesRecord} />,
    },
    {
      label: 'Debit History',
      content: <DebitHistoryTable record={paystackDebitHistoryRecords} />,
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
