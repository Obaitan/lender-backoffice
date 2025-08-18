// Dummy data for review components to replace API calls

export interface ActivityAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadDate: string;
}

export interface ExtendedActivityItem {
  id: string;
  activityType: string;
  description: string;
  createdBy: string;
  createdDate: string;
  attachments: ActivityAttachment[];
  status?: string;
  amount?: number;
  comments?: string;
}

export interface LoanDetails {
  id: string;
  customerID: string;
  loanNumber: string;
  loanAmount: number;
  adjustedLoanAmount: number;
  interestRate: number;
  loanTenure: number;
  workFlowStatus: string;
  applicationDate: string;
  disbursementDate?: string;
  repaymentAmount: number;
  outstandingAmount: number;
  nextPaymentDate?: string;
  lastPaymentDate?: string;
}

export interface SystemParameter {
  id: string;
  name: string;
  value: string;
  description: string;
  category: string;
}

// Dummy activity history data
export const dummyActivityHistory: ExtendedActivityItem[] = [
  {
    id: 'ACT-001',
    activityType: 'Application Submitted',
    description: 'Customer submitted loan application',
    createdBy: 'System',
    createdDate: '2024-01-15T10:30:00Z',
    attachments: [
      {
        id: 'ATT-001',
        fileName: 'application_form.pdf',
        fileUrl: '/docs/application_form.pdf',
        fileSize: 245760,
        uploadDate: '2024-01-15T10:30:00Z',
      },
    ],
    status: 'Completed',
  },
  {
    id: 'ACT-002',
    activityType: 'Document Verification',
    description: 'Identity documents verified successfully',
    createdBy: 'John Adebayo',
    createdDate: '2024-01-16T14:20:00Z',
    attachments: [
      {
        id: 'ATT-002',
        fileName: 'passport_copy.pdf',
        fileUrl: '/docs/passport_copy.pdf',
        fileSize: 512000,
        uploadDate: '2024-01-16T14:20:00Z',
      },
      {
        id: 'ATT-003',
        fileName: 'utility_bill.pdf',
        fileUrl: '/docs/utility_bill.pdf',
        fileSize: 320000,
        uploadDate: '2024-01-16T14:20:00Z',
      },
    ],
    status: 'Completed',
    comments: 'All documents are valid and verified',
  },
  {
    id: 'ACT-004',
    activityType: 'Loan Approval',
    description: 'Loan application approved by credit committee',
    createdBy: 'Michael Eze',
    createdDate: '2024-01-18T11:45:00Z',
    attachments: [
      {
        id: 'ATT-004',
        fileName: 'approval_letter.pdf',
        fileUrl: '/docs/approval_letter.pdf',
        fileSize: 180000,
        uploadDate: '2024-01-18T11:45:00Z',
      },
    ],
    status: 'Completed',
    amount: 500000,
    comments: 'Approved for full requested amount',
  },
  {
    id: 'ACT-005',
    activityType: 'Disbursement',
    description: 'Loan amount disbursed to customer account',
    createdBy: 'Grace Nwosu',
    createdDate: '2024-01-19T16:30:00Z',
    attachments: [
      {
        id: 'ATT-005',
        fileName: 'disbursement_receipt.pdf',
        fileUrl: '/docs/disbursement_receipt.pdf',
        fileSize: 150000,
        uploadDate: '2024-01-19T16:30:00Z',
      },
    ],
    status: 'Completed',
    amount: 500000,
    comments: 'Successfully disbursed to account ending in 1234',
  },
];

