'use client';

import React from 'react';
import { Button } from '@/src/components/ui/button';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/src/components/ui/page-header';

export function LabourAssignmentPageHeader() {
  const router = useRouter();

  return (
    <PageHeader 
      title="Labour Assignments"
      description="Manage labour assignments across contractor projects."
      action={
        <Button onClick={() => router.push('/labour-assignments/create')} variant="primary">
          + Assign Labour
        </Button>
      }
    />
  );
}
