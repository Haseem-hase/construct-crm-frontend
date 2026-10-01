import React from 'react';
import Link from 'next/link';
import { Button } from '@/src/components/ui/button';

export function LabourAssignmentPageHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-neutral-900 tracking-tight">
          Labour Assignments
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Manage labour assignments across contractor projects.
        </p>
      </div>
      <Link href="/labour-assignments/create">
        <Button variant="primary" className="w-full sm:w-auto">
          + Assign Labour
        </Button>
      </Link>
    </div>
  );
}
