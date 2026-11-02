'use client';

import React from 'react';
import { Button } from '@/src/components/ui/button';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/src/components/ui/page-header';

export function ContractorPageHeader({ readOnly = false }: { readOnly?: boolean }) {
  const router = useRouter();
  
  return (
    <PageHeader 
      title="Contractors"
      description="Manage contractors and their organization-level information."
      action={!readOnly && (
        <Button onClick={() => router.push('/contractors/create')} variant="primary">
          + Add Contractor
        </Button>
      )}
    />
  );
}
