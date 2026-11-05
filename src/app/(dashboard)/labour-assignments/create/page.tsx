import React from 'react';
import { LabourAssignmentForm } from '@/src/features/labour-assignments/components/labour-assignment-form';
import { PageHeader } from '@/src/components/ui/page-header';

interface CreateLabourAssignmentPageProps {
  searchParams: Promise<{ projectId?: string | string[] }>;
}

export default async function CreateLabourAssignmentPage({ searchParams }: CreateLabourAssignmentPageProps) {
  const params = await searchParams;
  const projectId = Array.isArray(params.projectId) ? params.projectId[0] : params.projectId;
  const returnTo = projectId ? `/projects/${encodeURIComponent(projectId)}` : '/labour-assignments';
  return (
    <div className="w-full mx-auto pb-12 min-w-0 max-w-4xl">
      <PageHeader 
        title="Create Labour Assignment" 
        description="Assign a labour worker to an existing contractor project assignment."
        backLink={{ href: returnTo, label: projectId ? 'Back to Project' : 'Back to Labour Assignments' }}
      />

      <LabourAssignmentForm initialProjectId={projectId} returnTo={returnTo} />
    </div>
  );
}
