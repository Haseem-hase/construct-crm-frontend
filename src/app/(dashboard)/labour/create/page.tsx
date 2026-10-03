'use client';

import React from 'react';
import { LabourForm } from '@/src/features/labour/components/labour-form';
import { PageHeader } from '@/src/components/ui/page-header';

export default function CreateLabourPage() {
  return (
    <div className="w-full mx-auto pb-12 min-w-0 max-w-4xl">
      <PageHeader 
        title="Add Labour" 
        description="Create a labour master record for your organization."
        backLink={{ href: '/labour', label: 'Back to Labour' }}
      />
      <LabourForm mode="create" />
    </div>
  );
}
