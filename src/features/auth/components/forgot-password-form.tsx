'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export function ForgotPasswordForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending email
    setIsSubmitted(true);
  };

  return (
    <div className="w-full max-w-[440px] mx-auto px-4 py-12">
      <div className="flex flex-col items-center mb-5 text-center">
        {/* Same branding treatment as the Login page */}
        {/* <div className="mb-8">
          <span className="text-xl font-semibold tracking-tight text-neutral-900">
            ConstructCRM
          </span>
        </div> */}
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 mb-2">
          {isSubmitted ? 'Check your email' : 'Forgot your password?'}
        </h1>
        <p className="text-[15px] text-neutral-500">
          {isSubmitted
            ? "If an account exists with that email address, you'll receive a password reset link shortly."
            : "Enter your email address and we'll send you a link to reset your password."}
        </p>
      </div>

      <div className="bg-white sm:px-10 px-6 py-10 sm:border sm:border-neutral-200/50 sm:shadow-[0_8px_40px_rgba(0,0,0,0.04)] rounded-lg">
        {!isSubmitted ? (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-neutral-50/50 border border-neutral-200/80 rounded-sm text-[15px] text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-neutral-900/5 focus:border-neutral-900/20 transition-all duration-200"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full mt-4 bg-neutral-900 text-white rounded-sm py-3.5 text-[15px] font-medium hover:bg-neutral-800 focus:outline-none focus:ring-4 focus:ring-neutral-900/10 transition-all active:scale-[0.98]"
            >
              Send Reset Link
            </button>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="text-[15px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                Back to login
              </Link>
            </div>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-600"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            
            <Link
              href="/login"
              className="w-full text-center bg-neutral-900 text-white rounded-sm py-3.5 text-[15px] font-medium hover:bg-neutral-800 focus:outline-none focus:ring-4 focus:ring-neutral-900/10 transition-all active:scale-[0.98]"
            >
              Back to login
            </Link>
          </div>
        )}
      </div>

      <div className="mt-12 text-center">
        <p className="text-[13px] text-neutral-400">&copy; 2026 ConstructCRM</p>
      </div>
    </div>
  );
}
