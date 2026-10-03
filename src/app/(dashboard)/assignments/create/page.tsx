import React from 'react';
import { AssignmentForm } from '@/src/features/assignments/components/assignment-form';
import { PageHeader } from '@/src/components/ui/page-header';

export default function CreateAssignmentPage() {
  return (
    <div className="w-full mx-auto pb-12 min-w-0 max-w-4xl">
      <PageHeader 
        title="Create Contractor Assignment" 
        description="Assign a contractor to a project and define their responsibilities."
        backLink={{ href: '/assignments', label: 'Back to Assignments' }}
      />
      <AssignmentForm />
    </div>
  );
}
