import GeneralInformation from './GeneralInfo';
import LoanHistory from './LoanHistory';
import Inflight from './Inflight';
import MonoGsm from './MonoGsm';
import PaystackDd from './PaystackDd';
import PaystackCard from './PaystackCard';
import Wacs from './Wacs';
import {
  Customer,
  FinancialData,
  EmploymentData,
  Loan,
  InflightRecord,
  InflightSalaryRecord,
  InflightLoanRecord,
  InflightMandate,
  WacsMandate,
  WacsRepayment,
  WacsData,
} from '@/types';
import { CustomerDetailsTemplate } from './CustomerDetailsTemplate';

export const CustomerTabsInfo = ({
  phoneNumber,
  customerData,
  financialData,
  employmentData,
  loanRecord,
  inflightRecord,
  inflightSalaryRecord,
  inflightLoanRecord,
  inflightMandates,
  wacsData,
  wacsMandates,
  wacsRepayments,
}: {
  phoneNumber: string;
  customerData: Customer | null;
  financialData: FinancialData | null;
  employmentData: EmploymentData | null;
  loanRecord: Loan[] | null;
  inflightRecord: InflightRecord | null;
  inflightSalaryRecord: InflightSalaryRecord[] | null;
  inflightLoanRecord: InflightLoanRecord[] | null;
  inflightMandates: InflightMandate[] | null;
  wacsData: WacsData;
  wacsMandates: WacsMandate[] | null;
  wacsRepayments: WacsRepayment[] | null;
}) => {
  const customerTabsArray = [
    {
      label: 'General Information',
      content: (
        <GeneralInformation
          phoneNumber={phoneNumber}
          customerData={customerData}
          financialData={financialData}
          employmentData={employmentData}
        />
      ),
    },
    {
      label: 'Loan History',
      content: <LoanHistory loanRecord={loanRecord} />,
    },
    {
      label: 'Inflight',
      content: (
        <Inflight
          inflightRecord={inflightRecord}
          salaryHistory={inflightSalaryRecord}
          loanHistory={inflightLoanRecord}
          inflightMandates={inflightMandates}
        />
      ),
    },
    {
      label: 'WACS',
      content: (
        <Wacs
          mandates={wacsMandates}
          repayments={wacsRepayments}
          wacsData={wacsData}
        />
      ),
    },
    { label: 'Mono GSM', content: <MonoGsm /> },
    { label: 'Paystack DD', content: <PaystackDd /> },
    { label: 'Paystack Card', content: <PaystackCard /> },
  ];

  return <CustomerDetailsTemplate tabs={customerTabsArray} />;
};
