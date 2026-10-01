import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { LabourAssignment } from '../types/labour-assignment.types';
import { InlineEdit } from '@/src/components/ui/inline-edit';

interface LabourAssignmentWorkDetailsProps {
  assignment: LabourAssignment;
  onUpdate?: (updates: Partial<LabourAssignment>) => void;
}

export function LabourAssignmentWorkDetails({ assignment, onUpdate }: LabourAssignmentWorkDetailsProps) {
  const handleNotesSave = (newNotes: string) => {
    onUpdate?.({ notes: newNotes });
    return true;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Work Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">
          <span className="text-[13px] font-medium text-neutral-500 uppercase tracking-wide">Notes</span>
          <div className="text-[15px] text-neutral-900 mt-1">
            <InlineEdit
              value={assignment.notes || ''}
              onSave={handleNotesSave}
              editor="textarea"
              displayValue={
                assignment.notes ? (
                  <span className="whitespace-pre-wrap">{assignment.notes}</span>
                ) : (
                  <span className="text-neutral-400 italic">Not provided</span>
                )
              }
              disabled={!onUpdate}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
