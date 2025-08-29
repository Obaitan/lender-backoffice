import { columns } from '@/components/repayments/RepaymentsColumns';
import { RepaymentsDataTable } from '@/components/repayments/RepaymentsDataTable';
import { Repayment } from '@/types';

export default async function PaystackDdRepaymentsPage() {
  const paystackDdRepayments: Repayment[] = [];
  return (
    <div className="2xl:px-2 mt-8">
      <RepaymentsDataTable
        columns={columns}
        data={paystackDdRepayments}
        columnFileName="PaystackDdRepaymentsColumns"
        emptyMessage="No Paystack DD repayments found."
      />
    </div>
  );
}
