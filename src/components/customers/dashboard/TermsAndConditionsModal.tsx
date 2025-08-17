'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/general/Button';

interface TermsAndConditionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerName?: string;
  loanDetails?: {
    amount: number;
    tenure: string;
    interestRate: number;
    totalInterest: number;
    totalAmount: number;
    monthlyPayment: number;
  };
}

export default function TermsAndConditionsModal({ 
  isOpen, 
  onClose, 
  customerName,
  loanDetails 
}: TermsAndConditionsModalProps) {
  
  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString('en-US')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Terms and Conditions</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Loan Summary Section */}
          {loanDetails && (
            <div className="bg-secondary-50 rounded-lg p-6 border border-secondary-200 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Loan Summary {customerName && <span className="text-base font-normal text-gray-700">for {customerName}</span>}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Loan Amount:</span>
                    <span className="font-semibold">{formatCurrency(loanDetails.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Loan Tenure:</span>
                    <span className="font-semibold">{loanDetails.tenure} months</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Interest Rate:</span>
                    <span className="font-semibold">{(loanDetails.interestRate * 30).toFixed(1)}% per month</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Interest:</span>
                    <span className="font-semibold">{formatCurrency(loanDetails.totalInterest)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-semibold text-lg">{formatCurrency(loanDetails.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Payment:</span>
                    <span className="font-semibold text-secondary-600 text-lg">{formatCurrency(loanDetails.monthlyPayment)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Terms Content */}
          <div className="prose prose-sm max-w-none">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Agreement Terms</h3>
            
            <section className="mb-6">
              <h4 className="font-semibold text-gray-800">1. Loan Details</h4>
              <p className="text-gray-700">
                This agreement governs the terms and conditions of the loan facility provided by Lender (&ldquo;Lender&rdquo;) to {customerName ? <strong>{customerName}</strong> : 'the borrower'} (&ldquo;Customer&rdquo;). 
                The specific loan amount, interest rate, and repayment schedule are as detailed in the loan summary above.
              </p>
            </section>

            <section className="mb-6">
              <h4 className="font-semibold text-gray-800">2. Interest and Fees</h4>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>Interest is calculated on a daily basis and displayed as a monthly rate for convenience</li>
                <li>The interest rate remains fixed throughout the loan tenure</li>
                <li>No hidden charges or processing fees</li>
                <li>Early repayment is allowed without any prepayment penalty</li>
              </ul>
            </section>

            <section className="mb-6">
              <h4 className="font-semibold text-gray-800">3. Repayment Terms</h4>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>Monthly installments are due on the same date each month</li>
                <li>Payments can be made through various channels including bank transfer, card payment, or direct debit</li>
                <li>Late payments will attract a penalty of 1% per day on the overdue amount</li>
                <li>Persistent default may result in legal action and reporting to credit bureaus</li>
              </ul>
            </section>

            <section className="mb-6">
              <h4 className="font-semibold text-gray-800">4. Borrower Obligations</h4>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>Provide accurate and complete information during application</li>
                <li>Notify the lender of any changes in contact information or employment status</li>
                <li>Maintain sufficient funds in the designated account for automatic deductions</li>
                <li>Use the loan for legitimate purposes only</li>
              </ul>
            </section>

            <section className="mb-6">
              <h4 className="font-semibold text-gray-800">5. Lender Rights</h4>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>Verify all information provided by the borrower</li>
                <li>Recover outstanding amounts through legal means if necessary</li>
                <li>Report loan performance to credit reference bureaus</li>
                <li>Modify terms with appropriate notice to the borrower</li>
              </ul>
            </section>

            <section className="mb-6">
              <h4 className="font-semibold text-gray-800">6. Data Protection and Privacy</h4>
              <p className="text-gray-700">
                Your personal information will be processed in accordance with our Privacy Policy. We are committed to protecting your data and will only use it for purposes related to this loan facility and as required by law.
              </p>
            </section>

            <section className="mb-6">
              <h4 className="font-semibold text-gray-800">7. Dispute Resolution</h4>
              <p className="text-gray-700">
                Any disputes arising from this agreement shall first be resolved through amicable discussion. If unresolved, disputes will be subject to arbitration in accordance with the laws of Nigeria.
              </p>
            </section>

            <section className="mb-6">
              <h4 className="font-semibold text-gray-800">8. Governing Law</h4>
              <p className="text-gray-700">
                This agreement shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria.
              </p>
            </section>

            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600 italic">
                By accepting these terms and conditions, {customerName ? <><strong>{customerName}</strong> acknowledges</> : 'you acknowledge'} that you have read, understood, and agree to be bound by all the terms stated herein. 
                This constitutes a legally binding agreement between {customerName ? <><strong>{customerName}</strong></> : 'you'} and Lender.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <Button
            onClick={onClose}
            className="w-full bg-secondary-200 hover:bg-secondary-300"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}