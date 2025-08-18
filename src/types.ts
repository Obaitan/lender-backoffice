import { ReactNode } from 'react';
import {
  ColumnDef,
  Column,
  Table,
  TableMeta,
  Row,
} from '@tanstack/react-table';

export interface RepaymentDetail {
  id?: number;
  repaymentID?: string;
  customerID: string;
  loanNumber: string;
  repaymentChannel: string;
  repaymentNumber: string;
  amount: number;
  dueDate: string;
  repaymentDate: string;
  outstandingRepayment: number;
  loanBalance: number;
  createDate?: string;
  lastModified?: string;
  createdBy?: string;
  lastModifiedBy?: string;
}

export type ItemProps = {
  icon: ReactNode;
  label: string;
  href: string;
};

export type NavLinkProps = {
  label: string;
  href: string;
  icon: ReactNode;
  onClick?: () => void;
  subMenus?: ItemProps[];
  visible?: boolean;
  moduleName?: string;
};

export interface TabHeaderProps {
  label: string;
  isActive: boolean;
  url?: string | undefined;
  onClick: () => void;
}

export interface TabComponentProps {
  pageTitle?: string;
  tabs: { label: string; content: ReactNode }[];
}

export interface TabButtonProps {
  label: string;
  url: string | undefined;
}

export interface TabPageProps {
  pageTitle?: string;
  tabs?: TabButtonProps[];
  filter?: boolean;
  appliedRange?: { from?: Date; to?: Date };
  setAppliedRange?: (range: { from?: Date; to?: Date }) => void;
}

export interface UserFormValues {
  name: string;
  email: string;
}

export interface ImageUploaderProps {
  onImageChange?: (image: File | null) => void;
}

export interface SideModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export interface TableColumn {
  key: string;
  label: string;
  render?: (
    value: string | number | boolean | Date | ReactNode | null
  ) => ReactNode;
}

export interface TableRow {
  [key: string]: string | number | boolean | Date | ReactNode | null;
}

export interface TableProps {
  columns: TableColumn[];
  data: TableRow[];
}

export interface CheckboxProps {
  id: string;
  label?: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (id: string) => void;
  color?: string;
  labelColor?: string;
  size?: string;
}

interface Option {
  value: string;
  label: string;
}

export interface SelectProps {
  options: Option[];
  selectedValue: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
  buttonStyle?: string;
  placeholder?: string;
}

export type SystemParameterProps = {
  id: number;
  name: string;
  description: string;
  inputType: {
    name: 'text' | 'text range' | 'date' | 'date range';
    values?: [
      {
        title?: string;
        quantity?: number | string;
        unit: string | undefined;
      },
      {
        title?: string;
        quantity?: number | string;
        unit: string | undefined;
      }
    ];
    value?: {
      title?: string;
      quantity?: number;
      unit: string | undefined;
    };
  };
  isActive: boolean;
};

export interface SwitchProps {
  children?: ReactNode;
  isChecked?: boolean;
  onChange?: (checked: boolean) => void;
}

export interface ChipProps {
  label: string;
  textColour: string;
  bgColour?: string;
  style?: string;
}

export interface StatusChipProps {
  [key: string]: ChipProps;
}

export interface UserResponse {
  roleCode: string;
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: string;
  rmCode: string;
  roleName: string;
  superiorOfficer: string;
  superiorOfficerRole: string;
  lastModified: string;
  status: string;
  createDate: string;
  createdBy: string;
  lastModifiedBy: string;
  profilePicture: string;
  profilePictureExtension: string;
}

export interface Users {
  id: number;
  roleId: number;
  role: {
    id: number;
    roleName: string;
    roleCode: string;
    description: string;
    status: string;
    createDate: string;
    lastModified: string;
    createdBy: string;
    lastModifiedBy: string;
    rolePermissions: [
      {
        roleId: number;
        id: 0;
        description: string;
        createDate: string;
      }
    ];
  };
  userPermissions: [
    {
      id: number;
      userId: number;
      description: string;
      createDate: string;
    }
  ];
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  roleCode: string;
  rmCode: string;
  roleName: string;
  superiorOfficer: string;
  lastModified: string;
  status: string;
  createDate: string;
  createdBy: string;
  lastModifiedBy: string;
  profilePicture: string;
  profilePictureExtension: string;
}

