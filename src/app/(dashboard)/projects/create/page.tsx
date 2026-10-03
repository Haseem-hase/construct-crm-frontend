'use client';

import React from 'react';
import { ProjectForm } from '@/src/features/projects/components/project-form';
import { PageHeader } from '@/src/components/ui/page-header';

export default function CreateProjectPage() {
  return (
    <div className="w-full mx-auto pb-12 min-w-0 max-w-4xl">
      <PageHeader 
        title="Create Project" 
        description="Add a new construction project to your organization."
        backLink={{ href: '/projects', label: 'Back to Projects' }}
      />
      <ProjectForm mode="create" />
    </div>
  );
}
