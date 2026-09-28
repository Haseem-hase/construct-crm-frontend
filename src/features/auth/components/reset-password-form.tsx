'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface ResetPasswordFormProps {
  token?: string;
}

const RequirementItem = ({ met, text }: { met: boolean; text: string }) => (
  <div className={`flex items-center space-x-2 text-sm transition-colors ${met ? 'text-green-600' : 'text-neutral-500'}`}>
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {met ? (
        <polyline points="20 6 9 17 4 12"></polyline>
      ) : (
        <circle cx="12" cy="12" r="10"></circle>
      )}
    </svg>
    <span>{text}</span>
  </div>
);

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // If the token is 'expired', we start in the expired state for demonstration purposes
  const [status, setStatus] = useState<'idle' | 'success' | 'expired'>(
    token === 'expired' ? 'expired' : 'idle'
  );
  const [error, setError] = useState('');

  // Password requirements
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const allRequirementsMet = hasMinLength && hasUppercase && hasLowercase && hasNumber;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!allRequirementsMet) {
      setError('Please satisfy all password requirements.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Simulate API call success
    setStatus('success');
  };

  if (status === 'expired') {
    return (
      <div className="w-full max-w-[440px] mx-auto px-4 py-12">
        <div className="flex flex-col items-center mb-5 text-center">
          {/* <div className="mb-8">
            <span className="text-xl font-semibold tracking-tight text-neutral-900">
              ConstructCRM
            </span>
          </div> */}
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 mb-2">
            Reset link expired
          </h1>
          <p className="text-[15px] text-neutral-500">
            This password reset link is no longer valid. Please request a new password reset link.
          </p>
        </div>

        <div className="bg-white sm:px-10 px-6 py-10 sm:border sm:border-neutral-200/50 sm:shadow-[0_8px_40px_rgba(0,0,0,0.04)] rounded-lg">
          <Link
            href="/forgot-password"
            className="block w-full text-center bg-neutral-900 text-white rounded-sm py-3.5 text-[15px] font-medium hover:bg-neutral-800 focus:outline-none focus:ring-4 focus:ring-neutral-900/10 transition-all active:scale-[0.98]"
          >
            Request New Link
          </Link>
          <div className="text-center pt-6">
            <Link href="/login" className="text-[15px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
              Back to login
            </Link>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-[13px] text-neutral-400">&copy; 2026 ConstructCRM</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="w-full max-w-[440px] mx-auto px-4 py-12">
        <div className="flex flex-col items-center mb-5 text-center">
          {/* <div className="mb-8">
            <span className="text-xl font-semibold tracking-tight text-neutral-900">
              ConstructCRM
            </span>
          </div> */}
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 mb-2">
            Password reset successful
          </h1>
          <p className="text-[15px] text-neutral-500">
            Your password has been updated successfully. You can now sign in with your new password.
          </p>
        </div>

        <div className="bg-white sm:px-10 px-6 py-10 sm:border sm:border-neutral-200/50 sm:shadow-[0_8px_40px_rgba(0,0,0,0.04)] rounded-lg">
          <Link
            href="/login"
            className="block w-full text-center bg-neutral-900 text-white rounded-sm py-3.5 text-[15px] font-medium hover:bg-neutral-800 focus:outline-none focus:ring-4 focus:ring-neutral-900/10 transition-all active:scale-[0.98]"
          >
            Continue to Login
          </Link>
        </div>

        <div className="mt-12 text-center">
          <p className="text-[13px] text-neutral-400">&copy; 2026 ConstructCRM</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[440px] mx-auto px-4 py-12">
      <div className="flex flex-col items-center mb-5 text-center">
        {/* <div className="mb-8">
          <span className="text-xl font-semibold tracking-tight text-neutral-900">
            ConstructCRM
          </span>
        </div> */}
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 mb-2">
          Reset your password
        </h1>
        <p className="text-[15px] text-neutral-500">
          Create a new password for your account.
        </p>
      </div>

      <div className="bg-white sm:px-10 px-6 py-10 sm:border sm:border-neutral-200/50 sm:shadow-[0_8px_40px_rgba(0,0,0,0.04)] rounded-lg">
        <form className="space-y-6" onSubmit={handleSubmit}>
          
          <div className="space-y-2">
            <label htmlFor="new-password" className="block text-sm font-medium text-neutral-700">
              New password
            </label>
            <div className="relative">
              <input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-50/50 border border-neutral-200/80 rounded-sm text-[15px] text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-neutral-900/5 focus:border-neutral-900/20 transition-all duration-200 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 focus:outline-none p-1.5 rounded-sm transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                    <line x1="2" y1="2" x2="22" y2="22"></line>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirm-password" className="block text-sm font-medium text-neutral-700">
              Confirm password
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-50/50 border border-neutral-200/80 rounded-sm text-[15px] text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-neutral-900/5 focus:border-neutral-900/20 transition-all duration-200 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 focus:outline-none p-1.5 rounded-sm transition-colors"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                    <line x1="2" y1="2" x2="22" y2="22"></line>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2 pt-1 pb-1">
            <p className="text-[13px] font-medium text-neutral-700">Password must contain:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <RequirementItem met={hasMinLength} text="At least 8 characters" />
              <RequirementItem met={hasUppercase} text="One uppercase letter" />
              <RequirementItem met={hasLowercase} text="One lowercase letter" />
              <RequirementItem met={hasNumber} text="One number" />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-sm">
              <p className="text-[13px] font-medium text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-4 bg-neutral-900 text-white rounded-sm py-3.5 text-[15px] font-medium hover:bg-neutral-800 focus:outline-none focus:ring-4 focus:ring-neutral-900/10 transition-all active:scale-[0.98]"
          >
            Reset Password
          </button>

          <div className="text-center">
            <Link
              href="/login"
              className="text-[15px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              Back to login
            </Link>
          </div>
        </form>
      </div>

      <div className="mt-12 text-center">
        <p className="text-[13px] text-neutral-400">&copy; 2026 ConstructCRM</p>
      </div>
    </div>
  );
}