export interface TeamMember {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  roleCode: string;
  rmCode: string;
  roleName: string;
  superiorOfficer: string;
  lastModified: string;
  status: string;
  createDate: string;
  createdBy: string;
  lastModifiedBy: string;
  profilePicture: string;
  profilePictureExtension: string;
  lastLogin: string;
  [key: string]: unknown;
}

export interface LoginCredentials {
  email: string;
  password: string;
  twoFactorCode?: string;
  twoFactorRecoveryCode?: string;
}

export interface SendOTPPayload {
  firstName: string;
  email: string;
  phoneNumber: string;
  otp: string;
}

export interface VerifyOTPPayload {
  otp: string;
  email: string;
  phoneNumber: string;
}

export interface OTPResponse {
  otp: string;
}

export interface DataTableProps<TData extends Record<string, unknown>, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  columnFileName?: string;
}

export type Customer = {
  id: number;
  customerID: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  profilePicture?: string; // Made optional since it might not always be present
  email: string;
  gender: string;
  dateOfBirth: string;
  maritalStatus: string;
  createDate: string;
  lastModified: string;
  createdBy: string;
  lastModifiedBy: string;
  status?: string;
  rmCode?: string;
  // New fields from updated API response
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  landMark?: string;
  // Verification status fields
  firstNameVerified?: boolean;
  lastNameVerified?: boolean;
  phoneNumberVerified?: boolean;
  emailVerified?: boolean;
  genderVerified?: boolean;
  dateOfBirthVerified?: boolean;
  maritalStatusVerified?: boolean;
  // Mono integration fields
  monoUserID?: string;
  ddSyncEnabled?: boolean;
  ddSyncEnrollmentDate?: string | null;
  lastAccountDiscovery?: string | null;
  activeMandatesCount?: number;
};

// New interface for the combined customer details response
export interface CustomerDetailsResponse {
  customer: Customer;
  picture: CustomerPicture | null;
  documents: Documents[];
  employment: EmploymentData | null;
  financialData: FinancialData | null;
}

export interface CustomerTable {
  id: number;
  customerID: string;
  name: string;
  phoneNumber: string;
  email: string;
  rmCode: string;
  signUpDate: string;
  status?: string;
}

export interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export interface RoleData {
  id: number;
  roleName: string;
  roleCode: string;
  description: string;
  status: string;
  createDate: string;
  lastModified: string;
  createdBy: string;
  lastModifiedBy: string;
  [key: string]: unknown;
}

export interface TabHeaderProps {
  label: string;
  isActive: boolean;
  url?: string | undefined;
  className?: string;
  onClick: () => void;
}

export interface UserFormValues {
  name: string;
  email: string;
}

export interface ImageUploaderProps {
  onImageChange?: (image: File | null) => void;
}

export interface SideModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export interface TableColumn {
  key: string;
  label: string;
  render?: (
    value: string | number | boolean | Date | ReactNode | null
  ) => ReactNode;
}

export interface SwitchProps {
  children?: ReactNode;
  isChecked?: boolean;
  onChange?: (checked: boolean) => void;
}

export interface AuthResponse {
  token: string;
  expiresAt: string;
}

export interface CustomTableMeta<TData> extends TableMeta<TData> {
  onRowClick?: (row: Row<TData>) => void;
}

export interface LoanDetails {
  id: number;
  customerID: string;
  currency: string;
  amount: 0;
  interestRate: 0;
  phoneNumber: string;
  status: string;
  workFlowStatus: string;
  rmCode: string;
  guarantorOrgID: string;
  guarantorOrg: string;
  loanGateApprovalStatus: string;
  createDate: string;
  createdBy: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
  comment: string;
}

export interface AccountStatement {
  id: number;
  customerID: string;
  name: string;
  email: string;
  phoneNumber: string;
  dateSubmitted: string;
  status: string;
}

export interface CustomerIssues {
  id: number;
  customerID: string;
  name: string;
  email: string;
  phoneNumber: string;
  dateSubmitted: string;
}

export interface TopUp {
  id: number;
  customerID: string;
  name: string;
  email: string;
  phoneNumber: string;
  applicationDate: string;
  amount: string;
}

export interface FinancialData {
  id: number;
  nin: string;
  bvn: string;
  bank: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  phoneNumber: string;
  customerID: string;
  createDate: string;
  lastModified: string;
  createdBy: string;
  lastModifiedBy: string;
  // Verification status fields
  ninVerified?: boolean;
  bvnVerified?: boolean;
  accountNumberVerified?: boolean;
}

