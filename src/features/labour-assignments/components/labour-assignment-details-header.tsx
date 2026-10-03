import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { LabourAssignment } from '../types/labour-assignment.types';
import { LabourAssignmentStatusActions } from './labour-assignment-status-actions';
import { PageHeader } from '@/src/components/ui/page-header';

interface LabourAssignmentDetailsHeaderProps {
  assignment: LabourAssignment;
  onStatusChange?: (status: LabourAssignment['status']) => void;
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

export function LabourAssignmentDetailsHeader({ assignment, onStatusChange }: LabourAssignmentDetailsHeaderProps) {
  const router = useRouter();

  return (
    <PageHeader 
      title="Labour Assignment"
      description={`${assignment.labourName} · ${assignment.professionName}`}
      badges={<Badge variant={getStatusVariant(assignment.status)}>{getStatusLabel(assignment.status)}</Badge>}
      backLink={{ href: '/labour-assignments', label: 'Back to Labour Assignments' }}
      action={
        <div className="flex flex-wrap items-center gap-2">
          {onStatusChange && (
            <LabourAssignmentStatusActions status={assignment.status} onStatusChange={onStatusChange} />
          )}
          <Button onClick={() => router.push(`/labour-assignments/${assignment.id}/edit`)} variant="outline">
            Edit Assignment
          </Button>
        </div>
      }
    />
  );
}
