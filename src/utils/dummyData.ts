export const systemAdmin = {
  name: 'Adeyemi Olayemi',
  email: 'adeyemi.olayemi@paylaterhub.co',
  role: 'Admin',
  image: '',
};

export const usersTableData = {
  columns: [
    {
      label: 'Name',
      key: 'name',
    },
    {
      label: 'Email',
      key: 'email',
    },
    {
      label: 'Phone',
      key: 'phone',
    },
    {
      label: 'Role',
      key: 'role',
    },
    {
      label: 'RM Code',
      key: 'rmcode',
    },
    {
      label: 'Supervisor',
      key: 'supervisor',
    },
    {
      label: 'Status',
      key: 'status',
    },
    {
      label: 'Actions',
      key: 'actions',
    },
  ],
  rows: [
    {
      name: 'Adeyemi Onayemi',
      email: 'adeyemi.onayemi@gmail.com',
      phone: '0809 890 2134',
      role: 'SSO',
      rmCode: '1023',
      supervisor: 'Kola Adebisi',
      status: 'active',
      actions: '',
    },
    {
      name: 'Adeyemi Onayemi',
      email: 'adeyemi.onayemi@gmail.com',
      phone: '0809 890 2134',
      role: 'CRO',
      rmCode: 1023,
      supervisor: 'Kola Adebisi',
      status: 'active',
      actions: '',
    },
    {
      name: 'Adeyemi Onayemi',
      email: 'adeyemi.onayemi@gmail.com',
      phone: '0809 890 2134',
      role: 'CAM',
      rmCode: 1023,
      supervisor: 'Kola Adebisi',
      status: 'active',
      actions: '',
    },
  ],
};

export const rolesData = {
  columns: [
    {
      label: 'Role',
      key: 'role',
    },
    {
      label: 'RM Code',
      key: 'rmcode',
    },
    {
      label: 'Description',
      key: 'description',
    },
    {
      label: 'Status',
      key: 'status',
    },
    {
      label: 'Actions',
      key: 'actions',
    },
  ],

  rows: [
    {
      role: 'SSO',
      rmCode: '1023',
      description: 'This is a default system role',
      status: 'active',
      actions: '',
    },
    {
      role: 'CRO',
      rmCode: '1024',
      description: 'This is a default system role',
      status: 'active',
      actions: '',
    },
    {
      role: 'CAM',
      rmCode: '1025',
      description: 'This is a default system role',
      status: 'active',
      actions: '',
    },
  ],
};

export const defaultSystemParameters = [
  {
    id: 1,
    name: 'Limit Amount',
    description:
      'The loan range for customers accessing loans on the platform.',
    inputType: {
      name: 'text range',
      values: [
        { title: 'Min', quantity: 40000, unit: 'NGN' },
        { title: 'Max', quantity: 2000000, unit: 'NGN' },
      ],
    },
    isActive: true,
  },

  {
    id: 2,
    name: 'Interest Rate',
    description: 'General interest rate for loans on the platform.',
    inputType: {
      name: 'text',
      value: { title: 'Rate', quantity: 0.35, unit: '%' },
    },
    isActive: true,
  },
  {
    id: 3,
    name: 'Cash Interest Rate',
    description: 'Cash withdrawal interest rate on the platform.',
    inputType: {
      name: 'text',
      value: { title: 'Rate', quantity: 2.5, unit: '%' },
    },
    isActive: true,
  },
  {
    id: 4,
    name: 'Late Fee',
    description: 'Penalty for late loan installment payment.',
    inputType: {
      name: 'text',
      value: { title: 'Rate', quantity: 0.0, unit: '%' },
    },
    isActive: true,
  },
  {
    id: 5,
    name: 'Setup Fee',
    description:
      'Cost of card tokenization and other services at the customer onboarding stage.',
    inputType: {
      name: 'text',
      value: { title: 'Amount', quantity: 2000, unit: 'NGN' },
    },
    isActive: false,
  },
];

export const applications = [
  {
    href: 'applications/incomplete-signups',
    label: 'Incomplete Sign Ups',
    icon: '/icons/signups.svg',
    count: 110,
    countDiff: 10,
    percentageDiff: 10,
  },
  {
    href: 'applications/ready',
    label: 'Ready To Disburse',
    icon: '/icons/ready.svg',
    count: 110,
    countDiff: 10,
    percentageDiff: 10,
  },
  {
    href: '/applications/in-progress',
    label: 'In-Progress',
    icon: '/icons/in-progress.svg',
    count: 80,
    countDiff: 0,
    percentageDiff: 0,
  },
  {
    href: '/applications/new',
    label: 'new',
    icon: '/icons/new.svg',
    count: 125,
    countDiff: -20,
    percentageDiff: 8,
  },
  {
    href: '/applications/approved',
    label: 'Approved',
    icon: '/icons/completed.svg',
    count: 520,
    countDiff: 100,
    percentageDiff: 15,
  },
  {
    href: '/applications/declined',
    label: 'Declined',
    icon: '/icons/returned.svg',
    count: 10,
    countDiff: -5,
    percentageDiff: 2,
  },
  {
    href: '/applications/dropped',
    label: 'Dropped',
    icon: '/icons/open.svg',
    count: 200,
    countDiff: 20,
    percentageDiff: 10,
  },
];

