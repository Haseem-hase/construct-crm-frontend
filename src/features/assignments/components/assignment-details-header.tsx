'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Assignment } from '../types/assignment.types';
import { AssignmentStatusActions } from './assignment-status-actions';
import { PageHeader } from '@/src/components/ui/page-header';

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
    <PageHeader 
      title="Contractor Project Assignment"
      badges={<Badge variant={getStatusVariant(assignment.status)}>{getStatusLabel(assignment.status)}</Badge>}
      backLink={{ href: '/assignments', label: 'Back to Assignments' }}
      action={
        <div className="flex flex-wrap items-center gap-2">
          <AssignmentStatusActions 
            status={assignment.status} 
            onStatusChange={onStatusChange} 
          />
          <Button onClick={() => router.push(`/assignments/${assignment.id}/edit`)} variant="outline">
            Edit Assignment
          </Button>
        </div>
      }
    />
  );
}
