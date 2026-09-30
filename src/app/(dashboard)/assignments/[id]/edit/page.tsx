'use client';

import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/src/components/ui/button';
import { mockAssignments } from '@/src/features/assignments/data/assignments.mock';
import { AssignmentForm } from '@/src/features/assignments/components/assignment-form';

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
    <div className="max-w-4xl mx-auto pb-16">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 mb-2">
          Edit Contractor Assignment
        </h1>
        <p className="text-neutral-500">
          Update the contractor assignment details.
        </p>
      </div>

      <AssignmentForm mode="edit" initialData={assignment} />
    </div>
  );
}