export const requests = [
  {
    href: 'requests/top-up',
    label: 'Top Up',
    icon: '/icons/top-up.svg',
    count: 20,
    countDiff: -2,
    percentageDiff: 10,
  },
  {
    href: '/requests/restructure-loan',
    label: 'Restructure Loan',
    icon: '/icons/restructure.svg',
    count: 78,
    countDiff: 2,
    percentageDiff: 6,
  },
  {
    href: '/requests/update',
    label: 'Information Update',
    icon: '/icons/update.svg',
    count: 58,
    countDiff: -8,
    percentageDiff: 12,
  },
  {
    href: '/requests/customer-issues',
    label: 'Customer Issues',
    icon: '/icons/issues.svg',
    count: 128,
    countDiff: 22,
    percentageDiff: 12,
  },
  {
    href: '/requests/account-statement',
    label: 'Account Statement',
    icon: '/icons/statement.svg',
    count: 110,
    countDiff: 13,
    percentageDiff: 4,
  },
];

export const recoveryData = [
  {
    href: '/recovery/overdue-payments',
    label: 'Overdue Payments',
    icon: '/icons/issues.svg',
    count: 18,
    countDiff: 4,
    percentageDiff: 2,
  },
  {
    href: '/recovery/recovered-payments',
    label: 'Recovered Payments',
    icon: '/icons/statement.svg',
    count: 12,
    countDiff: 10,
    percentageDiff: 3,
  },
];

export const summary = [
  {
    href: '/applications/open-pool',
    label: 'Open Applications',
    icon: '/icons/open.svg',
    count: 115,
    countDiff: -21,
    percentageDiff: 7,
  },
  {
    href: '/requests',
    label: 'Open Requests',
    icon: '/icons/restructure.svg',
    count: 38,
    countDiff: 4,
    percentageDiff: 6,
  },
  {
    href: '/recovery/overdue-payments',
    label: 'Overdue Payments',
    icon: '/icons/recovery.svg',
    count: 18,
    countDiff: -3,
    percentageDiff: 8,
  },
  {
    href: '/loans/overdue',
    label: 'Loans In Default',
    icon: '/icons/overdue-loan.svg',
    count: 24,
    countDiff: -2,
    percentageDiff: 6,
  },
];

export const dummyCard = {
  nameOnCard: 'Mark Adebayo Chinaka',
  cardNumber: '4567 2345 1203 3245',
  cardIssuer: 'Visa',
  cardType: 'Credit',
  expiryDate: '07 / 2025',
};

// Dummy data for InflightMandateTable and InflightCollectionsDetails
import { InflightMandate } from '@/types';

export const dummyInflightMandates: InflightMandate[] = [
  {
    mandateRef: 'MAND123456',
    loanNumber: 'LN-0001',
    loanAmount: 500000,
    repaymentAmount: 520000,
    bankName: 'First Bank',
    accountNumber: '1234567890',
    phoneNumber: '08012345678',
    createDate: '2024-05-01T10:00:00Z',
    status: 'Active',
  },
  {
    mandateRef: 'MAND654321',
    loanNumber: 'LN-0002',
    loanAmount: 300000,
    repaymentAmount: 315000,
    bankName: 'GTBank',
    accountNumber: '0987654321',
    phoneNumber: '08087654321',
    createDate: '2024-04-15T14:30:00Z',
    status: 'Inactive',
  },
];

// Dummy WACS mandates and repayments for testing
export const dummyWacsMandates = [
  {
    refNumber: 'WACS-001',
    totalRepayment: 500000,
    amount: 100000,
    status: 'Active',
  },
  {
    refNumber: 'WACS-002',
    totalRepayment: 300000,
    amount: 75000,
    status: 'Inactive',
  },
  {
    refNumber: 'WACS-003',
    totalRepayment: 200000,
    amount: 50000,
    status: 'Active',
  },
];

