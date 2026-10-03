import React, { useState } from 'react';
import { Assignment } from '../types/assignment.types';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { MultiSelect } from '@/src/components/ui/multi-select';
import { RESPONSIBILITY_OPTIONS } from '../data/assignment-options';

interface AssignmentResponsibilitiesProps {
  assignment: Assignment;
  onUpdate?: (updates: Partial<Assignment>) => void;
}

export function AssignmentResponsibilities({ assignment, onUpdate }: AssignmentResponsibilitiesProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState<string[]>(assignment.responsibilityIds || []);

  const hasResponsibilities = assignment.responsibilityNames && assignment.responsibilityNames.length > 0;

  const responsibilityMultiSelectOptions = RESPONSIBILITY_OPTIONS.map((r) => ({
    value: r.id,
    label: r.name,
  }));

  const handleSave = () => {
    // Map selected IDs back to names for immediate UI update in the display mode
    const updatedNames = editValue.map(
      (id) => RESPONSIBILITY_OPTIONS.find((r) => r.id === id)?.name || id
    );
    
    onUpdate?.({
      responsibilityIds: editValue,
      responsibilityNames: updatedNames,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(assignment.responsibilityIds || []);
    setIsEditing(false);
  };

  return (
    <Card className={isEditing ? 'overflow-visible' : ''}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Responsibilities</CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="flex flex-col gap-4">
            <MultiSelect
              options={responsibilityMultiSelectOptions}
              value={editValue}
              onChange={setEditValue}
              placeholder="Select responsibilities"
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={handleCancel}>Cancel</Button>
              <Button variant="primary" size="sm" onClick={handleSave}>Save</Button>
            </div>
          </div>
        ) : (
          <div className="group relative inline-flex items-center min-w-full">
            <button
              type="button"
              className="text-left w-full hover:bg-neutral-50 p-2 -mx-2 rounded-md border border-transparent hover:border-neutral-200 transition-colors"
              onClick={() => {
                if (onUpdate) {
                  setEditValue(assignment.responsibilityIds || []);
                  setIsEditing(true);
                }
              }}
              disabled={!onUpdate}
              aria-label="Edit responsibilities"
            >
              {!hasResponsibilities ? (
                <div className="text-[15px] text-neutral-400 italic">
                  Not specified
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 pointer-events-none">
                  {assignment.responsibilityNames.map((name, index) => (
                    <Badge key={index} variant="default" className="bg-neutral-100 text-neutral-700 border-transparent">
                      {name}
                    </Badge>
                  ))}
                </div>
              )}
              {onUpdate && (
                <svg className="absolute top-1/2 right-2 -translate-y-1/2 w-4 h-4 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              )}
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
