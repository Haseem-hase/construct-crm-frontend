'use client';

import React from 'react';
import { Button } from '@/src/components/ui/button';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/src/components/ui/page-header';

export function CustomerPageHeader() {
  const router = useRouter();

  return (
    <PageHeader 
      title="Customers"
      description="Manage your organization's customers."
      action={
        <Button onClick={() => router.push('/customers/create')} variant="primary">
          + Add Customer
        </Button>
      }
    />
  );
}
