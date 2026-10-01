import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { LabourAssignment } from '../types/labour-assignment.types';

interface LabourAssignmentDetailsHeaderProps {
  assignment: LabourAssignment;
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'ACTIVE': return 'Active';
    case 'COMPLETED': return 'Completed';
    case 'CANCELLED': return 'Cancelled';
    default: return status;
  }
}

function getStatusVariant(status: string): 'default' | 'success' | 'destructive' | 'neutral' {
  switch (status) {
    case 'ACTIVE': return 'success';
    case 'COMPLETED': return 'neutral';
    case 'CANCELLED': return 'destructive';
    default: return 'default';
  }
}

export function LabourAssignmentDetailsHeader({ assignment }: LabourAssignmentDetailsHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4 mb-8">
      <div>
        <Button 
          variant="ghost" 
          onClick={() => router.push('/labour-assignments')} 
          className="-ml-4 text-neutral-500"
        >
          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Labour Assignments
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 mb-2">
            Labour Assignment
          </h1>
          <div className="flex flex-col gap-1 mb-3">
            <span className="text-lg text-neutral-700">{assignment.labourName}</span>
            <span className="text-sm text-neutral-500">{assignment.professionName}</span>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={getStatusVariant(assignment.status)}>
              {getStatusLabel(assignment.status)}
            </Badge>
          </div>
        </div>
        <div className="shrink-0 flex flex-wrap items-center gap-2">
          <Button onClick={() => router.push(`/labour-assignments/${assignment.id}/edit`)} variant="outline">
            Edit Assignment
          </Button>
        </div>
      </div>
    </div>
  );
}