export const dummyWacsRepayments = [
  {
    paymentRef: 'PAY-001',
    wacsLoanId: 'WACS-001',
    loanNumber: 'LN-1001',
    amount: 25000,
    datePaid: '2024-05-01',
    status: 'Completed',
  },
  {
    paymentRef: 'PAY-002',
    wacsLoanId: 'WACS-002',
    loanNumber: 'LN-1002',
    amount: 15000,
    datePaid: '2024-05-10',
    status: 'Pending',
  },
  {
    paymentRef: 'PAY-003',
    wacsLoanId: 'WACS-003',
    loanNumber: 'LN-1003',
    amount: 20000,
    datePaid: '2024-05-15',
    status: 'Completed',
  },
];

export const mandatesRecord = [
  {
    mandateID: '1283949364859',
    loanID: 'LN-2025-011',
    mandateAmount: 30000,
    bank: 'Stanbic IBTC Bank',
    debitAccount: '1012234456',
    dateCreated: 'January 27, 2025',
    startDate: 'January 27, 2025',
    endDate: 'July 27, 2027',
    status: 'active',
    debitType: 'VARIABLE',
    progress: 15,
  },
  {
    mandateID: '1283949594338',
    loanID: 'LN-2025-012',
    mandateAmount: 20000,
    bank: 'Access Bank',
    debitAccount: '0011234509',
    dateCreated: 'January 29, 2025',
    startDate: 'January 29, 2025',
    endDate: 'July 29, 2027',
    status: 'inactive',
    debitType: 'FIXED',
    progress: 0,
  },
];

// E-mandate specific dummy data based on the image
export const monoEmandatesRecord = [
  {
    mandateID: '687a2bd74636eac',
    loanID: 'LN-2025-001',
    mandateAmount: 70070000,
    bank: 'First Bank',
    debitAccount: '3012345678',
    dateCreated: 'July 18, 2025',
    startDate: 'July 18, 2025',
    endDate: 'July 18, 2027',
    status: 'approved',
    debitType: 'VARIABLE',
    progress: 0,
  },
  {
    mandateID: '687bb8fd4f67f38',
    loanID: 'LN-2025-002',
    mandateAmount: 10000000,
    bank: 'Kuda Bank',
    debitAccount: '2011234509',
    dateCreated: 'July 17, 2025',
    startDate: 'July 17, 2025',
    endDate: 'July 31, 2025',
    status: 'approved',
    debitType: 'VARIABLE',
    progress: 15,
  },
  {
    mandateID: '687f198e463eac6',
    loanID: 'LN-2025-003',
    mandateAmount: 20020000,
    bank: 'Access Bank',
    debitAccount: '0011234509',
    dateCreated: 'July 11, 2025',
    startDate: 'July 11, 2025',
    endDate: 'July 11, 2027',
    status: 'UNAUTHORIZED',
    debitType: 'VARIABLE',
    progress: 0,
  },
  {
    mandateID: '6870fa22c3a03c6',
    loanID: 'LN-2025-004',
    mandateAmount: 30040000,
    bank: 'Polaris Bank',
    debitAccount: '3211234509',
    dateCreated: 'July 11, 2025',
    startDate: 'July 11, 2025',
    endDate: 'July 11, 2027',
    status: 'approved',
    debitType: 'VARIABLE',
    progress: 0,
  },
  {
    mandateID: '6870d4042dctf7a',
    loanID: 'LN-2025-005',
    mandateAmount: 20020000,
    bank: 'GTBank',
    debitAccount: '0123456789',
    dateCreated: 'July 11, 2025',
    startDate: 'July 11, 2025',
    endDate: 'July 11, 2027',
    status: 'cancelled',
    debitType: 'VARIABLE',
    progress: 0,
  },
  {
    mandateID: '6870d3c92dctf7a',
    loanID: 'LN-2025-006',
    mandateAmount: 20020000,
    bank: 'Zenith Bank',
    debitAccount: '3056789012',
    dateCreated: 'July 11, 2025',
    startDate: 'July 11, 2025',
    endDate: 'July 11, 2027',
    status: 'UNAUTHORIZED',
    debitType: 'VARIABLE',
    progress: 0,
  },
  {
    mandateID: '688e8558ed6880',
    loanID: 'LN-2025-007',
    mandateAmount: 252000000,
    bank: 'FCMB',
    debitAccount: '4123456789',
    dateCreated: 'July 21, 2025',
    startDate: 'July 21, 2025',
    endDate: 'July 21, 2026',
    status: 'approved',
    debitType: 'FIXED',
    progress: 0,
  },
  {
    mandateID: '688e73482c8685',
    loanID: 'LN-2025-008',
    mandateAmount: 252000000,
    bank: 'Sterling Bank',
    debitAccount: '0987654321',
    dateCreated: 'July 21, 2025',
    startDate: 'July 21, 2025',
    endDate: 'July 21, 2026',
    status: 'cancelled',
    debitType: 'FIXED',
    progress: 0,
  },
  {
    mandateID: '688e7fc47dff43b2',
    loanID: 'LN-2025-009',
    mandateAmount: 252000000,
    bank: 'UBA',
    debitAccount: '2098765432',
    dateCreated: 'July 09, 2025',
    startDate: 'July 09, 2025',
    endDate: 'July 09, 2027',
    status: 'UNAUTHORIZED',
    debitType: 'VARIABLE',
    progress: 0,
  },
  {
    mandateID: '688bca641beddle',
    loanID: 'LN-2025-010',
    mandateAmount: 26800000,
    bank: 'Wema Bank',
    debitAccount: '8012345678',
    dateCreated: 'July 07, 2025',
    startDate: 'July 07, 2025',
    endDate: 'July 07, 2027',
    status: 'approved',
    debitType: 'VARIABLE',
    progress: 0,
  },
];

