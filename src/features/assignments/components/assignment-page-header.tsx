'use client';

import React from 'react';
import { Button } from '@/src/components/ui/button';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/src/components/ui/page-header';

export function AssignmentPageHeader() {
  const router = useRouter();

  return (
    <PageHeader 
      title="Contractor Assignments"
      description="Manage contractors assigned to construction projects."
      action={
        <Button onClick={() => router.push('/assignments/create')} variant="primary">
          + Assign Contractor
        </Button>
      }
    />
  );
}
