import React from 'react';
import { Labour } from '../types/labour.types';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { InlineEdit } from '@/src/components/ui/inline-edit';

interface LabourAdditionalInfoProps {
  labour: Labour;
  onUpdate?: (updates: Partial<Labour>) => void;
}

export function LabourAdditionalInfo({ labour, onUpdate }: LabourAdditionalInfoProps) {
  const handleSave = (field: keyof Labour, value: string) => {
    onUpdate?.({ [field]: value });
    return true;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-neutral-500">Notes</span>
          <div className="text-[15px] text-neutral-900 whitespace-pre-wrap">
            <InlineEdit
              value={labour.notes || ''}
              displayValue={
                labour.notes ? (
                  labour.notes
                ) : (
                  <span className="text-neutral-400 italic">Not provided</span>
                )
              }
              onSave={(v) => handleSave('notes', v)}
              editor="textarea"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
