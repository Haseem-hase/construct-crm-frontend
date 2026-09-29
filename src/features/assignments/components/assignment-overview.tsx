import React from 'react';
import { Assignment } from '../types/assignment.types';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';

interface AssignmentOverviewProps {
  assignment: Assignment;
}

function formatDate(isoString?: string) {
  if (!isoString) return 'Not provided';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
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

function DetailItem({ label, children, emptyMessage = 'Not provided' }: { label: string, children?: React.ReactNode, emptyMessage?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[13px] font-medium text-neutral-500 uppercase tracking-wide">{label}</span>
      <div className="text-[15px] text-neutral-900">
        {children || <span className="text-neutral-400 italic">{emptyMessage}</span>}
      </div>
    </div>
  );
}

export function AssignmentOverview({ assignment }: AssignmentOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assignment Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
          <DetailItem label="Status">
            <Badge variant={getStatusVariant(assignment.status)}>
              {getStatusLabel(assignment.status)}
            </Badge>
          </DetailItem>
          
          <DetailItem label="Start Date">
            {assignment.startDate ? formatDate(assignment.startDate) : <span className="text-neutral-400 italic">Not provided</span>}
          </DetailItem>

          <DetailItem label="End Date">
            {assignment.endDate ? formatDate(assignment.endDate) : <span className="text-neutral-400 italic">Not provided</span>}
          </DetailItem>
        </div>
      </CardContent>
    </Card>
  );
}
