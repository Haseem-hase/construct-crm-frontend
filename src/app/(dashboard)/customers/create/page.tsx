'use client';

import React from 'react';
import { CustomerForm } from '@/src/features/customers/components/customer-form';
import { Button } from '@/src/components/ui/button';
import { useRouter } from 'next/navigation';

export default function CreateCustomerPage() {
  const router = useRouter();

  return (
    <div className="w-full mx-auto pb-8 min-w-0">
      <div className="flex flex-col gap-4 mb-8">
        <div>
          <Button variant="ghost" onClick={() => router.push('/customers')} className="-ml-4 text-neutral-500">
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Customers
          </Button>
        </div>
        <div className="min-w-0">
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 truncate">Create Customer</h1>
          <p className="text-[15px] text-neutral-500 mt-1 truncate">Add a new customer to your organization.</p>
        </div>
      </div>
      
      <CustomerForm />
    </div>
  );
}
