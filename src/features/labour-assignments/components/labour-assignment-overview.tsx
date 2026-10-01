import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { LabourAssignment } from '../types/labour-assignment.types';

interface LabourAssignmentOverviewProps {
  assignment: LabourAssignment;
}

function formatDate(isoString?: string) {
  if (!isoString) return 'Not provided';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
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

export function LabourAssignmentOverview({ assignment }: LabourAssignmentOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assignment Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-6 gap-x-8">
          <DetailItem label="Status">
            <Badge variant={getStatusVariant(assignment.status)}>
              {getStatusLabel(assignment.status)}
            </Badge>
          </DetailItem>
          
          <DetailItem label="Start Date">
            {formatDate(assignment.startDate)}
          </DetailItem>

          <DetailItem label="End Date">
            {formatDate(assignment.endDate)}
          </DetailItem>
        </div>
      </CardContent>
    </Card>
  );
}
