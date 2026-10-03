import React, { use } from 'react';
import Link from 'next/link';
import { mockLabourAssignments } from '@/src/features/labour-assignments/data/labour-assignments.mock';
import { LabourAssignmentDetailsClient } from '@/src/features/labour-assignments/components/labour-assignment-details';
import { ChevronLeft } from '@/src/components/ui/icons';
import { Button } from '@/src/components/ui/button';
import { EmptyState } from '@/src/components/ui/empty-state';

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

  return <LabourAssignmentDetailsClient assignment={assignment} />;
}
