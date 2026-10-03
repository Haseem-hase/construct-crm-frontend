import React from 'react';
import { Assignment } from '../types/assignment.types';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { InlineEdit } from '@/src/components/ui/inline-edit';

interface AssignmentWorkDetailsProps {
  assignment: Assignment;
  onUpdate?: (updates: Partial<Assignment>) => void;
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

export function AssignmentWorkDetails({ assignment, onUpdate }: AssignmentWorkDetailsProps) {
  const handleScopeSave = (newScope: string) => {
    onUpdate?.({ scope: newScope });
  };

  const handleNotesSave = (newNotes: string) => {
    onUpdate?.({ notes: newNotes });
  };

  const renderTextContent = (text?: string | null) => {
    if (!text) return undefined;
    return <p className="text-neutral-700 whitespace-pre-wrap">{text}</p>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Work Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-y-6">
          <DetailItem label="Scope">
            <InlineEdit
              value={assignment.scope || ''}
              onSave={handleScopeSave}
              editor="textarea"
              displayValue={renderTextContent(assignment.scope)}
              disabled={!onUpdate}
            />
          </DetailItem>

          <DetailItem label="Notes">
            <InlineEdit
              value={assignment.notes || ''}
              onSave={handleNotesSave}
              editor="textarea"
              displayValue={renderTextContent(assignment.notes)}
              disabled={!onUpdate}
            />
          </DetailItem>
        </div>
      </CardContent>
    </Card>
  );
}
