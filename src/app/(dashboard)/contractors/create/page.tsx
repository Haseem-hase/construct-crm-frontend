'use client';

import React from 'react';
import { ContractorForm } from '@/src/features/contractors/components/contractor-form';
import { PageHeader } from '@/src/components/ui/page-header';

export default function CreateContractorPage() {
  return (
    <div className="w-full mx-auto pb-12 min-w-0 max-w-4xl">
      <PageHeader 
        title="Add Contractor" 
        description="Create a new contractor for your organization."
        backLink={{ href: '/contractors', label: 'Back to Contractors' }}
      />

      <ContractorForm mode="create" />
    </div>
  );
}
