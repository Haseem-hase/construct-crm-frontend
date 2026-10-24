'use client';

import React from 'react';
import { Button } from '@/src/components/ui/button';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/src/components/ui/page-header';

export function ProjectPageHeader({ readOnly = false }: { readOnly?: boolean }) {
  const router = useRouter();
  
  return (
    <PageHeader 
      title="Projects"
      description="Manage your organization's construction projects."
      action={!readOnly && (
        <Button onClick={() => router.push('/projects/create')} variant="primary">
          + Add Project
        </Button>
      )}
    />
  );
}
