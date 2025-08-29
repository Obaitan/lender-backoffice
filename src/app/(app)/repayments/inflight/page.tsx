
import { columns } from '@/components/repayments/RepaymentsColumns';
import { RepaymentsDataTable } from '@/components/repayments/RepaymentsDataTable';
import { Repayment } from '@/types';

export default async function InflightRepaymentsPage() {
  const inflightRepayments: Repayment[] = [
    {
      repaymentId: 1,
      loanNumber: 'LN-2024-004',
      repaymentNumber: '3',
      principalAmount: 80000,
      interestAmount: 8000,
      lateFee: 0,
      amount: 88000,
      outstandingAmount: 88000,
      amountPaid: 0,
      dueDate: '2024-04-15',
      repaymentDate: '',
      createDate: '2024-03-15',
      status: 'Inflight',
      repaymentChannel: 'Direct Debit',
      loan: {
        id: 4,
        loanId: 4,
        loanNumber: 'LN-2024-004',
        currency: 'NGN',
        amount: 800000,
        amountPaid: 200000,
        customerID: 'CUST-004',
        customerName: 'Grace Nwosu',
        phoneNumber: '08076543210',
        email: 'grace.nwosu@email.com',
        interestRate: 12,
        interest: 96000,
        lateFee: 0,
        duration: 8,
        maturityDate: '2024-11-15',
        loanBalance: 600000,
        totalRepaymentAmount: 896000,
        installmentAmount: 112000,
        status: 'Active',
        createDate: '2024-03-15',
        vendorName: 'PayLater Hub',
        vendorID: '1011',
        zohoInvoiceID: 'ZH-INV-004',
        zohoInvoiceNo: 'INV-004',
        zohoCustomerID: 'ZH-CUST-004',
        lastModified: '2024-03-15',
        createdBy: 'system',
        lastModifiedBy: 'system'
      },
      customer: {
        customerID: 'CUST-004',
        name: 'Grace Nwosu',
        firstName: 'Grace',
        lastName: 'Nwosu',
        email: 'grace.nwosu@email.com',
        phoneNumber: '08076543210',
        gender: 'Female',
        dateOfBirth: '1985-03-18',
        maritalStatus: 'Married',
        customerStatus: 'Active',
        rmCode: 'RM004',
        address: '321 Kano Road',
        city: 'Kano',
        state: 'Kano',
        country: 'Nigeria',
        postalCode: '700001',
        landMark: 'Near Sabon Gari',
        profilePicture: {
          pictureId: 4,
          filePath: '/docs/hju.png',
          fileName: 'profile4.png',
          fileExtension: '.png',
          fileSize: 1024,
          contentType: 'image/png',
          picture: '',
          downloadUrl: '/docs/hju.png',
          lastModified: '2024-03-15'
        }
      }
    },
    {
      repaymentId: 2,
      loanNumber: 'LN-2024-005',
      repaymentNumber: '2',
      principalAmount: 60000,
      interestAmount: 6000,
      lateFee: 0,
      amount: 66000,
      outstandingAmount: 66000,
      amountPaid: 0,
      dueDate: '2024-05-01',
      repaymentDate: '',
      createDate: '2024-04-01',
      status: 'Inflight',
      repaymentChannel: 'Bank Transfer',
      loan: {
        id: 5,
        loanId: 5,
        loanNumber: 'LN-2024-005',
        currency: 'NGN',
        amount: 600000,
        amountPaid: 60000,
        customerID: 'CUST-005',
        customerName: 'David Okoro',
        phoneNumber: '08065432109',
        email: 'david.okoro@email.com',
        interestRate: 12,
        interest: 72000,
        lateFee: 0,
        duration: 10,
        maturityDate: '2024-12-01',
        loanBalance: 540000,
        totalRepaymentAmount: 672000,
        installmentAmount: 67200,
        status: 'Active',
        createDate: '2024-04-01',
        vendorName: 'PayLater Hub',
        vendorID: '1102',
        zohoInvoiceID: 'ZH-INV-005',
        zohoInvoiceNo: 'INV-005',
        zohoCustomerID: 'ZH-CUST-005',
        lastModified: '2024-04-01',
        createdBy: 'system',
        lastModifiedBy: 'system'
      },
      customer: {
        customerID: 'CUST-005',
        name: 'David Okoro',
        firstName: 'David',
        lastName: 'Okoro',
        email: 'david.okoro@email.com',
        phoneNumber: '08065432109',
        gender: 'Male',
        dateOfBirth: '1987-11-25',
        maritalStatus: 'Single',
        customerStatus: 'Active',
        rmCode: 'RM005',
        address: '654 Ibadan Street',
        city: 'Ibadan',
        state: 'Oyo',
        country: 'Nigeria',
        postalCode: '200001',
        landMark: 'Near UI',
        profilePicture: {
          pictureId: 5,
          filePath: '/docs/hju.png',
          fileName: 'profile5.png',
          fileExtension: '.png',
          fileSize: 1024,
          contentType: 'image/png',
          picture: '',
          downloadUrl: '/docs/hju.png',
          lastModified: '2024-04-01'
        }
      }
    }
  ];

  return (
    <div className="2xl:px-2 mt-8">
      <RepaymentsDataTable
        columns={columns}
        data={inflightRepayments}
        columnFileName="InflightRepaymentsColumns"
        emptyMessage="No Inflight repayments found."
      />
    </div>
  );
}