export interface Documents {
  id: number;
  documentTitle: string;
  document: string;
  documentExtension: string;
  phoneNumber: string;
  customerID: string;
  createDate: string;
  lastModified: string;
  createdBy: string;
  lastModifiedBy: string;
}

export interface EmploymentData {
  id: number;
  employer: string;
  employerID: string;
  employerAddress: string;
  salary: number;
  phoneNumber: string;
  customerID: string;
  createDate: string;
  lastModified: string;
  createdBy: string;
  lastModifiedBy: string;
}

export interface CustomerPicture {
  id: number;
  picture: string;
  filePath?: string;
  fileExtension: string;
  fileName: string;
  customerID: string;
  phoneNumber: string;
  createDate: string;
  lastModified: string;
  createdBy: string;
  lastModifiedBy: string;
  fileSize?: number;
  contentType?: string;
}

export interface LoanRepaymment {
  id: number;
  loanNumber: string;
  repaymentNumber: string;
  principalAmount: number;
  interestAmount: number;
  lateFee: number;
  outstandingAmount: number;
  amountPaid: number;
  dueDate: string;
  repaymentDate: string;
  createDate: string;
  status: string;
  repaymentChannel: string;
}

export interface Loan {
  amountPaid: number;
  id: number;
  customerID: string;
  loanNumber: string;
  vendorID: string;
  vendorName: string;
  customerName: string;
  phoneNumber: string;
  email: string;
  currency: string;
  amount: number;
  interestRate: number;
  duration: number;
  interest: number;
  lateFee: number;
  totalRepaymentAmount: number;
  installmentAmount: number;
  zohoInvoiceID: string;
  zohoInvoiceNo: string;
  zohoCustomerID: string;
  createDate: string;
  lastModified: string;
  createdBy: string;
  lastModifiedBy: string;
  status: string;
  repayments?: LoanRepaymment[];
  [key: string]: unknown;
}
export interface Loans {
  id: number;
  customerID: string;
  name: string;
  loanAmount: string;
  disbursementDate: string;
  tenure: number;
  paid: string;
  outstanding: string;
}

export interface FormattedLoanData {
  id: number;
  customerID: string;
  name: string;
  loanAmount: string;
  disbursementDate: string;
  tenure: number;
  paid: string;
  outstanding: string;
}

export interface InflightRecord {
  id: number;
  customerName: string;
  accountNumber: string;
  bankCode: string;
  bankName: string;
  customerID: string;
  remitaCustomerID: string;
  companyName: string;
  salaryCount: string;
  phoneNumber: string;
  createDate: string;
}

export interface InflightSalaryRecord {
  id: number;
  customerID: string;
  remitaCustomerID: string;
  amount: number;
  accountNumber: string;
  bankCode: string;
  createDate: string;
  [key: string]: unknown;
}

export interface ReviewInfoProps {
  loan: string;
  activity: string;
}

interface RepaymentLink {
  label: string;
  url: string;
  value: number;
  difference?: number;
}

export interface RepaymentTabsProps {
  pageTitle: string;
  links: RepaymentLink[];
}

export interface InflightLoanRecord {
  id: number;
  customerID: string;
  loanProvider: string;
  loanAmount: number;
  disbursementDate: string;
  loanTenure: number;
  loanBalance: number;
  status: string;
  createDate: string;
  lastModified: string;
  createdBy: string;
  lastModifiedBy: string;
  [key: string]: unknown;
}

export interface InflightMandate extends Record<string, unknown> {
  mandateRef: string;
  loanNumber: string;
  loanAmount: number;
  repaymentAmount: number;
  bankName: string;
  accountNumber: string;
  phoneNumber: string;
  createDate: string;
  status: string;
}

export interface InflightCollections {
  mandateRef: string;
  paymentRef: string;
  amount: number;
  dateNotificationSent: string;
  dateNotificationFirstSent: string;
  netSalary: number;
  totalCredit: number;
  balanceDue: number;
  zohoPaymentID: string;
}

export interface DataTableProps<TData extends Record<string, unknown>, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  columnFileName?: string;
  onRowClick?: (row: TData) => void; // Add this line to the existing interface
  emptyMessage?: string;
}

