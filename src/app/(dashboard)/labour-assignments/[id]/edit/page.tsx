import React, { use } from 'react';
import Link from 'next/link';
import { mockLabourAssignments } from '@/src/features/labour-assignments/data/labour-assignments.mock';
import { LabourAssignmentForm } from '@/src/features/labour-assignments/components/labour-assignment-form';
import { ChevronLeft } from '@/src/components/ui/icons';
import { Button } from '@/src/components/ui/button';

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
      <div className="flex flex-col max-w-5xl mx-auto w-full pb-12">
        <Link 
          href="/labour-assignments" 
          className="inline-flex items-center text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors w-fit mb-8"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Labour Assignments
        </Link>
        <div className="flex flex-col items-center justify-center py-24 text-center border border-neutral-200 rounded-lg bg-white">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 mb-2">Labour Assignment Not Found</h2>
          <p className="text-neutral-500 mb-6">The requested labour assignment could not be found for editing.</p>
          <Link href="/labour-assignments">
            <Button>
              Back to Labour Assignments
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-12 max-w-5xl mx-auto w-full">
      <div className="flex flex-col gap-2">
        <Link 
          href={`/labour-assignments/${assignment.id}`} 
          className="inline-flex items-center text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors w-fit"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Assignment Details
        </Link>
        <div className="mt-4">
          <h1 className="text-2xl md:text-3xl font-semibold text-neutral-900 tracking-tight">
            Edit Labour Assignment
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Update the period and work details for this labour assignment.
          </p>
        </div>
      </div>

      <LabourAssignmentForm mode="edit" initialData={assignment} />
    </div>
  );
}
