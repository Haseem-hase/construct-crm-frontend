'use client';

import React from 'react';
import { CustomerForm } from '@/src/features/customers/components/customer-form';
import { PageHeader } from '@/src/components/ui/page-header';

export default function CreateCustomerPage() {
  return (
    <div className="w-full mx-auto pb-12 min-w-0 max-w-4xl">
      <PageHeader 
        title="Create Customer" 
        description="Add a new customer to your organization."
        backLink={{ href: '/customers', label: 'Back to Customers' }}
      />
      <CustomerForm />
    </div>
  );
}
