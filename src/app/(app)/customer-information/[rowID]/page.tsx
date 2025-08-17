import { BackButton } from '@/components/general/BackButton';
import { CustomerTabsInfo } from '@/components/customers/info/CustomerTabsInfo';
import CustomerProfilePicture from './CustomerProfilePicture';
import ReviewPanel from '@/components/customers/review/ReviewPanel';
import CustomerActionsComponent from '@/components/customers/CustomerActions';
import CustomerDisburseFunds from './CustomerDisburseFunds';
import {
  dummyInflightMandates,
  dummyWacsMandates,
  dummyWacsRepayments,
} from '@/utils/dummyData';
import {
  getDummyCustomerByPhone,
  getDummyFinancialData,
  getDummyEmploymentData,
  getDummyLoanHistory,
  getDummyInflightRecord,
  getDummyInflightSalaryHistory,
  getDummyInflightLoanHistory,
  getDummyLoanApplication,
} from '@/utils/customerDummyData';

export default function CustomerDataPage() {
  // Use dummy static values instead of cookies
  const customerPhoneNo = '08012345678'; // Default to first dummy customer
  const customerID = 'CUST-001'; // Default to first dummy customer

  // Replace API calls with dummy data
  const customer = getDummyCustomerByPhone(customerPhoneNo);
  const customersFinancialData = getDummyFinancialData(customerPhoneNo);
  const customersEmploymentData = getDummyEmploymentData(customerPhoneNo);
  const loanHistory = getDummyLoanHistory(customerPhoneNo);
  const inflightRecord = getDummyInflightRecord(customerID);
  const inflightSalaryRecord = getDummyInflightSalaryHistory(customerID);
  const inflightLoanRecord = getDummyInflightLoanHistory(customerID);
  const loanApplication = getDummyLoanApplication(customerID);

  const reviewInformation = {
    loan: 'One',
    activity: 'Approved',
    customerID: customerID,
  };

  const approvedLoan = loanHistory?.find((loan) => loan.status === 'APPROVED');

  const disbursementData = {
    approvedAmount: approvedLoan?.amount || loanApplication?.adjusteAmount || loanApplication?.amount || 0,
    initialInterestRate: approvedLoan?.interestRate || loanApplication?.interestRate || 0,
    initialTenureMonths: approvedLoan?.duration || 0,
  };

  const wacsInformation = {
    ippis: '162762',
    employer: 'Federal Inland Revenue Service.',
  };

  return (
    <>
      <div className="pr-4">
        <div className="flex flex-wrap justify-between gap-4 w-full pb-3 border-b border-b-gray-50">
          <BackButton />
          <div className="flex flex-wrap items-center gap-2">
            <CustomerDisburseFunds
              approvedAmount={disbursementData.approvedAmount}
              initialInterestRate={disbursementData.initialInterestRate}
              initialTenureMonths={disbursementData.initialTenureMonths}
              workFlowStatus={loanApplication?.workFlowStatus || ''}
              loanApplication={loanApplication ? {
                id: loanApplication.id,
                loanApplicationNumber: loanApplication.loanApplicationNumber,
                customerID: loanApplication.customerID,
                customerName: loanApplication.customerName,
                adjusteAmount: loanApplication.adjusteAmount,
                amount: loanApplication.amount,
                interestRate: loanApplication.interestRate
              } : undefined}
            />
            <ReviewPanel reviewInfo={reviewInformation} />
            <CustomerActionsComponent />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 md:gap-3 my-7">
          <CustomerProfilePicture phoneNumber={customerPhoneNo} />
          <div className="space-y-0.5">
            <div className="flex items-center gap-3 flex-wrap">
              <p className="text-gray-700 capitalize">
                {`${customer?.firstName ?? ''} ${
                  customer?.lastName ?? ''
                }`.trim() || 'No data'}
              </p>
            </div>
            <p className="text-sm text-primary-200 font-medium capitalize">
              {customer?.customerID ?? 'No data'}
            </p>

            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-sm text-gray-600">
              <span>{customerPhoneNo || 'No data'}</span> |
              <span>{customer?.email || 'No data'}</span>
            </div>
          </div>
        </div>
        <CustomerTabsInfo
          phoneNumber={customerPhoneNo}
          inflightRecord={inflightRecord}
          customerData={customer}
          financialData={customersFinancialData}
          employmentData={customersEmploymentData}
          loanRecord={loanHistory}
          inflightSalaryRecord={inflightSalaryRecord}
          inflightLoanRecord={inflightLoanRecord}
          inflightMandates={dummyInflightMandates}
          wacsData={wacsInformation}
          wacsMandates={dummyWacsMandates}
          wacsRepayments={dummyWacsRepayments}
        />
      </div>
    </>
  );
}
