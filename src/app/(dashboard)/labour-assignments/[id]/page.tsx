import React, { use } from 'react';
import Link from 'next/link';
import { mockLabourAssignments } from '@/src/features/labour-assignments/data/labour-assignments.mock';
import { LabourAssignmentDetailsClient } from '@/src/features/labour-assignments/components/labour-assignment-details';
import { ChevronLeft } from '@/src/components/ui/icons';
import { Button } from '@/src/components/ui/button';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function LabourAssignmentDetailsPage({ params }: PageProps) {
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
          <p className="text-neutral-500 mb-6">The requested labour assignment could not be found.</p>
          <Link href="/labour-assignments">
            <Button>
              Back to Labour Assignments
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return <LabourAssignmentDetailsClient assignment={assignment} />;
}
