// Mono Emandate Types
export interface LoanApplication {
  id: number;
  loanApplicationNumber: string;
  customerID: string;
  customerName: string;
  currency: string;
  amount: number;
  adjusteAmount: number;
  interestRate: number;
  phoneNumber: string;
  email: string;
  status: string;
  workFlowStatus: string;
  rmCode: string;
  guarantorOrgID: string;
  guarantorOrg: string;
  loanGateApprovalStatus: string;
  createDate: string;
  approvalDate: string;
  createdBy: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
  comment: string;
  assignedUserEmail: string;
  hasBeenAbandoned: boolean;
  monthlyRepayment: number;
  installmentAmount: number;
  duration: number;
}

export interface Emandate {
  id: number;
  mandateID: string;
  accountNumber: string;
  accountName: string;
  bankName: string;
  bankCode: string;
  status: string;
  mandateAmount: number;
  totalMandateAmount: number;
  startDate: string;
  endDate: string | null;
  createDate: string;
  authorizationCode: string;
  last4Digits: string;
  readyToDebit: boolean;
  reference: string;
  source: string;
}

export interface EmandateResponse {
  success: boolean;
  message: string;
  data: {
    customerID: string;
    customerName: string;
    totalEmandates: number;
    existingEmandates: number;
    newlyAddedEmandates: number;
    emandates: Emandate[];
    processingSummary: {
      monoBankAccountsChecked: number;
      accountsAlreadyInEmandates: number;
      newAccountsAdded: number;
      processedAt: string;
    };
  };
}