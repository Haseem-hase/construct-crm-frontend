import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { LabourAssignment } from '../types/labour-assignment.types';

interface LabourAssignmentWorkDetailsProps {
  assignment: LabourAssignment;
}

export function LabourAssignmentWorkDetails({ assignment }: LabourAssignmentWorkDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Work Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">
          <span className="text-[13px] font-medium text-neutral-500 uppercase tracking-wide">Notes</span>
          <div className="text-[15px] text-neutral-900 mt-1 whitespace-pre-wrap">
            {assignment.notes || <span className="text-neutral-400 italic">Not provided</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