export interface RepaymentItem {
  id: number;
  customerID: string;
  repaymentID: string;
  repaymentNumber: number;
  amount: string;
  installmentNo: number;
  date: string;
  loanBalance: string;
  status: string;
  daysUntilDue?: number;
  dueDate?: string;
  channel?: string;
  rawData: RepaymentDetail;
}

export interface RepaymentTabsProps {
  pageTitle: string;
  links: RepaymentLink[];
  isLoading?: boolean;
}

export interface RecentCustomers {
  profilePix?: string;
  firstName: string;
  lastName: string;
  customerID: string;
  amount?: number;
  repayment?: number;
  repaymentChannel?: string;
  signUpTime: string;
}

export interface RawLoanData {
  loanId: number;
  loanNumber: string;
  vendorID: string;
  vendorName: string;
  currency: string;
  amount: number;
  interestRate: number;
  duration: number;
  maturityDate: string;
  interest: number;
  lateFee: number;
  totalRepaymentAmount: number;
  installmentAmount: number;
  amountPaid: number;
  outstandingAmount: number;
  zohoInvoiceID: string;
  zohoInvoiceNo: string;
  zohoCustomerID: string;
  createDate: string;
  lastModified: string;
  createdBy: string;
  lastModifiedBy: string;
  status: string;
  customer: {
    customerID: string;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    gender: string;
    dateOfBirth: string;
    maritalStatus: string;
    customerStatus: string;
    rmCode: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    landMark: string;
    profilePicture: string | null;
  };
}

// Data format expected by the DataTable
export interface FormattedLoanData {
  id: number;
  customerID: string;
  name: string;
  loanAmount: string;
  disbursementDate: string;
  tenure: number;
  paid: string;
  outstanding: string;
  loanNumber: string;

  // Additional properties that might be used in details or filtering
  phoneNumber?: string;
  email?: string;
  status?: string;

  // Original API data (for reference in details views)
  originalLoan?: RawLoanData;
}

// Types for the review panel
export interface ReviewInfoProps {
  loan: string;
  activity: string;
  customerID?: string; // Added for fetching loans
}

// Types for loan activity history
export interface ActivityItem {
  id: number;
  actionType: string;
  actionBy: string;
  role: string;
  date: string;
  comment?: string;
}

export interface NewTabButtonProps {
  label: string;
  icon: ReactNode;
  isActive: boolean;
  pendingWork: boolean;
  onClick: () => void;
}

export interface TaskBoardTab {
  label: string;
  icon: ReactNode;
  pendingWork: boolean;
  content: ReactNode;
}

export interface TaskBoardTabsProps {
  tabs: TaskBoardTab[];
}

export type TileItem = {
  href: string;
  label: string;
  icon: string;
  count: number;
  countDiff: number;
  percentageDiff: number;
};

// Add this type for PaystackCard
export type PaystackCardData = {
  nameOnCard: string;
  cardNumber: string;
  cardIssuer: string;
  cardType: string;
  expiryDate: string;
};

export interface ExportButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
  selectedCount: number;
  filename?: string;
  fileType?: 'csv' | 'pdf';
  exportSource?: 'button' | 'details';
}

export interface WacsData {
  ippis: string;
  employer: string;
}

export interface WacsMandate {
  refNumber: string;
  totalRepayment: number;
  amount: number;
  status: string;
  [key: string]: unknown;
}

export interface WacsRepayment {
  paymentRef: string;
  wacsLoanId: string;
  loanNumber: string;
  amount: number;
  datePaid: string;
  status: string;
}

export interface MonoMandate {
  mandateID: string;
  loanID: string;
  mandateAmount: number;
  bank: string;
  debitAccount: string;
  dateCreated: string;
  startDate: string;
  endDate: string;
  status: string;
  debitType: string;
  progress: number;
  [key: string]: unknown;
}

export interface MonoMandateLoan {
  loanID: string;
  amount: number;
  repaymentAmount: number;
  loanTerm: number;
  dateCreated: string;
  applicationStatus: string;
  mandates: MonoMandate[];
  [key: string]: unknown;
}

export interface MonoLinkedMandate {
  mandateID: string;
  paymentMandateID: string;
  amount: number;
  bank: string;
  debitAccount: string;
  dateCreated: string;
  status: string;
}

