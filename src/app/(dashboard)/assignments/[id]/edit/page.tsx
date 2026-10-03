'use client';

import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/src/components/ui/button';
import { mockAssignments } from '@/src/features/assignments/data/assignments.mock';
import { AssignmentForm } from '@/src/features/assignments/components/assignment-form';
import { PageHeader } from '@/src/components/ui/page-header';
import { EmptyState } from '@/src/components/ui/empty-state';
import Link from 'next/link';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditAssignmentPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  
  const assignment = mockAssignments.find((a) => a.id === id);

  if (!assignment) {
    return (
      <div className="w-full mx-auto pb-12 min-w-0 max-w-5xl">
        <EmptyState 
          title="Assignments Not Found"
          description="The assignments you are looking for does not exist or has been removed."
          action={
            <Link href="/assignments">
              <Button variant="outline">
                Back to Assignments
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
        title="Edit Contractor Assignment" 
        description="Update the contractor assignment details."
        backLink={{ href: '/assignments', label: 'Back to Assignments' }}
      />

      <AssignmentForm mode="edit" initialData={assignment} />
    </div>
  );
}
