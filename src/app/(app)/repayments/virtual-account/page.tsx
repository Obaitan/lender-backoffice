import { columns } from '@/components/repayments/RepaymentsColumns';
import { RepaymentsDataTable } from '@/components/repayments/RepaymentsDataTable';
import { Repayment } from '@/types';

export default async function VirtualAccountRepaymentsPage() {
  const virtualAccountRepayments: Repayment[] = [
    {
      repaymentId: 1,
      loanNumber: 'LN-2024-006',
      repaymentNumber: '1',
      principalAmount: 50000,
      interestAmount: 5000,
      lateFee: 0,
      amount: 55000,
      outstandingAmount: 0,
      amountPaid: 55000,
      dueDate: '2024-06-15',
      repaymentDate: '2024-06-14',
      createDate: '2024-05-15',
      status: 'Paid',
      repaymentChannel: 'Virtual Account',
      loan: {
        id: 6,
        loanId: 6,
        loanNumber: 'LN-2024-006',
        currency: 'NGN',
        amount: 550000,
        amountPaid: 55000,
        customerID: 'CUST-006',
        customerName: 'Fatima Bello',
        phoneNumber: '08054321098',
        email: 'fatima.bello@email.com',
        interestRate: 12,
        interest: 66000,
        lateFee: 0,
        duration: 10,
        maturityDate: '2025-03-15',
        loanBalance: 495000,
        totalRepaymentAmount: 616000,
        installmentAmount: 61600,
        status: 'Active',
        createDate: '2024-05-15',
        vendorName: 'PayLater Hub',
        vendorID: '1205',
        zohoInvoiceID: 'ZH-INV-006',
        zohoInvoiceNo: 'INV-006',
        zohoCustomerID: 'ZH-CUST-006',
        lastModified: '2024-05-15',
        createdBy: 'system',
        lastModifiedBy: 'system'
      },
      customer: {
        customerID: 'CUST-006',
        name: 'Fatima Bello',
        firstName: 'Fatima',
        lastName: 'Bello',
        email: 'fatima.bello@email.com',
        phoneNumber: '08054321098',
        gender: 'Female',
        dateOfBirth: '1991-07-12',
        maritalStatus: 'Single',
        customerStatus: 'Active',
        rmCode: 'RM006',
        address: '987 Kaduna Street',
        city: 'Kaduna',
        state: 'Kaduna',
        country: 'Nigeria',
        postalCode: '800001',
        landMark: 'Near Ahmadu Bello Way',
        profilePicture: {
          pictureId: 6,
          filePath: '/docs/hju.png',
          fileName: 'profile6.png',
          fileExtension: '.png',
          fileSize: 1024,
          contentType: 'image/png',
          picture: '',
          downloadUrl: '/docs/hju.png',
          lastModified: '2024-05-15'
        }
      }
    },
    {
      repaymentId: 2,
      loanNumber: 'LN-2024-007',
      repaymentNumber: '2',
      principalAmount: 75000,
      interestAmount: 7500,
      lateFee: 0,
      amount: 82500,
      outstandingAmount: 0,
      amountPaid: 82500,
      dueDate: '2024-07-01',
      repaymentDate: '2024-06-30',
      createDate: '2024-06-01',
      status: 'Paid',
      repaymentChannel: 'Virtual Account',
      loan: {
        id: 7,
        loanId: 7,
        loanNumber: 'LN-2024-007',
        currency: 'NGN',
        amount: 825000,
        amountPaid: 82500,
        customerID: 'CUST-007',
        customerName: 'Ahmed Yusuf',
        phoneNumber: '08043210987',
        email: 'ahmed.yusuf@email.com',
        interestRate: 12,
        interest: 99000,
        lateFee: 0,
        duration: 12,
        maturityDate: '2025-06-01',
        loanBalance: 742500,
        totalRepaymentAmount: 924000,
        installmentAmount: 77000,
        status: 'Active',
        createDate: '2024-06-01',
        vendorName: 'PayLater Hub',
        vendorID: '1306',
        zohoInvoiceID: 'ZH-INV-007',
        zohoInvoiceNo: 'INV-007',
        zohoCustomerID: 'ZH-CUST-007',
        lastModified: '2024-06-01',
        createdBy: 'system',
        lastModifiedBy: 'system'
      },
      customer: {
        customerID: 'CUST-007',
        name: 'Ahmed Yusuf',
        firstName: 'Ahmed',
        lastName: 'Yusuf',
        email: 'ahmed.yusuf@email.com',
        phoneNumber: '08043210987',
        gender: 'Male',
        dateOfBirth: '1989-09-05',
        maritalStatus: 'Married',
        customerStatus: 'Active',
        rmCode: 'RM007',
        address: '456 Maiduguri Road',
        city: 'Maiduguri',
        state: 'Borno',
        country: 'Nigeria',
        postalCode: '600001',
        landMark: 'Near Monday Market',
        profilePicture: {
          pictureId: 7,
          filePath: '/docs/hju.png',
          fileName: 'profile7.png',
          fileExtension: '.png',
          fileSize: 1024,
          contentType: 'image/png',
          picture: '',
          downloadUrl: '/docs/hju.png',
          lastModified: '2024-06-01'
        }
      }
    }
  ];

  return (
    <div className="2xl:px-2 mt-8">
      <RepaymentsDataTable
        columns={columns}
        data={virtualAccountRepayments}
        columnFileName="VirtualAccountRepaymentsColumns"
        emptyMessage="No Virtual Account repayments found."
      />
    </div>
  );
}