export const MonoPaymentRecord = [
  {
    id: 1,
    mandateID: 'MANDATE-001',
    referenceID: 'REF-001',
    bank: 'First Bank',
    debitAccount: '1012234456',
    amount: 30000,
    date: '2024-01-27',
  },
  {
    id: 2,
    mandateID: 'MANDATE-002',
    referenceID: 'REF-002',
    bank: 'Zenith Bank',
    debitAccount: '0011234509',
    amount: 30000,
    date: '2024-01-27',
  },
];

// E-mandate payment records for the details modal
export const monoEmandatePaymentRecords = [
  {
    id: 1,
    mandateID: '687a2bd74636eac',
    referenceID: 'PAY-EMD-001',
    bank: 'First Bank',
    debitAccount: '3012345678',
    amount: 2500000,
    date: '2025-07-20',
    status: 'Successful',
    transactionType: 'E-mandate Debit',
  },
  {
    id: 2,
    mandateID: '687a2bd74636eac',
    referenceID: 'PAY-EMD-002',
    bank: 'First Bank',
    debitAccount: '3012345678',
    amount: 2500000,
    date: '2025-07-18',
    status: 'Successful',
    transactionType: 'E-mandate Debit',
  },
  {
    id: 3,
    mandateID: '687bb8fd4f67f38',
    referenceID: 'PAY-EMD-003',
    bank: 'Kuda Bank',
    debitAccount: '2011234509',
    amount: 1500000,
    date: '2025-07-17',
    status: 'Failed',
    transactionType: 'E-mandate Debit',
  },
  {
    id: 4,
    mandateID: '687f198e463eac6',
    referenceID: 'PAY-EMD-004',
    bank: 'Access Bank',
    debitAccount: '0011234509',
    amount: 1800000,
    date: '2025-07-15',
    status: 'Pending',
    transactionType: 'E-mandate Debit',
  },
  {
    id: 5,
    mandateID: '6870fa22c3a03c6',
    referenceID: 'PAY-EMD-005',
    bank: 'Polaris Bank',
    debitAccount: '3211234509',
    amount: 2200000,
    date: '2025-07-12',
    status: 'Successful',
    transactionType: 'E-mandate Debit',
  },
];

export const monoLinkedMandates = [
  {
    mandateID: 'LM-1001',
    paymentMandateID: 'PM-2001',
    amount: 15000,
    bank: 'GTBank',
    debitAccount: '0123456789',
    dateCreated: '2024-05-01',
    status: 'active',
  },
  {
    mandateID: 'LM-1002',
    paymentMandateID: 'PM-2002',
    amount: 22000,
    bank: 'UBA',
    debitAccount: '0987654321',
    dateCreated: '2024-05-03',
    status: 'inactive',
  },
  {
    mandateID: 'LM-1003',
    paymentMandateID: 'PM-2003',
    amount: 18000,
    bank: 'Access Bank',
    debitAccount: '1234509876',
    dateCreated: '2024-05-05',
    status: 'active',
  },
];

export const paystackDebitHistoryRecords = [
  {
    id: 1,
    mandateID: 'PS-MANDATE-001',
    referenceID: 'PS-REF-001',
    bank: 'Access Bank',
    debitAccount: '0123456789',
    amount: 25000,
    date: '2024-06-01',
    status: 'Successful',
  },
  {
    id: 2,
    mandateID: 'PS-MANDATE-002',
    referenceID: 'PS-REF-002',
    bank: 'GTBank',
    debitAccount: '1234567890',
    amount: 18000,
    date: '2024-06-05',
    status: 'Failed',
  },
  {
    id: 3,
    mandateID: 'PS-MANDATE-003',
    referenceID: 'PS-REF-003',
    bank: 'Zenith Bank',
    debitAccount: '0987654321',
    amount: 32000,
    date: '2024-06-10',
    status: 'Pending',
  },
];

