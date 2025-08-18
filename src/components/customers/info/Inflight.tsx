'use client';

import { InPageTabsComponent } from '@/components/navigation/InPageTabs';
import SalaryTable from '../details-tables/SalaryTable';
import {
  InflightRecord,
  InflightSalaryRecord,
  InflightLoanRecord,
  InflightMandate,
} from '@/types';
import LoansTable from '../details-tables/LoansTable';
import APIResponse from '../details-tables/customer-tables/other-components/APIResponse';
import InflightMandateTable from '../details-tables/InflightMandateTable';

export default function Inflight({
  inflightRecord,
  salaryHistory,
  loanHistory,
  inflightMandates,
}: {
  inflightRecord: InflightRecord | null;
  salaryHistory: InflightSalaryRecord[] | null;
  loanHistory: InflightLoanRecord[] | null;
  inflightMandates: InflightMandate[] | null;
  }) {
  
  const dummyResponse = {
    status: 'fail',
    hasData: false,
    responseId: '202412021710448/202412021710448',
    responseDate: '02-12-2024 17:10:42+0000',
    requestDate: '02-12-2024 17:10:42+0000',
    responseCode: '7808',
    responseMsg: 'Customer Is Currently Suspended',
    data: null,
  };
  
  const inFlightTabs = [
    {
      label: 'Mandates',
      content: <InflightMandateTable record={inflightMandates || []} />,
    },
    {
      label: 'Salary History',
      content: <SalaryTable record={salaryHistory || []} />,
    },
    {
      label: 'Loan Records',
      content: <LoansTable record={loanHistory || []} />,
    },
    {
      label: 'API Response',
      content: <APIResponse apiResponse={dummyResponse} />,
    },
  ];

  return (
    <>
      <div className="xl:px-2">
        <div className="grid grid-cols-1 gap-4 pb-10">
          <div className="grid grid-cols-2 md:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-8">
            <div className="space-y-1">
              <p className="text-[13px] text-gray-400">Inflight Status</p>
              <p
                className={`text-sm capitalize ${
                  inflightRecord ? 'text-success-500' : 'text-warning-300'
                }`}
              >
                {inflightRecord ? 'Active' : 'No data'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[13px] text-gray-400">Inflight Customer ID</p>
              <p className="text-sm text-gray-700 capitalize">
                {inflightRecord?.remitaCustomerID || 'No data'}
              </p>
            </div>
            <div>
              <p className="text-[13px] text-gray-400">Active Mandates</p>
              <p className="text-sm text-gray-700">
                {
                  (loanHistory || []).filter((loan) => loan.status === 'Active')
                    .length
                }
              </p>
            </div>
            <div>
              <p className="text-[13px] text-gray-400">Total Outstanding</p>
              <p className="text-sm text-gray-700">
                ₦{' '}
                {(loanHistory || [])
                  .reduce((sum, loan) => sum + loan.loanBalance, 0)
                  .toLocaleString()}
              </p>
            </div>
            <div className="space-y-1 col-span-full md:col-span-2 2xl:col-span-1">
              <p className="text-[13px] text-gray-400">Employer</p>
              <p className="text-sm text-gray-700 capitalize">
                {inflightRecord?.companyName || 'No data'}
              </p>
            </div>
          </div>
        </div>
      </div>
      <InPageTabsComponent tabs={inFlightTabs} />
    </>
  );
}
