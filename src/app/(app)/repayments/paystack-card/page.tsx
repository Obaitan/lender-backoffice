import { columns } from '@/components/repayments/RepaymentsColumns';
import { RepaymentsDataTable } from '@/components/repayments/RepaymentsDataTable';
import { Repayment } from '@/types';

export default async function PaystackCardRepaymentsPage() {

  const paystackCardRepayments: Repayment[] = [];
  return (
    <div className="2xl:px-2 mt-8">
      <RepaymentsDataTable
        columns={columns}
        data={paystackCardRepayments}
        columnFileName="PaystackCardRepaymentsColumns"
        emptyMessage="No Paystack Card repayments found."
      />
    </div>
  );
}
