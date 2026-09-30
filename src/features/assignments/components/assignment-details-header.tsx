'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Assignment } from '../types/assignment.types';
import { AssignmentStatusActions } from './assignment-status-actions';

interface AssignmentDetailsHeaderProps {
  assignment: Assignment;
  onStatusChange: (status: Assignment['status']) => void;
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'PENDING': return 'Pending';
    case 'ACTIVE': return 'Active';
    case 'ON_HOLD': return 'On Hold';
    case 'COMPLETED': return 'Completed';
    case 'TERMINATED': return 'Terminated';
    case 'CANCELLED': return 'Cancelled';
    default: return status;
  }
}

function getStatusVariant(status: string): 'default' | 'success' | 'warning' | 'destructive' | 'info' | 'neutral' {
  switch (status) {
    case 'PENDING': return 'warning';
    case 'ACTIVE': return 'success';
    case 'ON_HOLD': return 'warning';
    case 'COMPLETED': return 'neutral';
    case 'TERMINATED': return 'destructive';
    case 'CANCELLED': return 'neutral';
    default: return 'default';
  }
}

export function AssignmentDetailsHeader({ assignment, onStatusChange }: AssignmentDetailsHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4 mb-8">
      <div>
        <Button 
          variant="ghost" 
          onClick={() => router.push('/assignments')} 
          className="-ml-4 text-neutral-500"
        >
          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Assignments
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 mb-2">
            Contractor Project Assignment
          </h1>
          <div className="flex items-center gap-3">
            <Badge variant={getStatusVariant(assignment.status)}>
              {getStatusLabel(assignment.status)}
            </Badge>
          </div>
        </div>
        <div className="shrink-0 flex flex-wrap items-center gap-2">
          <AssignmentStatusActions 
            status={assignment.status} 
            onStatusChange={onStatusChange} 
          />
          <Button onClick={() => router.push(`/assignments/${assignment.id}/edit`)} variant="outline">
            Edit Assignment
          </Button>
        </div>
      </div>
    </div>
  );
}
