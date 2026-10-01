import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { LabourAssignment } from '../types/labour-assignment.types';

interface LabourAssignmentPeriodProps {
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

export function LabourAssignmentPeriod({ assignment }: LabourAssignmentPeriodProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assignment Period</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
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