// Dummy loan details data
export const dummyLoanDetails: LoanDetails[] = [
  {
    id: 'LOAN-001',
    customerID: 'CUST-001',
    loanNumber: 'LN-2024-001',
    loanAmount: 500000,
    adjustedLoanAmount: 500000,
    interestRate: 15.5,
    loanTenure: 12,
    workFlowStatus: 'Active',
    applicationDate: '2024-01-15T10:30:00Z',
    disbursementDate: '2024-01-19T16:30:00Z',
    repaymentAmount: 550000,
    outstandingAmount: 504167,
    nextPaymentDate: '2024-03-19T00:00:00Z',
    lastPaymentDate: '2024-02-19T08:00:00Z',
  },
  {
    id: 'LOAN-002',
    customerID: 'CUST-002',
    loanNumber: 'LN-2024-002',
    loanAmount: 750000,
    adjustedLoanAmount: 750000,
    interestRate: 14.0,
    loanTenure: 18,
    workFlowStatus: 'InProgress',
    applicationDate: '2024-01-14T14:20:00Z',
    repaymentAmount: 855000,
    outstandingAmount: 750000,
  },
  {
    id: 'LOAN-003',
    customerID: 'CUST-003',
    loanNumber: 'LN-2024-003',
    loanAmount: 300000,
    adjustedLoanAmount: 300000,
    interestRate: 16.0,
    loanTenure: 6,
    workFlowStatus: 'ReadyToDisburse',
    applicationDate: '2024-01-13T09:15:00Z',
    repaymentAmount: 324000,
    outstandingAmount: 300000,
  },
];

// Dummy system parameters
export const dummySystemParameters: SystemParameter[] = [
  {
    id: 'SYS-001',
    name: 'Loan Tenure',
    value: '3,6,9,12,18,24',
    description: 'Available loan tenure options in months',
    category: 'Loan Settings',
  },
  {
    id: 'SYS-002',
    name: 'Interest Rate',
    value: '12.5-18.0',
    description: 'Interest rate range for loans',
    category: 'Loan Settings',
  },
  {
    id: 'SYS-003',
    name: 'Maximum Loan Amount',
    value: '2000000',
    description: 'Maximum loan amount that can be disbursed',
    category: 'Loan Limits',
  },
  {
    id: 'SYS-004',
    name: 'Minimum Loan Amount',
    value: '50000',
    description: 'Minimum loan amount that can be disbursed',
    category: 'Loan Limits',
  },
];

// Helper functions to get dummy data
export const getDummyActivityHistory = (
  customerID: string
): ExtendedActivityItem[] => {
  // Return all activities for demo purposes, in real scenario filter by customerID
  return dummyActivityHistory;
};

export const getDummyLoansByCustomerID = (
  customerID: string
): LoanDetails[] => {
  return dummyLoanDetails.filter((loan) => loan.customerID === customerID);
};

export const getDummySystemParameter = (
  parameterName: string
): SystemParameter | null => {
  return (
    dummySystemParameters.find((param) => param.name === parameterName) || null
  );
};

export const getDummyLoanTenureOptions = (): number[] => {
  const tenureParam = getDummySystemParameter('Loan Tenure');
  if (tenureParam) {
    return tenureParam.value
      .split(',')
      .map((tenure) => parseInt(tenure.trim()));
  }
  return [3, 6, 9, 12, 18, 24]; // fallback
};

// Mock API response functions
export const mockCreateActivity = async (
  activityData: any
): Promise<{ success: boolean; data?: any; error?: string }> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate success response
  return {
    success: true,
    data: {
      id: `ACT-${Date.now()}`,
      ...activityData,
      createdDate: new Date().toISOString(),
    },
  };
};

export const mockUpdateLoanWorkflow = async (
  loanData: any
): Promise<{ success: boolean; data?: any; error?: string }> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Simulate success response
  return {
    success: true,
    data: {
      ...loanData,
      lastModified: new Date().toISOString(),
    },
  };
};

export const mockFileUpload = async (
  fileData: FormData
): Promise<{ success: boolean; data?: any; error?: string }> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Simulate success response
  return {
    success: true,
    data: {
      id: `ATT-${Date.now()}`,
      fileName: 'uploaded_file.pdf',
      fileUrl: '/docs/uploaded_file.pdf',
      uploadDate: new Date().toISOString(),
    },
  };
};
