'use client';

import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/src/components/ui/button';
import { mockAssignments } from '@/src/features/assignments/data/assignments.mock';
import { AssignmentDetailsHeader } from '@/src/features/assignments/components/assignment-details-header';
import { AssignmentRelationship } from '@/src/features/assignments/components/assignment-relationship';
import { AssignmentOverview } from '@/src/features/assignments/components/assignment-overview';
import { AssignmentResponsibilities } from '@/src/features/assignments/components/assignment-responsibilities';
import { AssignmentWorkDetails } from '@/src/features/assignments/components/assignment-work-details';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function AssignmentDetailsPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  
  const assignment = mockAssignments.find((a) => a.id === id);

  if (!assignment) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 mb-2">Assignment Not Found</h2>
        <p className="text-neutral-500 mb-6">The assignment you&apos;re looking for could not be found.</p>
        <Button onClick={() => router.push('/assignments')}>
          Back to Assignments
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col max-w-6xl mx-auto pb-16">
      <AssignmentDetailsHeader assignment={assignment} />
      <AssignmentRelationship assignment={assignment} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <AssignmentOverview assignment={assignment} />
          <AssignmentWorkDetails assignment={assignment} />
        </div>
        <div className="lg:col-span-1 flex flex-col gap-8">
          <AssignmentResponsibilities assignment={assignment} />
        </div>
      </div>
    </div>
  );
}

