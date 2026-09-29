import React from 'react';
import { Assignment } from '../types/assignment.types';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';

interface AssignmentWorkDetailsProps {
  assignment: Assignment;
}

function DetailItem({ label, children }: { label: string, children?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[13px] font-medium text-neutral-500 uppercase tracking-wide">{label}</span>
      <div className="text-[15px] text-neutral-900">
        {children}
      </div>
    </div>
  );
}

export function AssignmentWorkDetails({ assignment }: AssignmentWorkDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Work Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-y-6">
          <DetailItem label="Scope">
            {assignment.scope ? (
              <p className="text-neutral-700 whitespace-pre-wrap">{assignment.scope}</p>
            ) : (
              <span className="text-neutral-400 italic">Not provided</span>
            )}
          </DetailItem>

          <DetailItem label="Notes">
            {assignment.notes ? (
              <p className="text-neutral-700 whitespace-pre-wrap">{assignment.notes}</p>
            ) : (
              <span className="text-neutral-400 italic">Not provided</span>
            )}
          </DetailItem>
        </div>
      </CardContent>
    </Card>
  );
}
