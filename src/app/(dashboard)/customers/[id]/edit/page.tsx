'use client';

import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import { mockCustomers } from '@/src/features/customers/data/customers.mock';
import { CustomerForm } from '@/src/features/customers/components/customer-form';
import { Button } from '@/src/components/ui/button';

export default function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  
  const customer = mockCustomers.find(
    c => c.id === resolvedParams.id || c.customerCode.toLowerCase() === resolvedParams.id.toLowerCase()
  );

  if (!customer) {
    return (
      <div className="w-full mx-auto pb-8 min-w-0 flex flex-col items-center justify-center pt-24">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-2">Customer not found</h1>
        <p className="text-neutral-500 mb-6">We couldn&apos;t find the customer you&apos;re looking for.</p>
        <Button variant="outline" onClick={() => router.push('/customers')}>
          Back to Customers
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto pb-8 min-w-0">
      <div className="flex flex-col gap-4 mb-8">
        <div>
          <Button 
            variant="ghost" 
            onClick={() => router.push(`/customers/${customer.customerCode.toLowerCase()}`)} 
            className="-ml-4 text-neutral-500"
          >
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Customer
          </Button>
        </div>
        <div className="min-w-0">
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 truncate">Edit Customer</h1>
          <p className="text-[15px] text-neutral-500 mt-1 truncate">{customer.name} ({customer.customerCode})</p>
        </div>
      </div>
      
      <CustomerForm initialData={customer} />
    </div>
  );
}
