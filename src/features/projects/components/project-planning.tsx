import React from 'react';
import { Project } from '../types/project.types';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { InlineEdit } from '@/src/components/ui/inline-edit';

interface ProjectPlanningProps {
  project: Project;
  onUpdate?: (updates: Partial<Project>) => void;
}

function formatDate(isoString?: string) {
  if (!isoString) return null;
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function DetailItem({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[13px] font-medium text-neutral-500 uppercase tracking-wide">{label}</span>
      <div className="text-[15px] text-neutral-900">{children}</div>
    </div>
  );
}

export function ProjectPlanning({ project, onUpdate }: ProjectPlanningProps) {
  const formattedStart = formatDate(project.startDate);
  const formattedEnd = formatDate(project.plannedEndDate);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Planning</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
          <DetailItem label="Start Date">
            <InlineEdit
              editor="date"
              value={project.startDate?.split('T')[0] || ''}
              onSave={(val) => {
                const newDate = val ? new Date(val).toISOString() : '';
                if (newDate && project.plannedEndDate && new Date(newDate) > new Date(project.plannedEndDate)) {
                  return false;
                }
                if (onUpdate) onUpdate({ startDate: newDate });
              }}
              displayValue={
                formattedStart ? formattedStart : <span className="text-neutral-400 italic">Not provided</span>
              }
            />
          </DetailItem>
          
          <DetailItem label="Planned End Date">
            <InlineEdit
              editor="date"
              value={project.plannedEndDate?.split('T')[0] || ''}
              onSave={(val) => {
                const newDate = val ? new Date(val).toISOString() : '';
                if (newDate && project.startDate && new Date(project.startDate) > new Date(newDate)) {
                  return false;
                }
                if (onUpdate) onUpdate({ plannedEndDate: newDate });
              }}
              displayValue={
                formattedEnd ? formattedEnd : <span className="text-neutral-400 italic">Not provided</span>
              }
            />
          </DetailItem>
        </div>
      </CardContent>
    </Card>
  );
}