export const paystackCardRepaymentRecords = [
  {
    id: 1,
    loanNumber: 'LN-2001',
    transactionRef: 'TRX-PS-001',
    paymentDescription: 'Loan Repayment - June',
    amount: 20000,
    date: '2024-06-01',
    method: 'Card',
    status: 'Successful',
  },
  {
    id: 2,
    loanNumber: 'LN-2002',
    transactionRef: 'TRX-PS-002',
    paymentDescription: 'Loan Repayment - June',
    amount: 15000,
    date: '2024-06-05',
    method: 'Card',
    status: 'Failed',
  },
  {
    id: 3,
    loanNumber: 'LN-2003',
    transactionRef: 'TRX-PS-003',
    paymentDescription: 'Loan Repayment - June',
    amount: 18000,
    date: '2024-06-10',
    method: 'Card',
    status: 'Pending',
  },
];

import { RepaymentItem } from '@/types';

const dummyRepaymentDetails = [
  {
    id: 1,
    repaymentID: 'RPT-1001',
    customerID: 'CUST-001',
    loanNumber: 'LN-2023-001',
    repaymentChannel: 'INFLIGHT',
    repaymentNumber: '1',
    amount: 50000,
    dueDate: '2023-10-01',
    repaymentDate: '2023-10-01',
    outstandingRepayment: 0,
    loanBalance: 150000,
    createDate: '2023-09-01',
    lastModified: '2023-10-01',
    createdBy: 'admin',
    lastModifiedBy: 'admin',
  },
  {
    id: 2,
    repaymentID: 'RPT-1002',
    customerID: 'CUST-002',
    loanNumber: 'LN-2023-002',
    repaymentChannel: 'INFLIGHT',
    repaymentNumber: '2',
    amount: 75000,
    dueDate: '2023-11-01',
    repaymentDate: '2023-11-05',
    outstandingRepayment: 5000,
    loanBalance: 100000,
    createDate: '2023-10-01',
    lastModified: '2023-11-05',
    createdBy: 'admin',
    lastModifiedBy: 'admin',
  },
  {
    id: 3,
    repaymentID: 'RPT-1003',
    customerID: 'CUST-003',
    loanNumber: 'LN-2023-003',
    repaymentChannel: 'INFLIGHT',
    repaymentNumber: '3',
    amount: 60000,
    dueDate: '2023-12-01',
    repaymentDate: '2023-12-01',
    outstandingRepayment: 0,
    loanBalance: 40000,
    createDate: '2023-11-01',
    lastModified: '2023-12-01',
    createdBy: 'admin',
    lastModifiedBy: 'admin',
  },
];

