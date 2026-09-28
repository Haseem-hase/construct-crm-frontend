import React from 'react';
import { Project } from '../types/project.types';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';

interface ProjectPlanningProps {
  project: Project;
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

export function ProjectPlanning({ project }: ProjectPlanningProps) {
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
            {formattedStart ? formattedStart : <span className="text-neutral-400 italic">Not provided</span>}
          </DetailItem>
          
          <DetailItem label="Planned End Date">
            {formattedEnd ? formattedEnd : <span className="text-neutral-400 italic">Not provided</span>}
          </DetailItem>
        </div>
      </CardContent>
    </Card>
  );
}
