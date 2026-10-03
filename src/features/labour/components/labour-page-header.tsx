'use client';

import React from 'react';
import { Button } from '@/src/components/ui/button';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/src/components/ui/page-header';

export function LabourPageHeader() {
  const router = useRouter();
  
  return (
    <PageHeader 
      title="Labour"
      description="Manage labour master records and workforce information."
      action={
        <Button onClick={() => router.push('/labour/create')} variant="primary">
          + Add Labour
        </Button>
      }
    />
  );
}
