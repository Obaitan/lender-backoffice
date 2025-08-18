'use client';

import { useState, useEffect, useCallback } from 'react';
import CustomerDocuments from '@/app/(app)/customer-information/[rowID]/CustomerDocuments';
import CustomerProfilePicture from '@/app/(app)/customer-information/[rowID]/CustomerProfilePicture';
import { Checkbox } from '@/components/ui/checkbox';
import { Customer, FinancialData, EmploymentData } from '@/types';
import { formatDate, maskMiddleDigits } from '@/utils/functions';
import FieldVerificationStatus from './FieldVerificationStatus';
import { toast } from 'react-toastify';

export default function GeneralInfo({
  phoneNumber,
  customerData,
  financialData,
  employmentData,
}: {
  phoneNumber: string;
  customerData: Customer | null;
  financialData: FinancialData | null;
  employmentData: EmploymentData | null;
}) {
  const [isVerifying, setIsVerifying] = useState(false);
  // Calculate verification data from customer data
  const calculateVerificationData = useCallback(() => {
    const verificationFields = [
      {
        field: 'firstName',
        verified: customerData?.firstNameVerified,
        label: 'First Name',
      },
      {
        field: 'lastName',
        verified: customerData?.lastNameVerified,
        label: 'Last Name',
      },
      {
        field: 'phoneNumber',
        verified: customerData?.phoneNumberVerified,
        label: 'Phone Number',
      },
      { field: 'email', verified: customerData?.emailVerified, label: 'Email' },
      {
        field: 'gender',
        verified: customerData?.genderVerified,
        label: 'Gender',
      },
      {
        field: 'dateOfBirth',
        verified: customerData?.dateOfBirthVerified,
        label: 'Date of Birth',
      },
      {
        field: 'maritalStatus',
        verified: customerData?.maritalStatusVerified,
        label: 'Marital Status',
      },
      { field: 'nin', verified: financialData?.ninVerified, label: 'NIN' },
      { field: 'bvn', verified: financialData?.bvnVerified, label: 'BVN' },
      {
        field: 'accountNumber',
        verified: financialData?.accountNumberVerified,
        label: 'Account Number',
      },
    ];

    const issues = verificationFields
      .filter((field) => field.verified === false)
      .map((field) => ({
        field: field.label,
        message: `${field.label} verification failed`,
      }));

    const verifiedCount = verificationFields.filter(
      (field) => field.verified === true
    ).length;
    const totalFields = verificationFields.length;

    return {
      issues,
      verifiedFields: verifiedCount,
      totalFields,
    };
  }, [customerData, financialData]);

  const [verificationData, setVerificationData] = useState(
    calculateVerificationData()
  );

  // Update verification data when customer data changes
  useEffect(() => {
    setVerificationData(calculateVerificationData());
  }, [customerData, financialData]);

  // Get field verification status from customer data
  const getFieldVerificationStatus = (
    field: string,
    value: string | number | null | undefined
): 'verified' | 'failed' | 'pending' | 'not_available' => {
    if (!value || value === 'No data') return 'not_available';

    // Map field names to verification status from customer data
    const verificationMap: Record<string, boolean | undefined> = {
      firstName: customerData?.firstNameVerified,
      lastName: customerData?.lastNameVerified,
      phoneNumber: customerData?.phoneNumberVerified,
      email: customerData?.emailVerified,
      gender: customerData?.genderVerified,
      dateOfBirth: customerData?.dateOfBirthVerified,
      maritalStatus: customerData?.maritalStatusVerified,
      nin: financialData?.ninVerified,
      bvn: financialData?.bvnVerified,
      accountNumber: financialData?.accountNumberVerified,
    };

    const isVerified = verificationMap[field];

    if (isVerified === true) return 'verified';
    if (isVerified === false) return 'failed';
    return 'pending';
  };

  const handleVerify = async () => {
    if (!financialData?.bvn) {
      toast.error('BVN is required for verification');
      return;
    }

    setIsVerifying(true);

    try {
      // Prepare customer data for verification
      const customerInfo = {
        customerId: customerData?.id,
        customerID: customerData?.customerID,
        firstName: customerData?.firstName,
        lastName: customerData?.lastName,
        dateOfBirth: customerData?.dateOfBirth,
        phoneNumber: phoneNumber,
        email: customerData?.email,
        gender: customerData?.gender,
        maritalStatus: customerData?.maritalStatus,
        financialData: financialData,
      };
      // Optionally refresh the verification data display
      setVerificationData(calculateVerificationData());
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-7">
      <div className="grid grid-cols-1 gap-4 border-b border-b-gray-50 pb-7">
        <div className="flex items-center gap-3 text-gray-800 font-medium">
          Personal Details <Checkbox />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-2 gap-y-5">
          <FieldVerificationStatus
            label="First Name"
            value={customerData?.firstName}
            status={getFieldVerificationStatus(
              'firstName',
              customerData?.firstName
            )}
          />
          <FieldVerificationStatus
            label="Last Name"
            value={customerData?.lastName}
            status={getFieldVerificationStatus(
              'lastName',
              customerData?.lastName
            )}
          />
          <FieldVerificationStatus
            label="Phone Number"
            value={phoneNumber}
            status={getFieldVerificationStatus('phoneNumber', phoneNumber)}
          />
          <FieldVerificationStatus
            label="Email"
            value={customerData?.email}
            status={getFieldVerificationStatus('email', customerData?.email)}
          />
          <FieldVerificationStatus
            label="Date of Birth"
            value={
              customerData?.dateOfBirth
                ? formatDate(customerData.dateOfBirth, false)
                : null
            }
            status={getFieldVerificationStatus(
              'dateOfBirth',
              customerData?.dateOfBirth
            )}
          />
          <FieldVerificationStatus
            label="Gender"
            value={customerData?.gender}
            status={getFieldVerificationStatus('gender', customerData?.gender)}
          />
          <FieldVerificationStatus
            label="Marital Status"
            value={customerData?.maritalStatus}
            status={getFieldVerificationStatus(
              'maritalStatus',
              customerData?.maritalStatus
            )}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 border-b border-b-gray-50 pb-7">
        <div className="flex items-center gap-3 text-gray-800 font-medium">
          Financial Information <Checkbox />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-2 gap-y-5">
          <FieldVerificationStatus
            label="NIN"
            value={
              financialData?.nin ? maskMiddleDigits(financialData.nin) : null
            }
            status={getFieldVerificationStatus('nin', financialData?.nin)}
          />
          <FieldVerificationStatus
            label="BVN"
            value={
              financialData?.bvn ? maskMiddleDigits(financialData.bvn) : null
            }
            status={getFieldVerificationStatus('bvn', financialData?.bvn)}
          />
          <div className="col-span-full md:col-span-1">
            <FieldVerificationStatus
              label={financialData?.bank || 'Bank Account'}
              value={
                financialData?.accountNumber && financialData?.accountName
                  ? `${maskMiddleDigits(financialData.accountNumber)}, ${
                      financialData.accountName
                    }`
                  : null
              }
              status={getFieldVerificationStatus(
                'accountNumber',
                financialData?.accountNumber
              )}
            />
          </div>
          <FieldVerificationStatus
            label="Virtual Account (Bank Name)"
            value={null}
            status="not_available"
            className="col-span-full md:col-span-1"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 border-b border-b-gray-50 pb-7">
        <div className="flex items-center gap-3 text-gray-800 font-medium">
          Documents
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 xl:grid-cols-8 gap-x-2 gap-y-6">
          <CustomerProfilePicture
            phoneNumber={phoneNumber}
            className="!w-16 !h-16 !rounded"
            selfie={true}
            bvn={financialData?.bvn}
          />
          <CustomerDocuments phoneNumber={phoneNumber} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center gap-3 text-gray-800 font-medium">
          Employment Details <Checkbox />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-2 gap-y-6">
          <FieldVerificationStatus
            label="Employer"
            value={employmentData?.employer}
            status={getFieldVerificationStatus('employer', employmentData?.employer)}
          />
          <FieldVerificationStatus
            label="Monthly Salary"
            value={
              employmentData?.salary
                ? `₦ ${employmentData.salary.toLocaleString('en-US')}`
                : null
            }
            status={getFieldVerificationStatus('salary', employmentData?.salary)}
          />
          <FieldVerificationStatus
            label="Employer Address"
            value={employmentData?.employerAddress}
            status={getFieldVerificationStatus('employerAddress', employmentData?.employerAddress)}
            className="col-span-full lg:col-span-1"
          />
        </div>
      </div>
    </div>
  );
}
