'use client';

import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import { mockCustomers } from '@/src/features/customers/data/customers.mock';
import { CustomerForm } from '@/src/features/customers/components/customer-form';
import { Button } from '@/src/components/ui/button';
import { PageHeader } from '@/src/components/ui/page-header';
import { EmptyState } from '@/src/components/ui/empty-state';
import Link from 'next/link';

export default function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  
  const customer = mockCustomers.find(
    c => c.id === resolvedParams.id || c.customerCode.toLowerCase() === resolvedParams.id.toLowerCase()
  );

  if (!customer) {
    return (
      <div className="w-full mx-auto pb-12 min-w-0 max-w-5xl">
        <EmptyState 
          title="Customers Not Found"
          description="The customers you are looking for does not exist or has been removed."
          action={
            <Link href="/customers">
              <Button variant="outline">
                Back to Customers
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto pb-12 min-w-0 max-w-4xl">
      <PageHeader 
        title="Edit Customer" 
        description={`${customer.name} (${customer.customerCode})`}
        backLink={{ href: `/customers/${customer.customerCode.toLowerCase()}`, label: 'Back to Customer' }}
      />
      <CustomerForm initialData={customer} />
    </div>
  );
}
