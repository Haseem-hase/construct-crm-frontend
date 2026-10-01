import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from '@/src/components/ui/icons';
import { LabourAssignmentForm } from '@/src/features/labour-assignments/components/labour-assignment-form';

export default function CreateLabourAssignmentPage() {
  return (
    <div className="flex flex-col gap-8 pb-12 max-w-5xl mx-auto w-full">
      <div className="flex flex-col gap-2">
        <Link 
          href="/labour-assignments" 
          className="inline-flex items-center text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors w-fit"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Labour Assignments
        </Link>
        <div className="mt-4">
          <h1 className="text-2xl md:text-3xl font-semibold text-neutral-900 tracking-tight">
            Create Labour Assignment
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Assign a labour worker to an existing contractor project assignment.
          </p>
        </div>
      </div>

      <LabourAssignmentForm />
    </div>
  );
}
