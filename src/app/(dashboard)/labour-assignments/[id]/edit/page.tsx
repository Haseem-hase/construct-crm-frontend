import React, { use } from 'react';
import Link from 'next/link';
import { mockLabourAssignments } from '@/src/features/labour-assignments/data/labour-assignments.mock';
import { LabourAssignmentForm } from '@/src/features/labour-assignments/components/labour-assignment-form';
import { PageHeader } from '@/src/components/ui/page-header';
import { Button } from '@/src/components/ui/button';
import { EmptyState } from '@/src/components/ui/empty-state';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditLabourAssignmentPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  
  const assignment = mockLabourAssignments.find((a) => a.id === id);

  if (!assignment) {
    return (
      <div className="w-full mx-auto pb-12 min-w-0 max-w-5xl">
        <EmptyState 
          title="Labour Assignments Not Found"
          description="The labour assignments you are looking for does not exist or has been removed."
          action={
            <Link href="/labour-assignments">
              <Button variant="outline">
                Back to Labour Assignments
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto pb-12 min-w-0 max-w-4xl">
      <PageHeader 
        title="Edit Labour Assignment" 
        description="Update the period and work details for this labour assignment."
        backLink={{ href: `/labour-assignments/${assignment.id}`, label: 'Back to Assignment Details' }}
      />

      <LabourAssignmentForm mode="edit" initialData={assignment} />
    </div>
  );
}