export interface MonoPaymentHistory {
  id: number;
  mandateID: string;
  referenceID: string;
  bank: string;
  debitAccount: string;
  amount: number;
  date: string;
  status?: string;
  transactionType?: string;
  [key: string]: string | number | undefined;
}

export interface PaystackDdDebitHistory {
  id: number;
  mandateID: string;
  referenceID: string;
  bank: string;
  debitAccount: string;
  amount: number;
  date: string;
  status: string;
  [key: string]: string | number;
}

export interface PaystackCardRepayment {
  id: number;
  loanNumber: string;
  transactionRef: string;
  paymentDescription: string;
  amount: number;
  date: string;
  method: string;
  status: string;
  [key: string]: string | number;
}

export interface CustomerData {
  customers: {
    id: number;
    customerID: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    gender: string;
    dateOfBirth: string;
    maritalStatus: string;
    createDate: string;
    lastModified: string;
    createdBy: string;
    lastModifiedBy: string;
    status: string;
    rmCode: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    landMark: string;
  };
  customerPicture: {
    id: number;
    picture: string;
    filePath: string;
    fileExtension: string;
    fileName: string;
    customerID: string;
    phoneNumber: string;
    createDate: string;
    lastModified: string;
    createdBy: string;
    lastModifiedBy: string;
    fileSize: number;
    contentType: string;
  };
  customerDocuments: Array<{
    id: number;
    documentTitle: string;
    document: string;
    filePath: string;
    documentExtension: string;
    phoneNumber: string;
    customerID: string;
    createDate: string;
    lastModified: string;
    createdBy: string;
    lastModifiedBy: string;
    fileSize: number;
    contentType: string;
    documentType: string;
  }>;
  customerFinancialData: {
    id: number;
    nin: string;
    bvn: string;
    bank: string;
    bankCode: string;
    accountNumber: string;
    accountName: string;
    phoneNumber: string;
    customerID: string;
    createDate: string;
    lastModified: string;
    createdBy: string;
    lastModifiedBy: string;
  };
  // customerEmployment: null | {
  //   // Add fields here if employment data is ever present
  // };
}

export interface CustomerRequest {
  id: number;
  customerID: string;
  customerName: string;
  email: string;
  phoneNumber: string;
  createDate: string;
  createdBy: string;
  lastModified: string;
  lastModifiedBy: string;
  requestType: string;
  amount: number;
  oldInformation: string;
  newInformation: string;
  otherIssue: string;
  status: string;
  assignedUserEmail: string;
}

export interface Loan {
  loanId: number;
  loanNumber: string;
  currency: string;
  amount: number;
  interestRate: number;
  duration: number;
  maturityDate: string;
  loanBalance: number;
  status: string;
  createDate: string;
  vendorName: string;
}

export interface RepaymentCustomer {
  customerID: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  dateOfBirth: string;
  maritalStatus: string;
  customerStatus: string;
  rmCode: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  landMark: string;
  profilePicture: {
    pictureId: number;
    filePath: string;
    fileName: string;
    fileExtension: string;
    fileSize: number;
    contentType: string;
    picture: '';
    downloadUrl: string;
    lastModified: string;
  };
}

export interface Repayment {
  repaymentId: number;
  loanNumber: string;
  repaymentNumber: string;
  principalAmount: number;
  interestAmount: number;
  lateFee: number;
  amount: number;
  outstandingAmount: number;
  amountPaid: number;
  dueDate: string;
  repaymentDate: string;
  createDate: string;
  status: string;
  repaymentChannel: string;
  loan: Loan;
  customer: RepaymentCustomer;
}

export interface LoanResponse {
  id: number;
  customerID: string;
  loanNumber: string;
  vendorID?: string;
  vendorName?: string;
  customerName: string;
  phoneNumber: string;
  email: string;
  currency?: string;
  amount: number;
  interestRate?: number;
  duration: number;
  interest: number;
  lateFee?: number;
  totalRepaymentAmount?: number;
  installmentAmount?: number;
  amountPaid: number;
  outstandingAmount?: number;
  zohoInvoiceID?: string;
  zohoInvoiceNo?: string;
  zohoCustomerID?: string;
  createDate: string;
  lastModified?: string;
  createdBy?: string;
  lastModifiedBy?: string;
  status: string;
}

export interface SelectOption {
  value: string;
  label: string;
}
