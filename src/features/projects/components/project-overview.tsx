import React from 'react';
import { Project } from '../types/project.types';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Progress } from '@/src/components/ui/progress';

interface ProjectOverviewProps {
  project: Project;
}

function formatDate(isoString: string) {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function getStatusVariant(status: string): 'default' | 'success' | 'warning' | 'destructive' | 'info' | 'neutral' {
  switch (status) {
    case 'Active': return 'success';
    case 'Planning': return 'info';
    case 'On Hold': return 'warning';
    case 'Completed': return 'neutral';
    default: return 'default';
  }
}

function DetailItem({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[13px] font-medium text-neutral-500 uppercase tracking-wide">{label}</span>
      <div className="text-[15px] text-neutral-900">{children}</div>
    </div>
  );
}

export function ProjectOverview({ project }: ProjectOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
          <DetailItem label="Project Name">
            {project.name}
          </DetailItem>
          
          <DetailItem label="Project Code">
            <span className="font-mono text-neutral-600">{project.projectCode}</span>
          </DetailItem>

          <DetailItem label="Status">
            <Badge variant={getStatusVariant(project.status)}>
              {project.status}
            </Badge>
          </DetailItem>

          <DetailItem label="Progress">
            <Progress value={project.progress} showValue className="w-full max-w-[200px]" />
          </DetailItem>

          <DetailItem label="Created Date">
            {formatDate(project.createdAt)}
          </DetailItem>

          <div className="sm:col-span-2">
            <DetailItem label="Description">
              {project.description ? (
                <p className="text-neutral-700 whitespace-pre-wrap">{project.description}</p>
              ) : (
                <span className="text-neutral-400 italic">Not provided</span>
              )}
            </DetailItem>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