export const dummyRepayments: RepaymentItem[] = dummyRepaymentDetails.map(
  (detail, idx) => ({
    id: detail.id || idx + 1,
    customerID: detail.customerID,
    repaymentID: detail.repaymentNumber,
    repaymentNumber: parseInt(detail.repaymentNumber),
    amount: detail.amount.toLocaleString(),
    installmentNo: parseInt(detail.repaymentNumber),
    date: new Date(detail.repaymentDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    loanBalance: detail.loanBalance.toLocaleString(),
    status: detail.outstandingRepayment > 0 ? 'Outstanding' : 'Paid',
    dueDate: detail.dueDate,
    channel: detail.repaymentChannel,
    rawData: detail,
  })
);

export const monoLoanRecords = [
  {
    loanID: 'LN-2003-091',
    amount: 180000,
    repaymentAmount: 210000,
    loanTerm: 6,
    dateCreated: '2025-06-10',
    method: 'Card',
    applicationStatus: 'Pending',
    mandates: [
      {
        mandateID: '687a2bd74636eac',
        loanID: 'LN-2025-001',
        mandateAmount: 70070000,
        bank: 'First Bank',
        debitAccount: '3012345678',
        dateCreated: 'July 18, 2025',
        startDate: 'July 18, 2025',
        endDate: 'July 18, 2027',
        status: 'approved',
        debitType: 'VARIABLE',
        progress: 0,
      },
      {
        mandateID: '687bb8fd4f67f38',
        loanID: 'LN-2025-002',
        mandateAmount: 10000000,
        bank: 'Kuda Bank',
        debitAccount: '2011234509',
        dateCreated: 'July 17, 2025',
        startDate: 'July 17, 2025',
        endDate: 'July 31, 2025',
        status: 'approved',
        debitType: 'VARIABLE',
        progress: 15,
      },
    ],
  },
  {
    loanID: 'LN-2014-021',
    amount: 200000,
    repaymentAmount: 240000,
    loanTerm: 6,
    dateCreated: '2025-06-10',
    method: 'Card',
    applicationStatus: 'Pending',
    mandates: [
      {
        mandateID: '687a2bd74636eac',
        loanID: 'LN-2025-001',
        mandateAmount: 70070000,
        bank: 'First Bank',
        debitAccount: '3012345678',
        dateCreated: 'July 18, 2025',
        startDate: 'July 18, 2025',
        endDate: 'July 18, 2027',
        status: 'approved',
        debitType: 'VARIABLE',
        progress: 0,
      },
      {
        mandateID: '687bb8fd4f67f38',
        loanID: 'LN-2025-002',
        mandateAmount: 10000000,
        bank: 'Kuda Bank',
        debitAccount: '2011234509',
        dateCreated: 'July 17, 2025',
        startDate: 'July 17, 2025',
        endDate: 'July 31, 2025',
        status: 'approved',
        debitType: 'VARIABLE',
        progress: 15,
      },
    ],
  },
];

// Dummy MonoMandateLoan records for testing expandable rows
export const dummyMonoMandateLoans = [
  {
    loanID: 'LN-2025-001',
    amount: 500000,
    repaymentAmount: 520000,
    loanTerm: 6,
    dateCreated: '2025-01-15T10:00:00Z',
    applicationStatus: 'approved',
    mandates: [],
  },
  {
    loanID: 'LN-2025-002',
    amount: 300000,
    repaymentAmount: 315000,
    loanTerm: 3,
    dateCreated: '2025-01-10T14:30:00Z',
    applicationStatus: 'approved',
    mandates: [],
  },
  {
    loanID: 'LN-2025-003',
    amount: 750000,
    repaymentAmount: 780000,
    loanTerm: 12,
    dateCreated: '2025-01-08T09:15:00Z',
    applicationStatus: 'pending',
    mandates: [],
  },
  {
    loanID: 'LN-2025-004',
    amount: 200000,
    repaymentAmount: 210000,
    loanTerm: 4,
    dateCreated: '2025-01-05T16:45:00Z',
    applicationStatus: 'approved',
    mandates: [],
  },
  {
    loanID: 'LN-2025-005',
    amount: 1000000,
    repaymentAmount: 1050000,
    loanTerm: 18,
    dateCreated: '2025-01-03T11:20:00Z',
    applicationStatus: 'declined',
    mandates: [],
  },
];

// Dummy MonoMandate records that correspond to the loans above
export const dummyMonoMandatesForLoans = [
  // Mandates for LN-2025-001
  {
    mandateID: '687a2bd74636eac',
    loanID: 'LN-2025-001',
    mandateAmount: 520000,
    bank: 'First Bank',
    debitAccount: '3012345678',
    dateCreated: '2025-01-15T10:30:00Z',
    startDate: '2025-01-15T10:30:00Z',
    endDate: '2025-07-15T10:30:00Z',
    status: 'approved',
    debitType: 'VARIABLE',
    progress: 25,
  },
  {
    mandateID: '687a2bd74636eac2',
    loanID: 'LN-2025-001',
    mandateAmount: 260000,
    bank: 'GTBank',
    debitAccount: '0123456789',
    dateCreated: '2025-01-16T14:00:00Z',
    startDate: '2025-01-16T14:00:00Z',
    endDate: '2025-07-16T14:00:00Z',
    status: 'approved',
    debitType: 'FIXED',
    progress: 10,
  },

  // Mandates for LN-2025-002
  {
    mandateID: '687bb8fd4f67f38',
    loanID: 'LN-2025-001',
    mandateAmount: 315000,
    bank: 'Kuda Bank',
    debitAccount: '2011234509',
    dateCreated: '2025-01-10T15:00:00Z',
    startDate: '2025-01-10T15:00:00Z',
    endDate: '2025-04-10T15:00:00Z',
    status: 'approved',
    debitType: 'VARIABLE',
    progress: 40,
  },

  // Mandates for LN-2025-003 (pending loan - no mandates yet)

  // Mandates for LN-2025-004
  {
    mandateID: '6870fa22c3a03c6',
    loanID: 'LN-2025-004',
    mandateAmount: 210000,
    bank: 'Access Bank',
    debitAccount: '0011234509',
    dateCreated: '2025-01-05T17:00:00Z',
    startDate: '2025-01-05T17:00:00Z',
    endDate: '2025-05-05T17:00:00Z',
    status: 'approved',
    debitType: 'VARIABLE',
    progress: 60,
  },
  {
    mandateID: '6870fa22c3a03c7',
    loanID: 'LN-2025-004',
    mandateAmount: 105000,
    bank: 'Zenith Bank',
    debitAccount: '3056789012',
    dateCreated: '2025-01-06T09:30:00Z',
    startDate: '2025-01-06T09:30:00Z',
    endDate: '2025-05-06T09:30:00Z',
    status: 'UNAUTHORIZED',
    debitType: 'FIXED',
    progress: 0,
  },

  // Mandates for LN-2025-005 (declined loan - no active mandates)
  {
    mandateID: '6870d4042dctf7a',
    loanID: 'LN-2025-005',
    mandateAmount: 1050000,
    bank: 'Sterling Bank',
    debitAccount: '0987654321',
    dateCreated: '2025-01-03T12:00:00Z',
    startDate: '2025-01-03T12:00:00Z',
    endDate: '2025-07-03T12:00:00Z',
    status: 'cancelled',
    debitType: 'VARIABLE',
    progress: 0,
  },
];

// Dummy data for loan applications
export const dummyLoanApplications = [
  {
    id: 1,
    customerID: 'CUST-001',
    name: 'John Adebayo',
    email: 'john.adebayo@email.com',
    phoneNumber: '08012345678',
    applicationDate: '2024-01-15',
    loanAmount: '500,000.00',
    adjustedLoanAmount: '500,000.00',
    workFlowStatus: 'New',
  },
  {
    id: 2,
    customerID: 'CUST-002',
    name: 'Sarah Okafor',
    email: 'sarah.okafor@email.com',
    phoneNumber: '08087654321',
    applicationDate: '2024-01-14',
    loanAmount: '750,000.00',
    adjustedLoanAmount: '750,000.00',
    workFlowStatus: 'InProgress',
  },
  {
    id: 3,
    customerID: 'CUST-003',
    name: 'Michael Eze',
    email: 'michael.eze@email.com',
    phoneNumber: '08098765432',
    applicationDate: '2024-01-13',
    loanAmount: '300,000.00',
    adjustedLoanAmount: '300,000.00',
    workFlowStatus: 'ReadyToDisburse',
  },
  {
    id: 4,
    customerID: 'CUST-004',
    name: 'Grace Nwosu',
    email: 'grace.nwosu@email.com',
    phoneNumber: '08076543210',
    applicationDate: '2024-01-12',
    loanAmount: '1,000,000.00',
    adjustedLoanAmount: '1,000,000.00',
    workFlowStatus: 'Approved',
  },
  {
    id: 5,
    customerID: 'CUST-005',
    name: 'David Okoro',
    email: 'david.okoro@email.com',
    phoneNumber: '08065432109',
    applicationDate: '2024-01-11',
    loanAmount: '200,000.00',
    adjustedLoanAmount: '200,000.00',
    workFlowStatus: 'Declined',
  },
  {
    id: 6,
    customerID: 'CUST-006',
    name: 'Blessing Uche',
    email: 'blessing.uche@email.com',
    phoneNumber: '08054321098',
    applicationDate: '2024-01-10',
    loanAmount: '400,000.00',
    adjustedLoanAmount: '400,000.00',
    workFlowStatus: 'Dropped',
  },
];

// Dummy data for inactive customers (incomplete signups)
export const dummyInactiveCustomers = [
  {
    id: 1,
    customerID: 'CUST-007',
    name: 'Ahmed Bello',
    phoneNumber: '08043210987',
    email: 'ahmed.bello@email.com',
    rmCode: 'RM001',
    signUpDate: '2024-01-09',
    status: 'Inactive',
  },
  {
    id: 2,
    customerID: 'CUST-008',
    name: 'Fatima Yusuf',
    phoneNumber: '08032109876',
    email: 'fatima.yusuf@email.com',
    rmCode: 'RM002',
    signUpDate: '2024-01-08',
    status: 'Inactive',
  },
];

// Dummy tab counts and trends
export const dummyTabCounts = {
  incompleteSignups: 2,
  readyToDisburse: 1,
  inProgress: 1,
  newApplications: 1,
  approved: 1,
  declined: 1,
  dropped: 1,
};

export const dummyTabTrends = {
  incompleteSignups: 0,
  readyToDisburse: 1,
  inProgress: -1,
  newApplications: 2,
  approved: 3,
  declined: -2,
  dropped: 0,
};

// Helper functions to filter dummy data by status
export const getDummyApplicationsByStatus = (status: string) => {
  return dummyLoanApplications.filter((app) => app.workFlowStatus === status);
};

// Dummy data for audit logs
export const dummyAuditLogs = [
  {
    id: 1,
    officer: 'John Adebayo',
    email: 'john.adebayo@paylaterhub.co',
    ipAddress: '192.168.1.100',
    action: 'User Login',
    comment: 'User successfully logged into the system',
    dateTime: '2024-01-20T09:15:30Z',
  },
  {
    id: 2,
    officer: 'Sarah Okafor',
    email: 'sarah.okafor@paylaterhub.co',
    ipAddress: '192.168.1.101',
    action: 'Loan Application Review',
    comment: 'Reviewed loan application CUST-001 and approved for disbursement',
    dateTime: '2024-01-20T10:30:45Z',
  },
  {
    id: 3,
    officer: 'Michael Eze',
    email: 'michael.eze@paylaterhub.co',
    ipAddress: '192.168.1.102',
    action: 'Customer Data Update',
    comment: 'Updated customer profile information for CUST-003',
    dateTime: '2024-01-20T11:45:20Z',
  },
  {
    id: 4,
    officer: 'Grace Nwosu',
    email: 'grace.nwosu@paylaterhub.co',
    ipAddress: '192.168.1.103',
    action: 'Loan Disbursement',
    comment: 'Disbursed loan amount of ₦500,000 to customer CUST-002',
    dateTime: '2024-01-20T14:20:15Z',
  },
  {
    id: 5,
    officer: 'David Okoro',
    email: 'david.okoro@paylaterhub.co',
    ipAddress: '192.168.1.104',
    action: 'System Configuration',
    comment: 'Updated system parameters for interest rates',
    dateTime: '2024-01-20T15:10:30Z',
  },
  {
    id: 6,
    officer: 'Blessing Uche',
    email: 'blessing.uche@paylaterhub.co',
    ipAddress: '192.168.1.105',
    action: 'User Management',
    comment: 'Created new user account for team member',
    dateTime: '2024-01-20T16:25:45Z',
  },
];

// Dummy data for customer documents
export const dummyCustomerDocuments = [
  {
    id: 1,
    documentTitle: 'Nigeria Passport',
    document: '/docs/Nigeria_Passport.pdf',
    documentExtension: '.pdf',
    phoneNumber: '08012345678',
    customerID: 'CUST-001',
    createDate: '2024-01-15T10:30:00Z',
    lastModified: '2024-01-15T10:30:00Z',
    createdBy: 'system',
    lastModifiedBy: 'system',
  },
  {
    id: 2,
    documentTitle: 'Drivers License',
    document: '/docs/drivers-license.pdf',
    documentExtension: '.pdf',
    phoneNumber: '08087654321',
    customerID: 'CUST-002',
    createDate: '2024-01-14T14:20:00Z',
    lastModified: '2024-01-14T14:20:00Z',
    createdBy: 'system',
    lastModifiedBy: 'system',
  },
  {
    id: 3,
    documentTitle: 'Profile Image',
    document: '/docs/hju.png',
    documentExtension: '.png',
    phoneNumber: '08098765432',
    customerID: 'CUST-003',
    createDate: '2024-01-13T09:15:00Z',
    lastModified: '2024-01-13T09:15:00Z',
    createdBy: 'system',
    lastModifiedBy: 'system',
  },
];

// Dummy data for customer pictures
export const dummyCustomerPictures = [
  {
    id: 1,
    picture: '/docs/hju.png',
    filePath: '/docs/hju.png',
    fileExtension: '.png',
    fileName: 'hju.png',
    customerID: 'CUST-001',
    phoneNumber: '08012345678',
    createDate: '2024-01-15T10:30:00Z',
    lastModified: '2024-01-15T10:30:00Z',
    createdBy: 'system',
    lastModifiedBy: 'system',
    fileSize: 1024,
    contentType: 'image/png',
  },
  {
    id: 2,
    picture: '/docs/hju.png',
    filePath: '/docs/hju.png',
    fileExtension: '.png',
    fileName: 'hju.png',
    customerID: 'CUST-002',
    phoneNumber: '08087654321',
    createDate: '2024-01-14T14:20:00Z',
    lastModified: '2024-01-14T14:20:00Z',
    createdBy: 'system',
    lastModifiedBy: 'system',
    fileSize: 1024,
    contentType: 'image/png',
  },
];

// Helper function to get customer documents by phone number
export const getDummyCustomerDocuments = (phoneNumber: string) => {
  return dummyCustomerDocuments.filter(
    (doc) => doc.phoneNumber === phoneNumber
  );
};

// Helper function to get customer picture by phone number
export const getDummyCustomerPicture = (phoneNumber: string) => {
  return (
    dummyCustomerPictures.find((pic) => pic.phoneNumber === phoneNumber) || null
  );
};
