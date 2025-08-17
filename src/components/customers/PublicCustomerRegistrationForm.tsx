'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import validator from 'validator';
import Image from 'next/image';
import { ChevronRightIcon, ChevronLeftIcon, CheckIcon, XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/general/Button';
import OtpInput from 'react-otp-input';
import Webcam from 'react-webcam';
import { AuthService, API_CONFIG } from '@/services/authService';
import { fetchSystemParameter, INTEREST_RATE_PARAMETER_ID } from '@/services/apiQueries/systemParametersApi';

interface PayrollUnit {
  id: number;
  name: string;
  description: string;
  status: number;
  createdDate: string;
  lastModified: string;
  createdBy: string;
}

interface BVNVerificationData {
  bvn: {
    provided: string;
    verified: boolean;
  };
  firstName: {
    provided: string;
    bvnData: string;
    matches: boolean;
  };
  lastName: {
    provided: string;
    bvnData: string;
    matches: boolean;
  };
  phoneNumber: {
    provided: string;
    bvnData: string;
    matches: boolean;
  };
  dateOfBirth: {
    provided: string;
    bvnData: string;
    matches: boolean;
  };
  allMatches: boolean;
}

interface PublicCustomerFormInputs {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  gender: string;
  dateOfBirth: string;
  maritalStatus: string;
  nin: string;
  bvn: string;
  bank: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  employer: string;
  customEmployer: string;
  monthlyIncome: string;
  employerAddress: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  landMark: string;
  selfieImage: string;
  loanAmount: string;
  loanTenure: string;
  termsAccepted: boolean;
}

interface Step {
  id: number;
  title: string;
  subtitle: string;
  fields: string[];
}

const steps: Step[] = [
  {
    id: 1,
    title: "Let's start with your name",
    subtitle: "We'd love to know what to call you",
    fields: ['firstName', 'lastName']
  },
  {
    id: 2,
    title: "What's your phone number?",
    subtitle: "We'll use this to verify your identity",
    fields: ['phoneNumber']
  },
  {
    id: 3,
    title: "What's your email address?",
    subtitle: "We'll send important updates here",
    fields: ['email']
  },
  {
    id: 4,
    title: "Tell us about yourself",
    subtitle: "Help us understand you better",
    fields: ['gender', 'dateOfBirth', 'maritalStatus']
  },
   {
    id: 5,
    title: "Where do you live?",
    subtitle: "We need to know your location for our services",
    fields: ['address', 'city', 'state', 'country', 'postalCode', 'landMark']
  },
  {
    id: 6,
    title: "Financial Information",
    subtitle: "We need your bank verification number",
    fields: ['bvn']
  },
  {
    id: 7,
    title: "Banking Details",
    subtitle: "We need your banking information for our services",
    fields: ['nin', 'bank', 'bankCode', 'accountNumber', 'accountName']
  },
  {
    id: 8,
    title: "Employment Details",
    subtitle: "Tell us about your work and income",
    fields: ['employer', 'monthlyIncome', 'employerAddress']
  },
  {
    id: 9,
    title: "Identity Verification",
    subtitle: "Please take a selfie for identity verification",
    fields: ['selfieImage']
  },
  {
    id: 10,
    title: "Loan Application",
    subtitle: "Enter your loan details",
    fields: ['loanAmount', 'loanTenure', 'termsAccepted']
  },
  {
    id: 11,
    title: "Review your information",
    subtitle: "Let's make sure everything looks good",
    fields: []
  }
];

const genderOptions = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
];

const maritalStatusOptions = [
  { label: 'Single', value: 'Single' },
  { label: 'Married', value: 'Married' },
 
];


const nigerianStates = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 
  'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 
  'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT'
];

const nigerianBanks = [
  { name: 'Access Bank', code: '044' },
  { name: 'Citibank Nigeria', code: '023' },
  { name: 'Ecobank Nigeria', code: '050' },
  { name: 'Fidelity Bank', code: '070' },
  { name: 'First Bank of Nigeria', code: '011' },
  { name: 'First City Monument Bank', code: '214' },
  { name: 'Guaranty Trust Bank', code: '058' },
  { name: 'Heritage Bank', code: '030' },
  { name: 'Keystone Bank', code: '082' },
  { name: 'Polaris Bank', code: '076' },
  { name: 'Providus Bank', code: '101' },
  { name: 'Stanbic IBTC Bank', code: '221' },
  { name: 'Standard Chartered Bank', code: '068' },
  { name: 'Sterling Bank', code: '232' },
  { name: 'Union Bank of Nigeria', code: '032' },
  { name: 'United Bank For Africa', code: '033' },
  { name: 'Unity Bank', code: '215' },
  { name: 'Wema Bank', code: '035' },
  { name: 'Zenith Bank', code: '057' },
];

interface PublicCustomerRegistrationFormProps {
  onComplete?: (data: PublicCustomerFormInputs) => void;
}

