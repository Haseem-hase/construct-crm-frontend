'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-[440px] mx-auto px-4 py-12">
      <div className="flex flex-col items-center mb-5 text-center">
        {/* <div className="mb-8">
          <span className="text-xl font-semibold tracking-tight text-neutral-900">
            ConstructCRM
          </span>
        </div> */}
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 mb-2">
          Welcome back
        </h1>
        <p className="text-[15px] text-neutral-500">
          Sign in to your organization
        </p>
      </div>

      <div className="bg-white sm:px-10 px-6 py-10 sm:border sm:border-neutral-200/50 sm:shadow-[0_8px_40px_rgba(0,0,0,0.04)] rounded-lg">
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
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

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                    <line x1="2" y1="2" x2="22" y2="22"></line>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-neutral-900 text-white rounded-sm py-3.5 text-[15px] font-medium hover:bg-neutral-800 focus:outline-none focus:ring-4 focus:ring-neutral-900/10 transition-all active:scale-[0.98]"
          >
            Sign In
          </button>
        </form>
      </div>

      <div className="mt-12 text-center">
        <p className="text-[13px] text-neutral-400">&copy; 2026 ConstructCRM</p>
      </div>
    </div>
  );
}
