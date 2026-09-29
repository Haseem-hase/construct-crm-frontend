import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from '@/src/components/ui/icons';
import { AssignmentForm } from '@/src/features/assignments/components/assignment-form';

export default function CreateAssignmentPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 w-full">
      <div className="flex flex-col gap-2">
        <Link href="/assignments" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 flex items-center w-fit mb-2">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Assignments
        </Link>
        <div className="flex items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-semibold text-neutral-900">Create Contractor Assignment</h1>
        </div>
        <p className="text-sm text-neutral-500">
          Assign a contractor to a project and define their responsibilities.
        </p>
      </div>

      <AssignmentForm />
    </div>
  );
}
