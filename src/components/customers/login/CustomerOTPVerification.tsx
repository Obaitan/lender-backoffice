'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/general/Button';
import { 
  ArrowLeftIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { API_CONFIG } from '@/services/authService';

interface CustomerOTPVerificationProps {
  identifier: string;
  method: 'email' | 'phone';
  onBack: () => void;
  onVerified: (customerData: Record<string, unknown>) => void;
  onError: (error: string) => void;
}

export default function CustomerOTPVerification({ 
  identifier, 
  method, 
  onBack, 
  onVerified, 
  onError 
}: CustomerOTPVerificationProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    // Countdown timer for resend OTP
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple characters
    if (isLoading) return; // Prevent changes while loading
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all digits are entered
    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 6) {
      // Use setTimeout to avoid state update conflicts
      setTimeout(() => {
        verifyOTP(newOtp.join(''));
      }, 100);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, 6);
    
    if (pastedData.length === 6) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      verifyOTP(pastedData);
    }
  };

  const verifyOTP = async (otpCode?: string) => {
    const otpToVerify = otpCode || otp.join('');
    
    if (otpToVerify.length !== 6) {
      onError('Please enter a complete 6-digit OTP');
      return;
    }

    if (isLoading) {
      return; // Prevent multiple concurrent requests
    }

    setIsLoading(true);
    onError(''); // Clear any previous errors

    try {
      const payload = {
        email: method === 'email' ? identifier : '',
        phoneNumber: method === 'phone' ? identifier : '',
        otp: otpToVerify,
        updateVerificationFlags: true
      };

      console.log('Verifying OTP:', payload);

      const response = await fetch(`${API_CONFIG.baseUrl}/api/V2/Customer/verifyCustomerOTP`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('OTP verification response:', result);

      if (result.verified) {
        toast.success(result.message || 'OTP verified successfully!');
        // Pass the verification result and identifier info
        onVerified({
          verified: result.verified,
          message: result.message,
          identifier: identifier,
          method: method
        });
      } else {
        throw new Error(result.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      let errorMessage = 'Invalid OTP. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Network error. Please check your connection.';
        } else if (error.message.includes('HTTP')) {
          errorMessage = 'Server error. Please try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      onError(errorMessage);
      setOtp(['', '', '', '', '', '']); // Clear OTP on error
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    setIsResending(true);
    onError('');

    try {
      const payload = method === 'email' 
        ? { email: identifier, phoneNumber: '' }
        : { email: '', phoneNumber: identifier };

      const response = await fetch(`${API_CONFIG.baseUrl}/api/V2/Customer/sendCustomerOTP`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('OTP resent successfully!');
        setCountdown(60);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        throw new Error(result.message || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      onError(error instanceof Error ? error.message : 'Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  };

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
          <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheckIcon className="h-8 w-8 text-secondary-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Identity</h1>
          <p className="text-gray-600">
            We&apos;ve sent a 6-digit code to your {method === 'email' ? 'email' : 'phone number'}
          </p>
          <p className="text-sm font-medium text-gray-900 mt-2">
            {method === 'email' ? identifier : `${identifier.slice(0, 3)}****${identifier.slice(-4)}`}
          </p>
        </div>

        {/* OTP Verification Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          {/* OTP Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Enter verification code
            </label>
            <div className="flex gap-3 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                  disabled={isLoading}
                />
              ))}
            </div>
          </div>

          {/* Verify Button */}
          <Button
            onClick={() => verifyOTP()}
            disabled={isLoading || otp.some(digit => digit === '')}
            className="bg-secondary-500 hover:bg-secondary-600 w-full mb-4"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Verifying...</span>
              </div>
            ) : (
              'Verify Code'
            )}
          </Button>

          {/* Resend OTP */}
          <div className="text-center mb-4">
            {canResend ? (
              <button
                onClick={resendOTP}
                disabled={isResending}
                className="text-secondary-600 hover:text-secondary-700 font-medium text-sm"
              >
                {isResending ? 'Resending...' : 'Resend OTP'}
              </button>
            ) : (
              <p className="text-sm text-gray-600">
                Resend OTP in {countdown}s
              </p>
            )}
          </div>

          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex items-center justify-center gap-2 w-full py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            disabled={isLoading}
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Login
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Didn&apos;t receive the code? Check your spam folder or{' '}
            <button
              onClick={resendOTP}
              disabled={!canResend || isResending}
              className="text-secondary-600 hover:text-secondary-700 font-medium disabled:text-gray-400"
            >
              try again
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}