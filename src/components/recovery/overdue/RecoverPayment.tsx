import { useState } from 'react';
import Image from 'next/image';
import StatusChip from '@/components/general/StatusChip';
import { Loader2 } from 'lucide-react';

// Interface for our overdue loan data
interface OverdueLoan {
  
  id: number;
  customerID: string;
  email: string;
  phoneNumber: string;
  customerName: string;
  loanID: string;
  amountDue: number;
  dateDisbursed: string;
  dueDate: string;
}

interface RecoverPaymentProps {
  loan: OverdueLoan;
  onClose: () => void;
}

const RecoverPayment = ({ loan, onClose }: RecoverPaymentProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Format currency for display
  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Handle payment recovery
  const handleRecoverPayment = async (method: string) => {
    setPaymentMethod(method);
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // In a real implementation, this would make an API call to record the payment
      // For now, we'll simulate an API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success
      setSuccessMessage(`Successfully recovered payment via ${method}`);
      
      // Close modal after a delay
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error recovering payment:', error);
      setErrorMessage('Failed to process payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

   // Default values for missing fields
   const customerName = loan.customerName || 'Customer Name';
   const phoneNumber = loan.phoneNumber || 'N/A';
   const email = loan.email || 'N/A';
   const customerSatus = '';

  return (
    <div className="grid grid-cols-1 gap-5">
      <div className="mb-2">
        <p className="font-medium text-gray-800">Recover Payment</p>
        <hr className="border-gray-50 mt-2" />
      </div>

      <div className="grid grid-cols-1 gap-y-7">
        <div className="flex flex-wrap gap-2 md:gap-3">
          <div className="relative h-12 w-12 overflow-hidden flex justify-center items-center rounded-full border border-disabled">
            <Image
              src="/images/avatar.svg"
              alt="Profile picture"
              width={100}
              height={100}
              className="object-cover"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <p className="text-gray-700 capitalize text-[15px]">
                {customerName}
              </p>
              <StatusChip status={customerSatus ? 'active' : 'pending'} />
            </div>
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-gray-600 capitalize font-medium">
              <span className="text-primary-200 ">{loan.customerID}</span>|
              <span>{phoneNumber}</span> |
              <span className="lowercase">{email}</span>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-secondary-50 py-3 px-3.5 md:px-4 text-sm text-gray-800">
            Outstanding Payment Details
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 border-b border-b-[#eee] px-3.5 py-4 md:px-4 md:py-[18px]">
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Loan ID</p>
              <p className="text-[13px] text-gray-700 uppercase">
                {loan.loanID}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Amount Due</p>
              <p className="text-[13px] text-warning-300 capitalize">
                {formatCurrency(loan.amountDue)}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Due Date</p>
              <p className="text-[13px] text-warning-300 capitalize">
                {loan.dueDate}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Date Disbursed</p>
              <p className="text-[13px] text-gray-700 capitalize">
                {loan.dateDisbursed}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-300">Days Overdue</p>
              <p className="text-[13px] text-error-300 capitalize">
                {Math.floor(
                  (new Date().getTime() - new Date(loan.dueDate).getTime()) /
                    (1000 * 60 * 60 * 24)
                )}{' '}
                days
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <div className="bg-secondary-50 py-3 px-3.5 md:px-4 text-sm text-gray-800">
            Recover Overdue Amount
          </div>
          <div className="py-3 px-3.5 md:px-4">
            <div className="bg-[#f9f9f9] text-[22px] text-gray-700 font-semibold px-4 py-2.5 text-center">
              {formatCurrency(loan.amountDue)}
            </div>

            {successMessage && (
              <div className="mt-4 p-3 bg-green-50 text-green-700 rounded">
                {successMessage}
              </div>
            )}

            {errorMessage && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded">
                {errorMessage}
              </div>
            )}

            <div className="flex flex-wrap justify-between gap-4 py-2 mt-8">
              <div className="flex gap-3.5">
                <button
                  className={`bg-white border border-[#0052ba] text-[#0052ba] text-sm font-medium w-fit px-4 flex items-center rounded-md hover:bg-[#0052ba] hover:!text-white py-2 ${
                    paymentMethod === 'Mono' && isSubmitting
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                  onClick={() => handleRecoverPayment('Mono')}
                  disabled={isSubmitting}
                >
                  {paymentMethod === 'Mono' && isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="animate-spin w-6 h-6 text-white" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    'Via Mono'
                  )}
                </button>
                <button
                  className={`bg-white border border-[#09a0d4] text-[#09a0d4] text-sm font-medium w-fit px-4 flex items-center rounded-md hover:bg-[#09a0d4] hover:!text-white py-2 ${
                    paymentMethod === 'Paystack' && isSubmitting
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                  onClick={() => handleRecoverPayment('Paystack')}
                  disabled={isSubmitting}
                >
                  {paymentMethod === 'Paystack' && isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="animate-spin w-6 h-6 text-white" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    'Via Paystack'
                  )}
                </button>
              </div>
              <button
                className="bg-secondary-200 text-white text-sm font-medium w-fit px-4 flex items-center rounded-md hover:bg-secondary-200/80 hover:!text-white py-2"
                onClick={() =>
                  (window.location.href = `/customer/${loan.customerID}`)
                }
                disabled={isSubmitting}
              >
                Contact Customer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecoverPayment;