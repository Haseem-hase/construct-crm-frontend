import React from 'react';
import { AssignmentForm } from '@/src/features/assignments/components/assignment-form';
import { PageHeader } from '@/src/components/ui/page-header';

interface CreateAssignmentPageProps {
  searchParams: Promise<{ projectId?: string | string[] }>;
}

export default async function CreateAssignmentPage({ searchParams }: CreateAssignmentPageProps) {
  const params = await searchParams;
  const projectId = Array.isArray(params.projectId) ? params.projectId[0] : params.projectId;
  const returnTo = projectId ? `/projects/${encodeURIComponent(projectId)}` : '/assignments';
  return (
    <div className="w-full mx-auto pb-12 min-w-0 max-w-4xl">
      <PageHeader 
        title="Create Contractor Assignment" 
        description="Assign a contractor to a project and define their responsibilities."
        backLink={{ href: returnTo, label: projectId ? 'Back to Project' : 'Back to Assignments' }}
      />
      <AssignmentForm initialProjectId={projectId} returnTo={returnTo} />
    </div>
  );
}
