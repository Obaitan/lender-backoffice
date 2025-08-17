'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/general/Button';
import CustomerOTPVerification from './CustomerOTPVerification';
import { 
  EnvelopeIcon,
  ArrowLeftIcon 
} from '@heroicons/react/24/outline';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { API_CONFIG } from '@/services/authService';

export default function CustomerLoginForm() {
  const router = useRouter();
  const [step, setStep] = useState<'login' | 'verify'>('login');
  const [identifier, setIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBack = () => {
    if (step === 'verify') {
      setStep('login');
      setError('');
    } else {
      router.push('/loanapplication');
    }
  };

  // Auto-detect if input is email or phone
  const detectInputType = (input: string): 'email' | 'phone' => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input) ? 'email' : 'phone';
  };

  const validateInput = () => {
    if (!identifier.trim()) {
      setError('Please enter your email address or phone number');
      return false;
    }

    const inputType = detectInputType(identifier);

    if (inputType === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(identifier)) {
        setError('Please enter a valid email address');
        return false;
      }
    } else {
      // For phone validation, check if it contains only valid characters and has enough digits
      const phoneDigits = identifier.replace(/\D/g, '');
      if (phoneDigits.length < 10) {
        setError('Please enter a valid phone number (minimum 10 digits)');
        return false;
      }
    }

    return true;
  };

  const sendOTP = async () => {
    if (!validateInput()) return;

    setIsLoading(true);
    setError('');

    try {
      const inputType = detectInputType(identifier);
      const payload = inputType === 'email' 
        ? { email: identifier, phoneNumber: '' }
        : { email: '', phoneNumber: identifier };

      console.log('Sending OTP request:', payload);

      const response = await fetch(`${API_CONFIG.baseUrl}/api/V2/Customer/sendCustomerOTP`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      console.log('OTP response:', result);

      if (response.ok) {
        toast.success(`OTP sent to your ${inputType === 'email' ? 'email' : 'phone number'}!`);
        setStep('verify');
      } else {
        throw new Error(result.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setError(error instanceof Error ? error.message : 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerified = (verificationData: Record<string, unknown>) => {
    // Store verification data and redirect to dashboard
    if (verificationData?.verified) {
      const inputType = detectInputType(identifier);
      localStorage.setItem('customerVerified', 'true');
      localStorage.setItem('customerLoginMethod', inputType);
      localStorage.setItem('customerIdentifier', identifier);
      localStorage.setItem('customerVerificationTime', '2024-01-01T00:00:00.000Z'); // Fixed timestamp
      router.push('/customer-dashboard');
    } else {
      setError('OTP verification failed');
    }
  };

  if (step === 'verify') {
    const inputType = detectInputType(identifier);
    return (
      <CustomerOTPVerification
        identifier={identifier}
        method={inputType}
        onBack={handleBack}
        onVerified={handleOTPVerified}
        onError={(error) => setError(error)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Image
            src="/branding/paylaterhub-logo.svg"
            alt="PayLaterHub"
            width={180}
            height={48}
            className="mx-auto mb-6"
            priority
          />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">
            Sign in to access your customer dashboard
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          {/* Input Field */}
          <div className="mb-6">
            <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-2">
              Email or Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  setError('');
                }}
                placeholder="Enter your email or phone number"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-200 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-200"
                disabled={isLoading}
              />
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>

          {/* Continue Button */}
          <Button
            onClick={sendOTP}
            disabled={isLoading || !identifier.trim()}
            className="bg-secondary-200 hover:opacity-90 w-full mb-4 transition-all duration-200"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Sending OTP...</span>
              </div>
            ) : (
              'Send OTP'
            )}
          </Button>

          {/* Back Button */}
          <button
            onClick={handleBack}
            className="flex items-center justify-center gap-2 w-full py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            disabled={isLoading}
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Loan Application
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <button
              onClick={() => router.push('/loanapplication')}
              className="text-secondary-200 hover:text-secondary-300 font-medium transition-colors duration-200"
            >
              Apply for a loan
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}