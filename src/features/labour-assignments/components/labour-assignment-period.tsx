import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { LabourAssignment } from '../types/labour-assignment.types';
import { InlineEdit } from '@/src/components/ui/inline-edit';
import { mockAssignments } from '@/src/features/assignments/data/assignments.mock';
import { mockLabourAssignments } from '@/src/features/labour-assignments/data/labour-assignments.mock';

interface LabourAssignmentPeriodProps {
  assignment: LabourAssignment;
  onUpdate?: (updates: Partial<LabourAssignment>) => void;
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
      <div className="text-[15px] text-neutral-900 flex-1">
        {children || <span className="text-neutral-400 italic">{emptyMessage}</span>}
      </div>
    </div>
  );
}

export function LabourAssignmentPeriod({ assignment, onUpdate }: LabourAssignmentPeriodProps) {
  const [error, setError] = useState<string | null>(null);

  const selectedParentAssignment = useMemo(() => {
    return mockAssignments.find((a) => a.id === assignment.contractorProjectAssignmentId);
  }, [assignment.contractorProjectAssignmentId]);

  const checkOverlap = (newStartStr: string, newEndStr: string) => {
    const start = new Date(newStartStr);
    const end = new Date(newEndStr);

    const existingAssignments = mockLabourAssignments.filter(
      (la) => la.labourId === assignment.labourId && la.id !== assignment.id
    );

    const hasOverlap = existingAssignments.some((la) => {
      if (!la.startDate || !la.endDate) return false;
      const exStart = new Date(la.startDate);
      const exEnd = new Date(la.endDate);
      return exStart <= end && exEnd >= start;
    });

    if (hasOverlap) {
      return 'This labour already has an assignment during the selected period.';
    }
    return null;
  };

  const validateDates = (startStr: string, endStr: string) => {
    if (!startStr || !endStr) {
      return 'Start date and End date are required.';
    }
    const start = new Date(startStr);
    const end = new Date(endStr);
    
    if (end < start) {
      return 'End date must be on or after the start date.';
    }

    if (selectedParentAssignment) {
      if (selectedParentAssignment.startDate) {
        const parentStart = new Date(selectedParentAssignment.startDate);
        if (start < parentStart) {
          return `Start date cannot be before parent assignment start date (${selectedParentAssignment.startDate}).`;
        }
      }
      if (selectedParentAssignment.endDate) {
        const parentEnd = new Date(selectedParentAssignment.endDate);
        if (end > parentEnd) {
          return `End date cannot be after parent assignment end date (${selectedParentAssignment.endDate}).`;
        }
      }
    }

    return checkOverlap(startStr, endStr);
  };

  const handleStartDateSave = (newStartDate: string) => {
    const validationError = validateDates(newStartDate, assignment.endDate || '');
    if (validationError) {
      setError(validationError);
      return false;
    }
    
    setError(null);
    onUpdate?.({ startDate: newStartDate });
    return true;
  };

  const handleEndDateSave = (newEndDate: string) => {
    const validationError = validateDates(assignment.startDate || '', newEndDate);
    if (validationError) {
      setError(validationError);
      return false;
    }
    
    setError(null);
    onUpdate?.({ endDate: newEndDate });
    return true;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assignment Period</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
          <DetailItem label="Start Date">
            <InlineEdit
              value={assignment.startDate || ''}
              onSave={handleStartDateSave}
              editor="date"
              displayValue={assignment.startDate ? formatDate(assignment.startDate) : undefined}
              disabled={!onUpdate}
            />
          </DetailItem>
          <DetailItem label="End Date">
            <InlineEdit
              value={assignment.endDate || ''}
              onSave={handleEndDateSave}
              editor="date"
              displayValue={assignment.endDate ? formatDate(assignment.endDate) : undefined}
              disabled={!onUpdate}
            />
          </DetailItem>
        </div>
      </CardContent>
    </Card>
  );
}