const PublicCustomerRegistrationForm: React.FC<PublicCustomerRegistrationFormProps> = ({ 
  onComplete 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [currentOtpType, setCurrentOtpType] = useState<'phone' | 'email' | null>(null);
  const [duplicateCheckLoading, setDuplicateCheckLoading] = useState(false);
  const [duplicateErrors, setDuplicateErrors] = useState<{phone?: string; email?: string}>({});
  const [verifiedPhone, setVerifiedPhone] = useState<string>('');
  const [verifiedEmail, setVerifiedEmail] = useState<string>('');
  const [showSavedIndicator, setShowSavedIndicator] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [payrollUnits, setPayrollUnits] = useState<PayrollUnit[]>([]);
  const [isLoadingPayrollUnits, setIsLoadingPayrollUnits] = useState(false);
  const [bvnVerified, setBvnVerified] = useState(false);
  const [verifiedBvn, setVerifiedBvn] = useState<string>('');
  const [bvnVerifying, setBvnVerifying] = useState(false);
  const [showBvnModal, setShowBvnModal] = useState(false);
  const [bvnModalData, setBvnModalData] = useState<BVNVerificationData | null>(null);
  const [bvnError, setBvnError] = useState<string>('');
  const [capturedSelfie, setCapturedSelfie] = useState<string>('');
  const [showCamera, setShowCamera] = useState(false);
  const [customerID, setCustomerID] = useState<string>('');
  const [financialDataSaved, setFinancialDataSaved] = useState(false);
  const [employmentDataSaved, setEmploymentDataSaved] = useState(false);
  const [selfieSaved, setSelfieSaved] = useState(false);
  const [loanTenureOptions, setLoanTenureOptions] = useState<string[]>([]);
  const [defaultInterestRate, setDefaultInterestRate] = useState<number>(0.5);
  const webcamRef = useRef<Webcam>(null);
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null);
  const FORM_STORAGE_KEY = 'publicRegistrationFormData';
  const FORM_STATE_KEY = 'publicRegistrationFormState';

  // Default form values
  const defaultFormValues = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    gender: '',
    dateOfBirth: '',
    maritalStatus: '',
    nin: '',
    bvn: '',
    bank: '',
    bankCode: '',
    accountNumber: '',
    accountName: '',
    employer: '',
    customEmployer: '',
    monthlyIncome: '',
    employerAddress: '',
    address: '',
    city: '',
    state: '',
    country: 'Nigeria',
    postalCode: '',
    landMark: '',
    selfieImage: '',
    loanAmount: '',
    loanTenure: '',
    termsAccepted: false,
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    getValues,
    formState: { errors }
  } = useForm<PublicCustomerFormInputs>({
    mode: 'onChange',
    defaultValues: defaultFormValues,
  });

  // Fetch payroll units
  const fetchPayrollUnits = async () => {
    setIsLoadingPayrollUnits(true);
    try {
      // Call the external API directly using AuthService
      const response = await AuthService.makeAuthenticatedRequest(
        `${API_CONFIG.baseUrl}/api/V2/PayrollUnits/getPayrollUnits`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch payroll units: ${response.status}`);
      }
      
      const data: PayrollUnit[] = await response.json();
      
      // Filter only active payroll units (status = 1)
      const activeUnits = data.filter((unit: PayrollUnit) => unit.status === 1);
      setPayrollUnits(activeUnits);
      
    } catch (error) {
      console.error('Error fetching payroll units:', error);
      // Set empty array if fetching fails to prevent UI issues
      setPayrollUnits([]);
    } finally {
      setIsLoadingPayrollUnits(false);
    }
  };

  // Update customer data after BVN verification failure
  const updateCustomerData = async (data: PublicCustomerFormInputs) => {
    try {
      if (!customerID) {
        console.error('No customer ID available for update');
        return false;
      }

      console.log('Updating customer data with ID:', customerID);
      
      // First, get the customer data to find the numeric ID
      const token = await AuthService.getValidToken();
      const getCustomerResponse = await fetch(
        `${API_CONFIG.baseUrl}/api/V2/Customer/getCustomerByCustomerID?CustomerID=${customerID}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!getCustomerResponse.ok) {
        console.error('Failed to get customer data for update');
        return false;
      }

      const customerData = await getCustomerResponse.json();
      const numericCustomerId = customerData.customers?.id || customerData.id || customerData.customerId;

      if (!numericCustomerId) {
        console.error('Numeric customer ID not found in response:', customerData);
        return false;
      }

      console.log('Found numeric customer ID:', numericCustomerId);

      // Prepare the update payload using the existing customer data structure
      const existingCustomer = customerData.customers;
      const updatePayload = {
        id: numericCustomerId,
        customerID: customerID,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        email: data.email,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        maritalStatus: data.maritalStatus,
        createDate: existingCustomer.createDate,
        lastModified: new Date().toISOString(),
        createdBy: existingCustomer.createdBy,
        lastModifiedBy: data.email,
        status: existingCustomer.status,
        rmCode: existingCustomer.rmCode,
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        country: data.country || 'Nigeria',
        postalCode: data.postalCode || '',
        landMark: data.landMark || '',
        ddSyncEnabled: existingCustomer.ddSyncEnabled,
        monoUserID: existingCustomer.monoUserID,
        ddSyncEnrollmentDate: existingCustomer.ddSyncEnrollmentDate,
        lastAccountDiscovery: existingCustomer.lastAccountDiscovery,
        activeMandatesCount: existingCustomer.activeMandatesCount,
        // Reset verification flags since data changed, but keep verified ones if they match
        firstNameVerified: false,
        lastNameVerified: false,
        phoneNumberVerified: phoneVerified, // Keep phone verification if still valid
        emailVerified: emailVerified, // Keep email verification if still valid
        dateOfBirthVerified: false,
        genderVerified: false,
        maritalStatusVerified: false
      };

      console.log('Update payload:', JSON.stringify(updatePayload, null, 2));

      const response = await fetch(
        `${API_CONFIG.baseUrl}/api/V2/Customer/updateCustomer`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updatePayload)
        }
      );

      if (response.ok) {
        console.log('Customer data updated successfully');
        return true;
      } else {
        const errorText = await response.text();
        console.error('Failed to update customer data:', errorText);
        return false;
      }
    } catch (error) {
      console.error('Error updating customer data:', error);
      return false;
    }
  };

  // Fetch loan tenure options from system parameters
  const fetchLoanTenureOptions = async () => {
    try {
      const token = await AuthService.getValidToken();
      const response = await fetch(
        `${API_CONFIG.baseUrl}/api/V2/SystemParameter/getSystemParameterByName?name=Loan Tenure`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Loan tenure parameter response:', data);
        
        // Parse the comma-separated values
        if (data.value) {
          const tenureValues = data.value.split(',').map((v: string) => v.trim());
          setLoanTenureOptions(tenureValues);
        }
      } else {
        console.error('Failed to fetch loan tenure options:', response.statusText);
        // Fallback to default options
        setLoanTenureOptions(['3', '6', '9', '11', '12']);
      }
    } catch (error) {
      console.error('Error fetching loan tenure options:', error);
      // Fallback to default options
      setLoanTenureOptions(['3', '6', '9', '11', '12']);
    }
  };

  // Fetch default interest rate from system parameters
  const fetchDefaultInterestRate = async () => {
    try {
      const parameter = await fetchSystemParameter(INTEREST_RATE_PARAMETER_ID);
      // Use the exact value from system parameter (daily rate as percentage value)
      const dailyRate = parseFloat(parameter.value); // e.g., 0.5 (represents 0.5% daily)
      setDefaultInterestRate(dailyRate);
      console.log('Default interest rate fetched:', dailyRate);
    } catch (error) {
      console.error('Error fetching default interest rate:', error);
      // Keep default value of 0.5
      setDefaultInterestRate(0.5);
    }
  };

  // Load saved data after component mounts (client-side only)
  useEffect(() => {
    setIsHydrated(true);
    
    // Fetch payroll units, loan tenure options, and default interest rate
    fetchPayrollUnits();
    fetchLoanTenureOptions();
    fetchDefaultInterestRate();
    
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem(FORM_STORAGE_KEY);
      const savedState = localStorage.getItem(FORM_STATE_KEY);
      
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          // Update form values
          Object.keys(parsedData).forEach((key) => {
            if (parsedData[key] !== undefined && parsedData[key] !== null) {
              setValue(key as keyof PublicCustomerFormInputs, parsedData[key]);
              // Restore selfie image if it exists
              if (key === 'selfieImage' && parsedData[key]) {
                setCapturedSelfie(parsedData[key]);
              }
            }
          });
        } catch (e) {
          console.error('Error parsing saved form data:', e);
        }
      }
      
      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState);
          if (parsedState.phoneVerified) {
            setPhoneVerified(true);
            setVerifiedPhone(parsedState.verifiedPhone || '');
          }
          if (parsedState.emailVerified) {
            setEmailVerified(true);
            setVerifiedEmail(parsedState.verifiedEmail || '');
          }
          if (parsedState.completedSteps) {
            setCompletedSteps(parsedState.completedSteps);
          }
          if (parsedState.currentStep) {
            setCurrentStep(parsedState.currentStep);
          }
          if (parsedState.bvnVerified) {
            setBvnVerified(parsedState.bvnVerified);
            setVerifiedBvn(parsedState.verifiedBvn || '');
          }
          if (parsedState.customerID) {
            setCustomerID(parsedState.customerID);
          }
          if (parsedState.financialDataSaved) {
            setFinancialDataSaved(parsedState.financialDataSaved);
          }
          if (parsedState.employmentDataSaved) {
            setEmploymentDataSaved(parsedState.employmentDataSaved);
          }
          if (parsedState.selfieSaved) {
            setSelfieSaved(parsedState.selfieSaved);
          }
        } catch (e) {
          console.error('Error parsing saved form state:', e);
        }
      }
    }
  }, [setValue]);

  // Focus on first input when step changes
  useEffect(() => {
    if (inputRef.current && isHydrated) {
      inputRef.current.focus();
    }
  }, [currentStep, isHydrated]);

  // Cleanup camera stream on component unmount
  useEffect(() => {
    return () => {
      // Webcam component handles its own cleanup
      setShowCamera(false);
    };
  }, []);

  // Save form data to localStorage whenever it changes (only after hydration)
  useEffect(() => {
    if (!isHydrated) return;
    
    const subscription = watch((data) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(data));
        // Show saved indicator briefly
        setShowSavedIndicator(true);
        setTimeout(() => setShowSavedIndicator(false), 2000);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, isHydrated]);

  // Save form state (verification status, completed steps) whenever it changes (only after hydration)
  useEffect(() => {
    if (!isHydrated) return;
    
    if (typeof window !== 'undefined') {
      const formState = {
        phoneVerified,
        emailVerified,
        verifiedPhone,
        verifiedEmail,
        bvnVerified,
        verifiedBvn,
        completedSteps,
        currentStep,
        customerID,
        financialDataSaved,
        employmentDataSaved,
        selfieSaved
      };
      localStorage.setItem(FORM_STATE_KEY, JSON.stringify(formState));
    }
  }, [phoneVerified, emailVerified, verifiedPhone, verifiedEmail, bvnVerified, verifiedBvn, completedSteps, currentStep, customerID, financialDataSaved, employmentDataSaved, selfieSaved, isHydrated]);

  // Clear duplicate errors when user changes input
  const clearDuplicateError = (field: 'phone' | 'email') => {
    setDuplicateErrors(prev => ({
      ...prev,
      [field]: undefined
    }));
  };

  const handleNext = async () => {
    const currentStepFields = steps[currentStep - 1].fields;
    const isStepValid = await trigger(currentStepFields as (keyof PublicCustomerFormInputs)[]);
    
    if (isStepValid) {
      // If this is the phone number step (step 2), check for duplicates then OTP verification
      if (currentStep === 2) {
        const phoneNumber = getValues('phoneNumber');
        
        // Skip verification if phone is already verified and hasn't changed
        if (phoneVerified && phoneNumber === verifiedPhone) {
          setCompletedSteps(prev => [...prev, currentStep]);
          setCurrentStep(currentStep + 1);
          return;
        }
        
        setDuplicateCheckLoading(true);
        
        const isPhoneUnique = await checkDuplicatePhone(phoneNumber);
        setDuplicateCheckLoading(false);
        
        if (!isPhoneUnique) {
          return; // Don't proceed if phone number is duplicate
        }
        
        setCurrentOtpType('phone');
        await sendOTP();
        return;
      }
      
      // If this is the email step (step 3), check for duplicates then OTP verification
      if (currentStep === 3) {
        const email = getValues('email');
        
        // Skip verification if email is already verified and hasn't changed
        if (emailVerified && email === verifiedEmail) {
          setCompletedSteps(prev => [...prev, currentStep]);
          setCurrentStep(currentStep + 1);
          return;
        }
        
        setDuplicateCheckLoading(true);
        
        const isEmailUnique = await checkDuplicateEmail(email);
        setDuplicateCheckLoading(false);
        
        if (!isEmailUnique) {
          return; // Don't proceed if email is duplicate
        }
        
        setCurrentOtpType('email');
        await sendEmailOTP();
        return;
      }
      
      // If this is step 5 (address info), create or update the customer before proceeding to step 6
      if (currentStep === 5) {
        try {
          setIsSubmitting(true);
          
          // If we already have a customerID, update the existing customer
          if (customerID) {
            console.log('Updating existing customer with ID:', customerID);
            
            const formData = getValues();
            const updateSuccess = await updateCustomerData(formData);
            
            if (updateSuccess) {
              toast.success('Customer information updated successfully!');
              setCompletedSteps(prev => [...prev, currentStep]);
              setCurrentStep(currentStep + 1);
            } else {
              toast.error('Failed to update customer information. Please try again.');
            }
            
            setIsSubmitting(false);
            return;
          }
          
          // Otherwise, create a new customer
          console.log('Creating new customer...');
          
          // Create Customer (Basic Info from steps 1-5)
          const customerPayload = {
            firstName: getValues('firstName'),
            lastName: getValues('lastName'),
            phoneNumber: getValues('phoneNumber'),
            email: getValues('email'),
            gender: getValues('gender'),
            dateOfBirth: new Date(getValues('dateOfBirth')).toISOString().split('T')[0], // Format as YYYY-MM-DD
            maritalStatus: getValues('maritalStatus'),
            createdBy: 'public_registration',
            lastModifiedBy: 'public_registration',
            status: 'Inactive',
            address: getValues('address') || '',
            city: getValues('city') || '',
            state: getValues('state') || '',
            country: getValues('country') || 'Nigeria',
            postalCode: getValues('postalCode') || '',
            landMark: getValues('landMark') || '',
            firstNameVerified: true,
            lastNameVerified: true,
            phoneNumberVerified: phoneVerified,
            emailVerified: emailVerified,
            genderVerified: true,
            dateOfBirthVerified: true,
            maritalStatusVerified: true
          };

          const customerResponse = await AuthService.makeAuthenticatedRequest(
            `${API_CONFIG.baseUrl}/api/V2/Customer/createCustomer`,
            {
              method: 'POST',
              body: JSON.stringify(customerPayload)
            }
          );

          if (!customerResponse.ok) {
            const errorText = await customerResponse.text();
            console.error('Customer creation failed:', {
              status: customerResponse.status,
              statusText: customerResponse.statusText,
              response: errorText
            });
            throw new Error(`Failed to create customer: ${customerResponse.status} ${customerResponse.statusText}`);
          }

          const customerResult = await customerResponse.json();
          
          // Extract customerID from the response
          const newCustomerID = customerResult.customerID;
          
          if (!newCustomerID) {
            console.error('Customer ID not found in response:', customerResult);
            throw new Error('Customer ID not found in API response');
          }
          
          // Save the customerID for subsequent API calls
          setCustomerID(newCustomerID);
          
          toast.success('Basic information saved successfully!');
          setCompletedSteps(prev => [...prev, currentStep]);
          setCurrentStep(currentStep + 1);
          
        } catch (error) {
          console.error('Error creating customer:', error);
          toast.error('Failed to save customer information. Please try again.');
        } finally {
          setIsSubmitting(false);
        }
        return;
      }
      
      // If this is the BVN step (step 6), verify BVN
      if (currentStep === 6) {
        const bvn = getValues('bvn');
        
        // Validate BVN format first
        if (!bvn || !/^\d{11}$/.test(bvn)) {
          toast.error('Please enter a valid 11-digit BVN');
          return;
        }
        
        // Skip verification if BVN is already verified and hasn't changed
        if (bvnVerified && bvn === verifiedBvn) {
          setCompletedSteps(prev => [...prev, currentStep]);
          setCurrentStep(currentStep + 1);
          return;
        }
        
        // Verify BVN - this will handle the modal display and next step navigation
        await verifyBVN(bvn);
        return;
      }
      
      // If this is step 7 (banking details), save financial data before proceeding
      if (currentStep === 7) {
        if (!customerID) {
          toast.error('Customer ID not found. Please go back and complete the previous steps.');
          return;
        }
        
        try {
          setIsSubmitting(true);
          
          // Create Customer Financial Data
          const financialPayload = {
            nin: getValues('nin') || '',
            bvn: getValues('bvn'),
            bank: getValues('bank'),
            bankCode: getValues('bankCode'),
            accountNumber: getValues('accountNumber'),
            accountName: getValues('accountName'),
            phoneNumber: getValues('phoneNumber'),
            customerID: customerID,
            ninVerified: false, // NIN verification not implemented yet
            bvnVerified: bvnVerified, // Set to true if BVN was verified
            accountNumberVerified: false // Account number verification not implemented yet
          };

          const financialResponse = await AuthService.makeAuthenticatedRequest(
            `${API_CONFIG.baseUrl}/api/V2/Customer/createCustomerFinancialData`,
            {
              method: 'POST',
              body: JSON.stringify(financialPayload)
            }
          );

          if (!financialResponse.ok) {
            const errorText = await financialResponse.text();
            console.error('Financial data save failed:', {
              status: financialResponse.status,
              statusText: financialResponse.statusText,
              response: errorText
            });
            throw new Error(`Failed to save financial data: ${financialResponse.status} ${financialResponse.statusText}`);
          }

          setFinancialDataSaved(true);
          toast.success('Financial information saved successfully!');
          setCompletedSteps(prev => [...prev, currentStep]);
          setCurrentStep(currentStep + 1);
          
        } catch (error) {
          console.error('Error saving financial data:', error);
          toast.error('Failed to save financial information. Please try again.');
        } finally {
          setIsSubmitting(false);
        }
        return;
      }
      
      // If this is step 8 (employment), save employment data before proceeding
      if (currentStep === 8) {
        if (!customerID) {
          toast.error('Customer ID not found. Please go back and complete the previous steps.');
          return;
        }
        
        try {
          setIsSubmitting(true);
          
          // Create Customer Employment Data
          const employmentPayload = {
            employer: getValues('employer') === 'Other' ? getValues('customEmployer') : getValues('employer'),
            employerID: '', // This might need to be fetched from payroll units
            employerAddress: getValues('employerAddress') || '',
            phoneNumber: getValues('phoneNumber'),
            customerID: customerID,
            salary: parseFloat(getValues('monthlyIncome')) || 0
          };

          const employmentResponse = await AuthService.makeAuthenticatedRequest(
            `${API_CONFIG.baseUrl}/api/V2/Customer/createCustomerEmployment`,
            {
              method: 'POST',
              body: JSON.stringify(employmentPayload)
            }
          );

          if (!employmentResponse.ok) {
            const errorText = await employmentResponse.text();
            console.error('Employment data save failed:', {
              status: employmentResponse.status,
              statusText: employmentResponse.statusText,
              response: errorText
            });
            throw new Error(`Failed to save employment data: ${employmentResponse.status} ${employmentResponse.statusText}`);
          }

          setEmploymentDataSaved(true);
          toast.success('Employment information saved successfully!');
          setCompletedSteps(prev => [...prev, currentStep]);
          setCurrentStep(currentStep + 1);
          
        } catch (error) {
          console.error('Error saving employment data:', error);
          toast.error('Failed to save employment information. Please try again.');
        } finally {
          setIsSubmitting(false);
        }
        return;
      }
      
      // If this is the selfie step (step 9), upload selfie before proceeding
      if (currentStep === 9) {
        const selfieImage = getValues('selfieImage');
        
        if (!selfieImage || !capturedSelfie) {
          toast.error('Please take a selfie to verify your identity');
          return;
        }
        
        if (!customerID) {
          toast.error('Customer ID not found. Please go back and complete the previous steps.');
          return;
        }
        
        try {
          setIsSubmitting(true);
          
          // Upload Customer Picture
          // Convert base64 to blob
          const base64Response = await fetch(selfieImage);
          const blob = await base64Response.blob();
          
          const formData = new FormData();
          formData.append('File', blob, 'selfie.jpg');
          formData.append('CustomerID', customerID);
          formData.append('PhoneNumber', getValues('phoneNumber'));

          // For multipart/form-data, we need to get headers but not set Content-Type
          const headers = await AuthService.getAuthHeaders();
          headers.delete('Content-Type'); // Let browser set the boundary for multipart
          
          const pictureResponse = await fetch(`${API_CONFIG.baseUrl}/api/V2/Customer/uploadCustomerPicture`, {
            method: 'POST',
            headers: headers,
            body: formData
          });

          if (!pictureResponse.ok) {
            const errorText = await pictureResponse.text();
            console.error('Picture upload failed:', {
              status: pictureResponse.status,
              statusText: pictureResponse.statusText,
              response: errorText
            });
            throw new Error(`Failed to upload customer picture: ${pictureResponse.status} ${pictureResponse.statusText}`);
          }

          setSelfieSaved(true);
          toast.success('Selfie uploaded successfully!');
          setCompletedSteps(prev => [...prev, currentStep]);
          setCurrentStep(currentStep + 1);
          
        } catch (error) {
          console.error('Error uploading selfie:', error);
          toast.error('Failed to upload selfie. Please try again.');
        } finally {
          setIsSubmitting(false);
        }
        return;
      }
      
      setCompletedSteps(prev => [...prev, currentStep]);
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = async (stepNumber: number) => {
    // Allow navigation to any previous step or completed step
    if (stepNumber < currentStep || completedSteps.includes(stepNumber)) {
      setCurrentStep(stepNumber);
      return;
    }
    
    // For forward navigation, validate current step first
    if (stepNumber > currentStep) {
      const currentStepFields = steps[currentStep - 1].fields;
      const isStepValid = await trigger(currentStepFields as (keyof PublicCustomerFormInputs)[]);
      
      if (isStepValid && completedSteps.includes(currentStep)) {
        setCurrentStep(stepNumber);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (currentStep === steps.length) {
        handleSubmit(onSubmit)();
      } else {
        handleNext();
      }
    }
  };

  const checkDuplicatePhone = async (phoneNumber: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/check-duplicate-phone?phoneNumber=${encodeURIComponent(phoneNumber)}`);
      const result = await response.json();
      
      if (result.exists) {
        toast.error('This phone number is already registered. Please use a different number or contact support.', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setDuplicateErrors(prev => ({
          ...prev,
          phone: 'Phone number already registered'
        }));
        return false;
      } else {
        setDuplicateErrors(prev => ({
          ...prev,
          phone: undefined
        }));
        return true;
      }
    } catch (error) {
      console.error('Error checking duplicate phone:', error);
      toast.error('Unable to verify phone number. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
      // Assume phone is available if check fails
      setDuplicateErrors(prev => ({
        ...prev,
        phone: undefined
      }));
      return true;
    }
  };

  const checkDuplicateEmail = async (email: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/check-duplicate-email?email=${encodeURIComponent(email)}`);
      const result = await response.json();
      
      if (result.exists) {
        toast.error('This email address is already registered. Please use a different email or contact support.', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setDuplicateErrors(prev => ({
          ...prev,
          email: 'Email address already registered'
        }));
        return false;
      } else {
        setDuplicateErrors(prev => ({
          ...prev,
          email: undefined
        }));
        return true;
      }
    } catch (error) {
      console.error('Error checking duplicate email:', error);
      toast.error('Unable to verify email address. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
      // Assume email is available if check fails
      setDuplicateErrors(prev => ({
        ...prev,
        email: undefined
      }));
      return true;
    }
  };

  const verifyBVN = async (bvn: string) => {
    // Skip verification if BVN is already verified and hasn't changed
    if (bvnVerified && verifiedBvn === bvn) {
      console.log('BVN already verified and unchanged, skipping verification');
      return;
    }
    
    setBvnVerifying(true);
    
    try {
      const firstName = getValues('firstName');
      const lastName = getValues('lastName');
      const phoneNumber = getValues('phoneNumber');
      const email = getValues('email');
      const dateOfBirth = getValues('dateOfBirth');
      
      const response = await fetch('/api/verify-bvn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bvn,
          firstName,
          lastName,
          phoneNumber,
          email,
          dateOfBirth,
          skipExternalVerification: true // Only check internal database
        })
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        if (result.source === 'internal') {
          // BVN found in internal database
          // Store BVN verification data if needed
          
          // Compare the data
          const bvnData = result.data;
          const comparisonResult = {
            bvn: {
              provided: bvn,
              verified: true
            },
            firstName: {
              provided: firstName,
              bvnData: bvnData.firstName || '',
              matches: firstName?.toLowerCase() === bvnData.firstName?.toLowerCase()
            },
            lastName: {
              provided: lastName,
              bvnData: bvnData.lastName || '',
              matches: lastName?.toLowerCase() === bvnData.lastName?.toLowerCase()
            },
            phoneNumber: {
              provided: phoneNumber,
              bvnData: bvnData.phoneNumber || '',
              matches: phoneNumber === bvnData.phoneNumber
            },
            dateOfBirth: {
              provided: dateOfBirth,
              bvnData: bvnData.dateOfBirth || '',
              matches: dateOfBirth === bvnData.dateOfBirth
            },
            allMatches: false
          };
          
          // Check if all critical fields match
          comparisonResult.allMatches = comparisonResult.firstName.matches && 
                                       comparisonResult.lastName.matches;
          
          // Clear any previous error
          setBvnError('');
          
          // Show modal with comparison
          setBvnModalData(comparisonResult);
          setShowBvnModal(true);
          
        } else {
          // BVN not found in internal database
          setBvnError('BVN not found or Incorrect. Please check your BVN and try again.');
          setBvnVerified(false);
          setVerifiedBvn('');
          // Clear BVN verification data if needed
        }
      } else {
        setBvnError(result.message || 'BVN verification failed. Please check your BVN and try again.');
        setBvnVerified(false);
        setVerifiedBvn('');
        // Clear BVN verification data if needed
      }
    } catch (error) {
      console.error('BVN verification error:', error);
      setBvnError('Unable to verify BVN at this time. Please try again later.');
      setBvnVerified(false);
      setVerifiedBvn('');
      // Clear BVN verification data if needed
    } finally {
      setBvnVerifying(false);
    }
  };

  const sendEmailOTP = async () => {
    const email = getValues('email');
    const firstName = getValues('firstName');
    const phoneNumber = getValues('phoneNumber') || '';
    
    setOtpLoading(true);
    setOtpError('');
    
    try {
      // First generate the OTP
      const generateResponse = await fetch('/api/generate-otp', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!generateResponse.ok) {
        throw new Error('Failed to generate OTP');
      }
      
      const otpData = await generateResponse.json();
      const otpCode = otpData.otp || otpData.data;
      
      // Store the generated OTP for verification
      setGeneratedOtp(otpCode);
      
      // Then send the OTP via email
      const sendResponse = await fetch('/api/V2/Account/sendOTPByEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          email,
          phoneNumber,
          otp: otpCode
        })
      });
      
      if (sendResponse.ok) {
        setShowOtpModal(true);
        toast.success('OTP sent to your email address!');
      } else {
        throw new Error('Failed to send OTP');
      }
    } catch {
      setOtpError('Failed to send OTP. Please try again.');
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const sendOTP = async () => {
    const phoneNumber = getValues('phoneNumber');
    const firstName = getValues('firstName');
    const email = getValues('email') || '';
    
    setOtpLoading(true);
    setOtpError('');
    
    try {
      // First generate the OTP
      const generateResponse = await fetch('/api/generate-otp', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!generateResponse.ok) {
        throw new Error('Failed to generate OTP');
      }
      
      const otpData = await generateResponse.json();
      const otpCode = otpData.otp || otpData.data;
      
      // Store the generated OTP for verification
      setGeneratedOtp(otpCode);
      
      // Then send the OTP via SMS
      const sendResponse = await fetch('/api/V2/Account/sendOTPByPhone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          email,
          phoneNumber,
          otp: otpCode
        })
      });
      
      if (sendResponse.ok) {
        setShowOtpModal(true);
        toast.success('OTP sent to your phone number!');
      } else {
        throw new Error('Failed to send OTP');
      }
    } catch {
      setOtpError('Failed to send OTP. Please try again.');
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };
  
  const verifyOTP = async () => {
    if (otp.length !== 6) {
      setOtpError('Please enter a complete 6-digit OTP.');
      return;
    }
    
    setOtpLoading(true);
    setOtpError('');
    
    try {
      // Verify OTP against the generated one
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: getValues('phoneNumber'),
          email: getValues('email'),
          otp,
          generatedOtp,
          otpType: currentOtpType
        })
      });
      
      const result = await response.json();
      
      if (response.ok && result.verified) {
        // Update verification status based on OTP type
        if (currentOtpType === 'phone') {
          setPhoneVerified(true);
          setVerifiedPhone(getValues('phoneNumber'));
          toast.success('Phone number verified successfully!');
        } else if (currentOtpType === 'email') {
          setEmailVerified(true);
          setVerifiedEmail(getValues('email'));
          toast.success('Email address verified successfully!');
        }
        
        setShowOtpModal(false);
        setCompletedSteps(prev => [...prev, currentStep]);
        setCurrentStep(currentStep + 1);
        setOtp(''); // Clear OTP input
        setCurrentOtpType(null); // Reset OTP type
      } else {
        throw new Error(result.message || 'Invalid OTP');
      }
    } catch {
      setOtpError('Invalid OTP. Please try again.');
      setOtp('');
    } finally {
      setOtpLoading(false);
    }
  };

  const onSubmit = async (data: PublicCustomerFormInputs) => {
    try {
      setIsSubmitting(true);
      
      // Check if we have a customerID from the previous steps
      if (!customerID) {
        toast.error('Customer ID not found. Please go back and complete the previous steps.');
        return;
      }

      // Validate loan application data
      if (!data.loanAmount || !data.loanTenure || !data.termsAccepted) {
        toast.error('Please complete the loan application details.');
        return;
      }
      
      // Create loan application
      console.log('Creating loan application...');
      const loanAmount = parseFloat(data.loanAmount.replace(/,/g, ''));
      const duration = parseInt(data.loanTenure);
      
      // Use the fetched default interest rate
      const monthlyInterestRate = defaultInterestRate * 30 / 100; // Convert to decimal monthly rate
      const totalAmount = loanAmount * (1 + (monthlyInterestRate * duration));
      const installmentAmount = totalAmount / duration;

      const loanPayload = {
        customerID: customerID,
        amount: loanAmount,
        currency: "NGN",
        interestRate: defaultInterestRate,
        createdBy: data.email, // Use customer's email as created by
        lastModifiedBy: data.email,
        guarantorOrgID: "SYSTEM", // Default system value
        guarantorOrg: "PayLaterHub", // Default organization
        adjustedAmount: loanAmount, // Same as amount for now
        comment: `Loan application for ${data.firstName} ${data.lastName} - Amount: ₦${data.loanAmount}, Tenure: ${data.loanTenure} months`,
        installmentAmount: Math.round(installmentAmount * 100) / 100, // Round to 2 decimal places
        duration: duration
      };

      console.log('Loan application payload:', loanPayload);

      const token = await AuthService.getValidToken();
      const loanResponse = await fetch(
        `${API_CONFIG.baseUrl}/api/V2/Loan/createLoanApplicationSimple`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          },
          body: JSON.stringify(loanPayload)
        }
      );

      if (!loanResponse.ok) {
        const errorText = await loanResponse.text();
        console.error('Loan application creation failed:', errorText);
        toast.error('Failed to create loan application. Please try again.');
        return;
      }

      const loanResult = await loanResponse.json();
      console.log('Loan application created successfully:', loanResult);
      
      // Small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Loan application submitted successfully!');
      
      // Clear saved form data after successful submission
      if (typeof window !== 'undefined') {
        localStorage.removeItem(FORM_STORAGE_KEY);
        localStorage.removeItem(FORM_STATE_KEY);
      }
      
      // Include loan application data in the completion callback
      const completeData = {
        ...data,
        customerID: customerID, // Include the customer ID
        loanApplicationId: loanResult.loanApplication?.id || loanResult.id,
        loanApplicationNumber: loanResult.loanApplication?.loanApplicationNumber || loanResult.loanApplicationNumber
      };
      
      console.log('Passing complete data to parent:', completeData);
      console.log('CustomerID being passed:', customerID);
      
      if (onComplete) {
        onComplete(completeData);
      }
    } catch (error) {
      console.error('Error completing loan application:', error);
      toast.error('Loan application submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearSavedData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(FORM_STORAGE_KEY);
      localStorage.removeItem(FORM_STATE_KEY);
      toast.success('Saved data cleared. Starting fresh!');
      window.location.reload();
    }
  };

  const renderProgressBar = () => (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-2xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              Step {currentStep} of {steps.length}
            </div>
            {isHydrated && showSavedIndicator && (
              <div className="text-xs text-success-400 flex items-center gap-1 animate-fade-in">
                <CheckIcon className="w-3 h-3" />
                Saved
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              {Math.round((currentStep / steps.length) * 100)}% complete
            </div>
            {isHydrated && (
              <button
                onClick={clearSavedData}
                className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
                title="Clear saved data and start over"
              >
                <ArrowPathIcon className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div 
            className="bg-secondary-200 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );

  const renderStepNavigation = () => (
    <div className="hidden lg:flex fixed left-6 top-1/2 transform -translate-y-1/2 flex-col space-y-4 z-40">
      {steps.map((step) => (
        <div key={step.id} className="relative group">
          <button
            onClick={() => handleStepClick(step.id)}
            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all duration-200 ${
              step.id === currentStep
                ? 'bg-secondary-200 border-secondary-200 text-white shadow-lg scale-110'
                : completedSteps.includes(step.id)
                ? 'bg-success-400 border-success-400 text-white hover:scale-105'
                : step.id < currentStep
                ? 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200 hover:scale-105'
                : 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            disabled={step.id > currentStep && !completedSteps.includes(step.id)}
          >
            {completedSteps.includes(step.id) ? (
              <CheckIcon className="w-4 h-4" />
            ) : (
              step.id
            )}
          </button>
          
          {/* Tooltip */}
          <div className="absolute left-12 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            {step.title}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800 rotate-45"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="space-y-6">
        <div>
          <p className="text-sm text-gray-500 mb-2">First Name *</p>
          <input
            type="text"
            placeholder="Enter your first name"
            className="rounded-md border border-gray-100 w-full px-3 h-12 placeholder:text-[#9a9a9a] text-gray-700 focus:outline-none focus:border-secondary-200"
            onKeyDown={handleKeyDown}
            {...register('firstName', {
              required: 'First name is required',
            })}
          />
          {errors?.firstName && (
            <p className="text-red-400 text-[13px] mt-1">{errors.firstName.message}</p>
          )}
        </div>
        
        <div>
          <p className="text-sm text-gray-500 mb-2">Last Name *</p>
          <input
            type="text"
            placeholder="Enter your last name"
            className="rounded-md border border-gray-100 w-full px-3 h-12 placeholder:text-[#9a9a9a] text-gray-700 focus:outline-none focus:border-secondary-200"
            onKeyDown={handleKeyDown}
            {...register('lastName', {
              required: 'Last name is required',
            })}
          />
          {errors?.lastName && (
            <p className="text-red-400 text-[13px] mt-1">{errors.lastName.message}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="space-y-6">
        <div>
          <p className="text-sm text-gray-500 mb-2">Phone Number *</p>
          <input
            type="tel"
            placeholder="2348012345678"
            className="rounded-md border border-gray-100 w-full px-3 h-12 placeholder:text-[#9a9a9a] text-gray-700 focus:outline-none focus:border-secondary-200"
            onKeyDown={handleKeyDown}
            {...register('phoneNumber', {
              required: 'Phone number is required',
              pattern: {
                value: /^[0-9+\-\s()]+$/,
                message: 'Please enter a valid phone number',
              },
              onChange: (e) => {
                clearDuplicateError('phone');
                // Reset verification if phone number changes
                if (e.target.value !== verifiedPhone && phoneVerified) {
                  setPhoneVerified(false);
                  setVerifiedPhone('');
                }
              }
            })}
          />
          {errors?.phoneNumber && (
            <p className="text-red-400 text-[13px] mt-1">{errors.phoneNumber.message}</p>
          )}
          {duplicateErrors.phone && (
            <p className="text-red-400 text-[13px] mt-1">{duplicateErrors.phone}</p>
          )}
          {phoneVerified && verifiedPhone === watch('phoneNumber') && (
            <p className="text-success-400 text-[13px] mt-1 flex items-center gap-1">
              <CheckIcon className="w-4 h-4" />
              Phone number verified
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="space-y-6">
        <div>
          <p className="text-sm text-gray-500 mb-2">Email Address *</p>
          <input
            type="email"
            placeholder="customer@example.com"
            className="rounded-md border border-gray-100 w-full px-3 h-12 placeholder:text-[#9a9a9a] text-gray-700 focus:outline-none focus:border-secondary-200"
            onKeyDown={handleKeyDown}
            {...register('email', {
              required: 'Email is required',
              validate: (value) =>
                validator.isEmail(value) || 'Please enter a valid email address',
              onChange: (e) => {
                clearDuplicateError('email');
                // Reset verification if email changes
                if (e.target.value !== verifiedEmail && emailVerified) {
                  setEmailVerified(false);
                  setVerifiedEmail('');
                }
              }
            })}
          />
          {errors?.email && (
            <p className="text-red-400 text-[13px] mt-1">{errors.email.message}</p>
          )}
          {duplicateErrors.email && (
            <p className="text-red-400 text-[13px] mt-1">{duplicateErrors.email}</p>
          )}
          {emailVerified && verifiedEmail === watch('email') && (
            <p className="text-success-400 text-[13px] mt-1 flex items-center gap-1">
              <CheckIcon className="w-4 h-4" />
              Email address verified
            </p>
          )}
        </div>
      </div>
    </div>
  );
  
  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="space-y-6">
        <div>
          <p className="text-sm text-gray-500 mb-2">Gender *</p>
          <div className="grid grid-cols-2 gap-4">
            {genderOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setValue('gender', option.value)}
                className={`p-4 rounded-md border text-left transition-all duration-200 ${
                  watch('gender') === option.value
                    ? 'border-secondary-200 bg-secondary-50 text-secondary-200'
                    : 'border-gray-100 hover:border-gray-200 text-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          {errors?.gender && (
            <p className="text-red-400 text-[13px] mt-1">Please select your gender</p>
          )}
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-2">Date of Birth *</p>
          <input
            type="date"
            className="rounded-md border border-gray-100 w-full px-3 h-12 text-gray-700 focus:outline-none focus:border-secondary-200"
            {...register('dateOfBirth', {
              required: 'Date of birth is required',
            })}
          />
          {errors?.dateOfBirth && (
            <p className="text-red-400 text-[13px] mt-1">{errors.dateOfBirth.message}</p>
          )}
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-2">Marital Status *</p>
          <div className="grid grid-cols-2 gap-4">
            {maritalStatusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setValue('maritalStatus', option.value)}
                className={`p-4 rounded-md border text-left transition-all duration-200 ${
                  watch('maritalStatus') === option.value
                    ? 'border-secondary-200 bg-secondary-50 text-secondary-200'
                    : 'border-gray-100 hover:border-gray-200 text-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          {errors?.maritalStatus && (
            <p className="text-red-400 text-[13px] mt-1">Please select your marital status</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
     <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500 mb-2">Street Address</p>
          <input
            type="text"
            placeholder="Enter your street address"
            className="rounded-md border border-gray-100 w-full px-3 h-12 placeholder:text-[#9a9a9a] text-gray-700 focus:outline-none focus:border-secondary-200"
            {...register('address')}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-2">City</p>
            <input
              type="text"
              placeholder="Enter your city"
              className="rounded-md border border-gray-100 w-full px-3 h-12 placeholder:text-[#9a9a9a] text-gray-700 focus:outline-none focus:border-secondary-200"
              {...register('city')}
            />
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-2">State</p>
            <select
              className="rounded-md border border-gray-100 w-full px-3 h-12 text-gray-700 focus:outline-none focus:border-secondary-200"
              {...register('state')}
            >
              <option value="">Select state</option>
              {nigerianStates.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-2">Country</p>
            <input
              type="text"
              placeholder="Country"
              className="rounded-md border border-gray-100 w-full px-3 h-12 placeholder:text-[#9a9a9a] text-gray-700 focus:outline-none focus:border-secondary-200"
              {...register('country')}
            />
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-2">Postal Code</p>
            <input
              type="text"
              placeholder="Postal code"
              className="rounded-md border border-gray-100 w-full px-3 h-12 placeholder:text-[#9a9a9a] text-gray-700 focus:outline-none focus:border-secondary-200"
              {...register('postalCode')}
            />
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-2">Landmark (Optional)</p>
          <input
            type="text"
            placeholder="Nearest landmark"
            className="rounded-md border border-gray-100 w-full px-3 h-12 placeholder:text-[#9a9a9a] text-gray-700 focus:outline-none focus:border-secondary-200"
            {...register('landMark')}
          />
        </div>
      </div>
    </div>
   
  );

  const renderStep6 = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500 mb-2">BVN (Bank Verification Number) *</p>
          <input
            type="text"
            placeholder="Enter your 11-digit BVN"
            className={`rounded-md border w-full px-3 h-12 placeholder:text-[#9a9a9a] text-gray-700 focus:outline-none transition-colors ${
              bvnError ? 'border-red-300 focus:border-red-400' : 'border-gray-100 focus:border-secondary-200'
            }`}
            {...register('bvn', {
              required: 'BVN is required',
              pattern: {
                value: /^\d{11}$/,
                message: 'BVN must be 11 digits',
              },
              onChange: (e) => {
                // Clear error when user starts typing
                if (bvnError) setBvnError('');
                // Reset BVN verification if BVN input changes
                if (e.target.value !== verifiedBvn && bvnVerified) {
                  setBvnVerified(false);
                  setVerifiedBvn('');
                }
              }
            })}
          />
          {errors?.bvn && !bvnError && (
            <p className="text-red-400 text-[13px] mt-1">{errors.bvn.message}</p>
          )}
          
          {/* Modern Error Notification */}
          {bvnError && (
            <div className="mt-3 p-4 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    BVN Verification Failed
                  </h3>
                  <div className="mt-1 text-sm text-red-700">
                    <p>{bvnError}</p>
                  </div>
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => setBvnError('')}
                      className="text-sm font-medium text-red-600 hover:text-red-500 focus:outline-none focus:underline transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep7 = () => (
    <div className="space-y-6">
      {financialDataSaved && (
        <div className="bg-success-50 border border-success-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2">
            <CheckIcon className="w-5 h-5 text-success-500" />
            <p className="text-sm text-success-700">
              Financial information has been saved successfully!
            </p>
          </div>
        </div>
      )}
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500 mb-2">NIN (National Identification Number)</p>
          <input
            type="text"
            placeholder="Enter your 11-digit NIN"
            className="rounded-md border border-gray-100 w-full px-3 h-12 placeholder:text-[#9a9a9a] text-gray-700 focus:outline-none focus:border-secondary-200"
            {...register('nin', {
              pattern: {
                value: /^\d{11}$/,
                message: 'NIN must be 11 digits',
              },
            })}
          />
          {errors?.nin && (
            <p className="text-red-400 text-[13px] mt-1">{errors.nin.message}</p>
          )}
        </div>
        
        <div>
          <p className="text-sm text-gray-500 mb-2">Salary Bank Account (Must Be a Salary Account) *</p>
          <select
            className="rounded-md border border-gray-100 w-full px-3 h-12 text-gray-700 focus:outline-none focus:border-secondary-200"
            {...register('bank', {
              required: 'Please select your bank',
            })}
            onChange={(e) => {
              const selectedBank = nigerianBanks.find(bank => bank.name === e.target.value);
              setValue('bank', e.target.value);
              setValue('bankCode', selectedBank?.code || '');
            }}
          >
            <option value="">Select your bank</option>
            {nigerianBanks.map((bank) => (
              <option key={bank.code} value={bank.name}>{bank.name}</option>
            ))}
          </select>
          {errors?.bank && (
            <p className="text-red-400 text-[13px] mt-1">{errors.bank.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-2">Account Number *</p>
            <input
              type="text"
              placeholder="Account number"
              className="rounded-md border border-gray-100 w-full px-3 h-12 placeholder:text-[#9a9a9a] text-gray-700 focus:outline-none focus:border-secondary-200"
              {...register('accountNumber', {
                required: 'Account number is required',
                pattern: {
                  value: /^\d{10}$/,
                  message: 'Account number must be 10 digits',
                },
              })}
            />
            {errors?.accountNumber && (
              <p className="text-red-400 text-[13px] mt-1">{errors.accountNumber.message}</p>
            )}
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-2">Account Name *</p>
            <input
              type="text"
              placeholder="Account holder name"
              className="rounded-md border border-gray-100 w-full px-3 h-12 placeholder:text-[#9a9a9a] text-gray-700 focus:outline-none focus:border-secondary-200"
              {...register('accountName', {
                required: 'Account name is required',
              })}
            />
            {errors?.accountName && (
              <p className="text-red-400 text-[13px] mt-1">{errors.accountName.message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep8 = () => (
   <div className="space-y-6">
      {employmentDataSaved && (
        <div className="bg-success-50 border border-success-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2">
            <CheckIcon className="w-5 h-5 text-success-500" />
            <p className="text-sm text-success-700">
              Employment information has been saved successfully!
            </p>
          </div>
        </div>
      )}
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500 mb-2">Employer/Company Name *</p>
          <select
            className="rounded-md border border-gray-100 w-full px-3 h-12 text-gray-700 focus:outline-none focus:border-secondary-200"
            {...register('employer', {
              required: 'Please select your employer',
            })}
          >
            <option value="">
              {isLoadingPayrollUnits ? 'Loading employers...' : 'Select your employer'}
            </option>
            {payrollUnits.map((unit) => (
              <option key={unit.id} value={unit.name}>
                {unit.name}
              </option>
            ))}
            <option value="Other">Other (Not Listed)</option>
          </select>
          {errors?.employer && (
            <p className="text-red-400 text-[13px] mt-1">{errors.employer.message}</p>
          )}
          
          {/* Show input field if "Other" is selected */}
          {watch('employer') === 'Other' && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Enter Employer Name *</p>
              <input
                type="text"
                placeholder="Enter your employer or company name"
                className="rounded-md border border-gray-100 w-full px-3 h-12 placeholder:text-[#9a9a9a] text-gray-700 focus:outline-none focus:border-secondary-200"
                {...register('customEmployer', {
                  required: watch('employer') === 'Other' ? 'Employer name is required' : false,
                })}
              />
              {watch('employer') === 'Other' && errors?.customEmployer && (
                <p className="text-red-400 text-[13px] mt-1">{errors.customEmployer.message}</p>
              )}
            </div>
          )}
        </div>
        
        <div>
          <p className="text-sm text-gray-500 mb-2">Monthly Income (₦) *</p>
          <input
            type="number"
            placeholder="Enter monthly income"
            className="rounded-md border border-gray-100 w-full px-3 h-12 placeholder:text-[#9a9a9a] text-gray-700 focus:outline-none focus:border-secondary-200"
            {...register('monthlyIncome', {
              required: 'Monthly income is required',
              min: {
                value: 1,
                message: 'Income must be greater than 0'
              }
            })}
          />
          {errors?.monthlyIncome && (
            <p className="text-red-400 text-[13px] mt-1">{errors.monthlyIncome.message}</p>
          )}
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-2">Employer Address</p>
          <input
            type="text"
            placeholder="Company address"
            className="rounded-md border border-gray-100 w-full px-3 h-12 placeholder:text-[#9a9a9a] text-gray-700 focus:outline-none focus:border-secondary-200"
            {...register('employerAddress')}
          />
        </div>
      </div>
    </div>
  );

  const renderStep9 = () => {
    const startCamera = () => {
      setShowCamera(true);
    };

    const stopCamera = () => {
      setShowCamera(false);
    };

    const captureSelfie = () => {
      try {
        if (webcamRef.current) {
          const imageSrc = webcamRef.current.getScreenshot();
          if (!imageSrc) {
            throw new Error('Failed to capture image from webcam');
          }
          setCapturedSelfie(imageSrc);
          setValue('selfieImage', imageSrc);
          setShowCamera(false);
          toast.success('Selfie captured successfully!');
        } else {
          throw new Error('Webcam not initialized');
        }
      } catch (err) {
        toast.error('Failed to capture image. Please make sure your camera is working properly.');
        console.error('Capture error:', err);
      }
    };

    const retakeSelfie = () => {
      setCapturedSelfie('');
      setValue('selfieImage', '');
      startCamera();
    };

    return (
      <div className="space-y-6">
        {selfieSaved && (
          <div className="bg-success-50 border border-success-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2">
              <CheckIcon className="w-5 h-5 text-success-500" />
              <p className="text-sm text-success-700">
                Selfie has been uploaded successfully!
              </p>
            </div>
          </div>
        )}
        <div className="text-center">
          {!capturedSelfie && !showCamera && (
            <div className="space-y-4">
              <div className="w-48 h-48 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-sm text-gray-600">Click the button below to take a selfie</p>
              <Button
                onClick={startCamera}
                className="bg-secondary-200"
              >
                Open Camera
              </Button>
            </div>
          )}

          {showCamera && !capturedSelfie && (
            <div className="space-y-4">
              <div className="relative inline-block">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="rounded-lg max-w-full h-auto border-2 border-gray-200"
                  style={{ 
                    maxHeight: '400px',
                    width: '100%',
                    maxWidth: '400px'
                  }}
                  videoConstraints={{
                    facingMode: 'user',
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                  }}
                />
              </div>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={captureSelfie}
                  className="bg-secondary-200"
                >
                Capture Selfie
                </Button>
                <Button
                  onClick={stopCamera}
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {capturedSelfie && (
            <div className="space-y-4">
              <div className="relative inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={capturedSelfie}
                  alt="Captured selfie"
                  className="rounded-lg max-w-full h-auto"
                  style={{ maxHeight: '400px' }}
                />
              </div>
              <p className="text-sm text-success-600">Selfie captured successfully!</p>
              <Button
                onClick={retakeSelfie}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Retake Selfie
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderStep10 = () => {
    const loanAmount = watch('loanAmount');

    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="loanAmount" className="block text-sm font-medium text-gray-700 mb-2">
              Loan Amount (NGN)
            </label>
            <input
              id="loanAmount"
              type="text"
              {...register('loanAmount', {
                required: 'Loan amount is required',
                validate: (value) => {
                  const numValue = parseFloat(value.replace(/,/g, ''));
                  if (isNaN(numValue)) return 'Please enter a valid amount';
                  if (numValue < 1000) return 'Minimum loan amount is ₦1,000';
                  if (numValue > 10000000) return 'Maximum loan amount is ₦10,000,000';
                  return true;
                }
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent text-lg"
              placeholder="Enter loan amount"
              onChange={(e) => {
                const rawValue = e.target.value.replace(/\D/g, '');
                const formattedValue = rawValue ? Number(rawValue).toLocaleString('en-US') : '';
                setValue('loanAmount', formattedValue);
              }}
              value={loanAmount}
            />
            {errors.loanAmount && (
              <p className="mt-1 text-sm text-red-500">{errors.loanAmount.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="loanTenure" className="block text-sm font-medium text-gray-700 mb-2">
              Loan Tenure (Months)
            </label>
            <select
              id="loanTenure"
              {...register('loanTenure', { required: 'Please select a loan tenure' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent text-lg"
            >
              <option value="">Select tenure</option>
              {loanTenureOptions.length > 0 ? (
                loanTenureOptions.map((month) => (
                  <option key={month} value={month}>
                    {month} {Number(month) === 1 ? 'Month' : 'Months'}
                  </option>
                ))
              ) : (
                // Fallback options
                ['3', '6', '9', '11', '12'].map((month) => (
                  <option key={month} value={month}>
                    {month} Months
                  </option>
                ))
              )}
            </select>
            {errors.loanTenure && (
              <p className="mt-1 text-sm text-red-500">{errors.loanTenure.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-start">
              <input
                id="termsAccepted"
                type="checkbox"
                {...register('termsAccepted', { required: 'You must accept the terms and conditions' })}
                className="mt-1 h-4 w-4 text-secondary-600 focus:ring-secondary-500 border-gray-300 rounded"
              />
              <label htmlFor="termsAccepted" className="ml-3 text-sm text-gray-700">
                I agree to the{' '}
                <a href="#" className="text-secondary-600 hover:text-secondary-500 underline">
                  Terms and Conditions
                </a>{' '}
                and{' '}
                <a href="#" className="text-secondary-600 hover:text-secondary-500 underline">
                  Privacy Policy
                </a>
              </label>
            </div>
            {errors.termsAccepted && (
              <p className="text-sm text-red-500">{errors.termsAccepted.message}</p>
            )}
          </div>

        </div>
      </div>
    );
  };

  const renderStep11 = () => {
    const values = getValues();
    return (
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><span className="font-medium">Name:</span> {values.firstName} {values.lastName}</div>
            <div><span className="font-medium">Phone:</span> {values.phoneNumber}</div>
            <div><span className="font-medium">Email:</span> {values.email}</div>
            <div><span className="font-medium">Gender:</span> {values.gender}</div>
            <div><span className="font-medium">Date of Birth:</span> {values.dateOfBirth}</div>
            <div><span className="font-medium">Marital Status:</span> {values.maritalStatus}</div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {values.bvn && <div><span className="font-medium">BVN:</span> {values.bvn}</div>}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Banking Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {values.nin && <div><span className="font-medium">NIN:</span> {values.nin}</div>}
            {values.bank && <div><span className="font-medium">Bank:</span> {values.bank}</div>}
            {values.accountNumber && <div><span className="font-medium">Account Number:</span> {values.accountNumber}</div>}
            {values.accountName && <div><span className="font-medium">Account Name:</span> {values.accountName}</div>}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Employment Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {(values.employer && values.employer !== 'Other') && <div><span className="font-medium">Employer:</span> {values.employer}</div>}
            {(values.employer === 'Other' && values.customEmployer) && <div><span className="font-medium">Employer:</span> {values.customEmployer}</div>}
            {values.monthlyIncome && <div><span className="font-medium">Monthly Income:</span> ₦{Number(values.monthlyIncome).toLocaleString()}</div>}
            {values.employerAddress && <div><span className="font-medium">Employer Address:</span> {values.employerAddress}</div>}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
          <div className="text-sm space-y-2">
            {values.address && <div><span className="font-medium">Address:</span> {values.address}</div>}
            {values.city && <div><span className="font-medium">City:</span> {values.city}</div>}
            {values.state && <div><span className="font-medium">State:</span> {values.state}</div>}
            {values.country && <div><span className="font-medium">Country:</span> {values.country}</div>}
            {values.postalCode && <div><span className="font-medium">Postal Code:</span> {values.postalCode}</div>}
            {values.landMark && <div><span className="font-medium">Landmark:</span> {values.landMark}</div>}
          </div>
        </div>

        <div className="bg-secondary-50 rounded-lg p-6 border-2 border-secondary-200">
          <h3 className="text-lg font-medium text-secondary-800 mb-4">Loan Application Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {values.loanAmount && <div><span className="font-medium">Loan Amount:</span> ₦{values.loanAmount}</div>}
            {values.loanTenure && <div><span className="font-medium">Tenure:</span> {values.loanTenure} {Number(values.loanTenure) === 1 ? 'Month' : 'Months'}</div>}
            <div className="col-span-full">
              <span className="font-medium">Terms & Privacy:</span> 
              <span className={`ml-2 ${values.termsAccepted ? 'text-success-600' : 'text-red-600'}`}>
                {values.termsAccepted ? '✓ Accepted' : '✗ Not Accepted'}
              </span>
            </div>
          </div>
        </div>

        {values.selfieImage && (
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Identity Verification</h3>
            <div className="flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={values.selfieImage}
                alt="Customer selfie"
                className="rounded-lg max-w-[200px] h-auto"
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderOtpModal = () => {
    if (!showOtpModal) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {currentOtpType === 'phone' ? 'Verify Phone Number' : 'Verify Email Address'}
            </h2>
            <button
              onClick={() => setShowOtpModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          
          <p className="text-gray-500 mb-6 text-center">
            Enter the 6-digit code sent to {currentOtpType === 'phone' ? getValues('phoneNumber') : getValues('email')}
          </p>
          
          <div className="mb-6">
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderInput={(props) => <input {...props} />}
              containerStyle="grid grid-cols-6 gap-2 mb-4"
              inputStyle="!w-full h-12 text-xl font-medium text-center border border-gray-100 rounded-md focus:outline-none focus:border-secondary-200"
              shouldAutoFocus
              placeholder="------"
            />
            
            {otpError && (
              <p className="text-red-400 text-sm text-center mt-2">{otpError}</p>
            )}
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={() => setShowOtpModal(false)}
              className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Cancel
            </Button>
            <Button
              onClick={verifyOTP}
              disabled={otp.length !== 6 || otpLoading}
              className="flex-1 bg-secondary-200"
            >
              {otpLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </div>
              ) : (
                'Verify OTP'
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderBvnModal = () => {
    if (!showBvnModal || !bvnModalData) return null;
    
    const handleConfirm = () => {
      if (bvnModalData.allMatches) {
        // All data matches, proceed
        setBvnVerified(true);
        setVerifiedBvn(getValues('bvn'));
        setBvnError(''); // Clear any error
        toast.success('BVN verified successfully! All information matches.');
        setShowBvnModal(false);
        setCompletedSteps(prev => [...prev, currentStep]);
        setCurrentStep(currentStep + 1);
      } else {
        // Data mismatch, user must correct their information
        toast.error('Information does not match BVN records. Please go back and correct your details.');
        setShowBvnModal(false);
        setBvnError(''); // Clear error when closing modal
        // Navigate back to step 1 to allow user to correct their information
        setCurrentStep(1);
      }
    };
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">BVN Identity Verification</h2>
            <button
              onClick={() => setShowBvnModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          
          <div className="space-y-6">
            {/* BVN Status */}
            <div className="bg-success-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckIcon className="w-6 h-6 text-success-500" />
                <div>
                  <p className="font-medium text-success-700">BVN Found</p>
                  <p className="text-sm text-success-600">BVN: {bvnModalData.bvn.provided}</p>
                </div>
              </div>
            </div>
            
            {/* Identity Verification Results */}
            {bvnModalData.allMatches ? (
              /* Success View - Big Checkmark */
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-24 h-24 bg-success-100 rounded-full flex items-center justify-center mb-6">
                  <CheckIcon className="w-16 h-16 text-success-500" />
                </div>
                <h3 className="text-2xl font-semibold text-success-700 mb-2">Identity Verified!</h3>
                <p className="text-success-600 text-center max-w-md">
                  All your information matches your BVN records. Your identity has been successfully verified.
                </p>
              </div>
            ) : (
              /* Failure View - Show detailed comparison */
              <div className="space-y-4">
                <h3 className="font-medium text-gray-700">Identity Verification Results</h3>
                
                {/* First Name */}
                <div className={`p-4 rounded-lg border ${bvnModalData.firstName.matches ? 'bg-success-50 border-success-200' : 'bg-warning-50 border-warning-200'}`}>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-gray-700">First Name</p>
                      <p className="text-sm text-gray-600">Your Input: <span className="font-medium">{bvnModalData.firstName.provided || 'Not provided'}</span></p>
                    </div>
                    <div className="mt-1">
                      {bvnModalData.firstName.matches ? (
                        <CheckIcon className="w-5 h-5 text-success-500" />
                      ) : (
                        <XMarkIcon className="w-5 h-5 text-warning-500" />
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Last Name */}
                <div className={`p-4 rounded-lg border ${bvnModalData.lastName.matches ? 'bg-success-50 border-success-200' : 'bg-warning-50 border-warning-200'}`}>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-gray-700">Last Name</p>
                      <p className="text-sm text-gray-600">Your Input: <span className="font-medium">{bvnModalData.lastName.provided || 'Not provided'}</span></p>
                    </div>
                    <div className="mt-1">
                      {bvnModalData.lastName.matches ? (
                        <CheckIcon className="w-5 h-5 text-success-500" />
                      ) : (
                        <XMarkIcon className="w-5 h-5 text-warning-500" />
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Phone Number */}
                <div className={`p-4 rounded-lg border ${bvnModalData.phoneNumber.matches ? 'bg-success-50 border-success-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-gray-700">Phone Number</p>
                      <p className="text-sm text-gray-600">Your Input: <span className="font-medium">{bvnModalData.phoneNumber.provided || 'Not provided'}</span></p>
                    </div>
                    <div className="mt-1">
                      {bvnModalData.phoneNumber.matches ? (
                        <CheckIcon className="w-5 h-5 text-success-500" />
                      ) : bvnModalData.phoneNumber.bvnData ? (
                        <XMarkIcon className="w-5 h-5 text-gray-400" />
                      ) : (
                        <span className="text-xs text-gray-400">N/A</span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Date of Birth */}
                <div className={`p-4 rounded-lg border ${bvnModalData.dateOfBirth.matches ? 'bg-success-50 border-success-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-gray-700">Date of Birth</p>
                      <p className="text-sm text-gray-600">Your Input: <span className="font-medium">{bvnModalData.dateOfBirth.provided || 'Not provided'}</span></p>
                    </div>
                    <div className="mt-1">
                      {bvnModalData.dateOfBirth.matches ? (
                        <CheckIcon className="w-5 h-5 text-success-500" />
                      ) : bvnModalData.dateOfBirth.bvnData ? (
                        <XMarkIcon className="w-5 h-5 text-gray-400" />
                      ) : (
                        <span className="text-xs text-gray-400">N/A</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="pt-4 border-t border-gray-200">
              {bvnModalData.allMatches ? (
                <div className="space-y-3">
                     <Button
                    onClick={handleConfirm}
                    className="w-full bg-secondary-200"
                  >
                    Continue to Next Step
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-warning-50 p-4 rounded-lg">
                    <p className="text-sm text-warning-700 font-medium text-center mb-2">Verification Failed</p>
                    <p className="text-xs text-warning-600 text-center">
                      The information you provided does not match your BVN records. 
                      Please ensure you enter your details exactly as they appear on your BVN.
                    </p>
                  </div>
                  <Button
                    onClick={handleConfirm}
                    className="w-full bg-warning-500 hover:bg-warning-600"
                  >
                    Go Back and Correct Information
                  </Button>
                  <button
                    onClick={() => setShowBvnModal(false)}
                    className="w-full text-sm text-gray-500 hover:text-gray-700 underline"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      case 6: return renderStep6();
      case 7: return renderStep7();
      case 8: return renderStep8();
      case 9: return renderStep9();
      case 10: return renderStep10();
      case 11: return renderStep11();
      default: return null;
    }
  };

  // Prevent rendering until hydrated to avoid hydration mismatch
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
        <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-2xl mx-auto px-6 py-4">
            <div className="h-8 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
        <div className="pt-24 pb-12 px-6">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="h-12 w-48 bg-gray-100 rounded mx-auto animate-pulse" />
            </div>
            <div className="bg-white rounded-lg shadow-deep p-6 md:p-8">
              <div className="h-96 bg-gray-50 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      {renderProgressBar()}
      {renderStepNavigation()}
      
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <Image
              src="/branding/paylaterhub-logo.svg"
              alt="PayLaterHub Logo"
              height={48}
              width={300}
              className="w-auto mx-auto mb-6"
              priority
            />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-4">
              {steps[currentStep - 1].title}
            </h1>
            <p className="text-lg text-gray-500">
              {steps[currentStep - 1].subtitle}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-deep p-6 md:p-8 transform transition-all duration-300">
            <div className="min-h-[400px] flex flex-col justify-center">
              <div className="transform transition-all duration-500 ease-in-out">
                {renderCurrentStep()}
              </div>
            </div>

            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className={`flex items-center space-x-2 px-6 py-3 rounded-md transition-all duration-200 ${
                  currentStep === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <ChevronLeftIcon className="w-5 h-5" />
                <span>Previous</span>
              </button>

              {currentStep === 10 ? (
                <Button
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                  className="bg-secondary-200 flex items-center justify-center space-x-2 !px-8 !w-auto min-w-[200px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Application</span>
                      <CheckIcon className="w-5 h-5" />
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={(currentStep === 2 && !phoneVerified && (otpLoading || duplicateCheckLoading)) || 
                           (currentStep === 3 && !emailVerified && (otpLoading || duplicateCheckLoading)) ||
                           (currentStep === 5 && isSubmitting) ||
                           (currentStep === 7 && isSubmitting) ||
                           (currentStep === 8 && isSubmitting) ||
                           (currentStep === 9 && isSubmitting)}
                  className="bg-secondary-200 flex items-center justify-center space-x-2 !px-8 !w-auto min-w-[120px]"
                >
                  {((currentStep === 2 && !phoneVerified) || (currentStep === 3 && !emailVerified)) && duplicateCheckLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{currentStep === 2 ? 'Checking Phone...' : 'Checking Email...'}</span>
                    </>
                  ) : ((currentStep === 2 && !phoneVerified) || (currentStep === 3 && !emailVerified)) && otpLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{currentStep === 2 ? 'Sending SMS OTP...' : 'Sending Email OTP...'}</span>
                    </>
                  ) : (currentStep === 5 && isSubmitting) ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (currentStep === 6 && bvnVerifying) ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Verifying BVN...</span>
                    </>
                  ) : (currentStep === 7 && isSubmitting) ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Saving Financial Data...</span>
                    </>
                  ) : (currentStep === 8 && isSubmitting) ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Saving Employment...</span>
                    </>
                  ) : (currentStep === 9 && isSubmitting) ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Uploading Selfie...</span>
                    </>
                  ) : (
                    <>
                      <span>Next</span>
                      <ChevronRightIcon className="w-5 h-5" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Footer with Compliance Logos */}
        <div className="mt-12 pb-8">
          <div className="max-w-2xl mx-auto">
            <div className="border-t border-gray-200 pt-8">
              <div className="flex items-center justify-center gap-8">
                <Image
                  src="/images/fccpcc.webp"
                  alt="FCCPC Logo"
                  width={80}
                  height={40}
                  className="h-10 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
                <Image
                  src="/images/ndpr-audit.webp"
                  alt="NDPR Audit Logo"
                  width={80}
                  height={40}
                  className="h-10 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
                <Image
                  src="/images/ndpr.svg"
                  alt="NDPR Logo"
                  width={80}
                  height={40}
                  className="h-10 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
              </div>
              <p className="text-center text-xs text-gray-400 mt-4">
                Regulatory Compliance
              </p>
              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <button
                    onClick={() => window.location.href = '/customer-login'}
                    className="text-secondary-600 hover:text-secondary-700 font-medium underline"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {renderOtpModal()}
      {renderBvnModal()}
    </div>
  );
};

export default PublicCustomerRegistrationForm;