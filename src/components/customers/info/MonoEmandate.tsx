'use client';

import { useState } from 'react';
import { InPageTabsComponent } from '@/components/navigation/InPageTabs';
import MonoEmandatePaymentTable from '../details-tables/MonoEmandatePaymentTable';
import { MonoPaymentRecord } from '@/utils/dummyData';
import MonoEmandateLoanDataTable from '../details-tables/MonoEmandateLoanDataTable';
import { AuthService, API_CONFIG } from '@/services/authService';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';
import BVNVerificationModal from './BVNVerificationModal';
import { Customer, FinancialData } from '@/types';

interface MonoEmandateProps {
  customerData?: Customer | null;
  financialData?: FinancialData | null;
}

export default function MonoEmandate({ customerData, financialData }: MonoEmandateProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showBVNModal, setShowBVNModal] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');

  const inFlightTabs = [
    {
      label: 'Loans & E-Mandates',
      content: customerData?.customerID ? (
        <MonoEmandateLoanDataTable customerID={customerData.customerID} />
      ) : (
        <div className="p-6 text-center text-gray-500">
          Customer ID not available
        </div>
      ),
    },
    {
      label: 'Payment History',
      content: <MonoEmandatePaymentTable record={MonoPaymentRecord} />,
    },
  ];

  const handleGetCustomerAccounts = async () => {
    if (!customerData) {
      toast.error('Customer data not available');
      return;
    }

    if (!financialData?.bvn) {
      toast.error('Customer BVN not available. Please ensure BVN is provided.');
      return;
    }

    try {
      setIsLoading(true);

      // Check if customer already has monoUserID
      if (customerData.monoUserID) {
        toast.info('Customer already has Mono User ID. Proceeding with BVN verification...');
        await initiateBVNVerification();
        return;
      }

      // Step 1: Create Mono customer
      await createMonoCustomer();
      
    } catch (error) {
      console.error('Error in Get Customer Accounts:', error);
      toast.error('Failed to process customer accounts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const createMonoCustomer = async () => {
    if (!customerData || !financialData?.bvn) return;

    try {
      const token = await AuthService.getValidToken();
      const payload = {
        customerID: customerData.customerID,
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        email: customerData.email,
        phone: customerData.phoneNumber,
        identity: {
          type: "bvn",
          number: financialData.bvn
        }
      };

      console.log('Creating Mono customer:', payload);

      const response = await fetch(
        `${API_CONFIG.baseUrl}/api/V2/DDSync/mono/create-customer`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Create Mono customer failed:', errorText);
        throw new Error('Failed to create Mono customer');
      }

      const result = await response.json();
      console.log('Mono customer created:', result);
      
      toast.success('Mono customer created successfully!');
      
      // Refresh customer record (simulate)
      // In a real app, you'd refetch the customer data here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Proceed to BVN verification
      await initiateBVNVerification();
      
    } catch (error) {
      console.error('Error creating Mono customer:', error);
      throw error;
    }
  };

  const initiateBVNVerification = async () => {
    if (!customerData || !financialData?.bvn) return;

    try {
      const token = await AuthService.getValidToken();
      const payload = {
        customerID: customerData.customerID,
        bvn: financialData.bvn
      };

      console.log('Initiating BVN verification:', payload);

      const response = await fetch(
        `${API_CONFIG.baseUrl}/api/V2/DDSync/bvn-initiate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('BVN initiation failed:', errorText);
        throw new Error('Failed to initiate BVN verification');
      }

      const result = await response.json();
      console.log('BVN verification initiated:', result);
      
      if (result.success && result.sessionId) {
        setSessionId(result.sessionId);
        
        // Call verify OTP endpoint
        await verifyOTPMethod(result.sessionId);
        
        toast.success(result.message || 'BVN verification initiated successfully');
      } else {
        throw new Error(result.message || 'Failed to initiate BVN verification');
      }
      
    } catch (error) {
      console.error('Error initiating BVN verification:', error);
      throw error;
    }
  };

  const verifyOTPMethod = async (sessionId: string) => {
    try {
      const token = await AuthService.getValidToken();
      const payload = {
        sessionId: sessionId,
        method: "phone"
      };

      console.log('Verifying OTP method:', payload);

      const response = await fetch(
        `${API_CONFIG.baseUrl}/api/V2/DDSync/bvn-verify-otp`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OTP method verification failed:', errorText);
        throw new Error('Failed to verify OTP method');
      }

      const result = await response.json();
      console.log('OTP method verified:', result);
      
      // Open BVN verification modal
      setShowBVNModal(true);
      
    } catch (error) {
      console.error('Error verifying OTP method:', error);
      throw error;
    }
  };

  return (
    <div className="xl:px-2">
      {/* Status Section */}
      {customerData && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Mono Integration Status</h3>
              <div className="mt-2 space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-600">Mono User ID:</span>
                  {customerData.monoUserID ? (
                    <span className="text-xs font-mono bg-green-100 text-green-800 px-2 py-1 rounded">
                      {customerData.monoUserID}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-500">Not created</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-600">BVN Available:</span>
                  {financialData?.bvn ? (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Yes ({financialData.bvn.substring(0, 3)}****{financialData.bvn.substring(8)})
                    </span>
                  ) : (
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">No</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-600">DD Sync Enabled:</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    customerData.ddSyncEnabled 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {customerData.ddSyncEnabled ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <button 
                onClick={handleGetCustomerAccounts}
                disabled={isLoading || !customerData || !financialData?.bvn}
                className="bg-primary-200 text-sm font-medium text-white px-4 py-2 rounded hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Get Customer Accounts'
                )}
              </button>
            </div>
          </div>
          
          {!financialData?.bvn && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-xs text-amber-800">
                <strong>BVN Required:</strong> Customer&apos;s BVN must be available to proceed with Mono account discovery.
              </p>
            </div>
          )}
        </div>
      )}
      
      <InPageTabsComponent tabs={inFlightTabs} />
      
      {/* BVN Verification Modal */}
      <BVNVerificationModal
        isOpen={showBVNModal}
        onClose={() => setShowBVNModal(false)}
        sessionId={sessionId}
        customerData={customerData}
      />
    </div>
  );
}
