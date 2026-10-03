import React from 'react';
import { LabourAssignmentForm } from '@/src/features/labour-assignments/components/labour-assignment-form';
import { PageHeader } from '@/src/components/ui/page-header';

export default function CreateLabourAssignmentPage() {
  return (
    <div className="w-full mx-auto pb-12 min-w-0 max-w-4xl">
      <PageHeader 
        title="Create Labour Assignment" 
        description="Assign a labour worker to an existing contractor project assignment."
        backLink={{ href: '/labour-assignments', label: 'Back to Labour Assignments' }}
      />

      <LabourAssignmentForm />
    </div>
  );
}
