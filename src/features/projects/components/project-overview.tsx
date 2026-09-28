import React from 'react';
import { Project } from '../types/project.types';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Progress } from '@/src/components/ui/progress';
import { InlineEdit } from '@/src/components/ui/inline-edit';
import { ProjectStatus } from '../types/project.types';

interface ProjectOverviewProps {
  project: Project;
  onUpdate?: (updates: Partial<Project>) => void;
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

export function ProjectOverview({ project, onUpdate }: ProjectOverviewProps) {
  const statusOptions = [
    { value: 'Planning', label: 'Planning' },
    { value: 'Active', label: 'Active' },
    { value: 'Completed', label: 'Completed' },
    { value: 'On Hold', label: 'On Hold' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
          <DetailItem label="Project Name">
            <InlineEdit 
              value={project.name}
              onSave={(val) => {
                if (!val.trim()) return false;
                if (onUpdate) onUpdate({ name: val });
              }}
            />
          </DetailItem>
          
          <DetailItem label="Project Code">
            <span className="font-mono text-neutral-600">{project.projectCode}</span>
          </DetailItem>

          <DetailItem label="Status">
            <InlineEdit
              editor="select"
              options={statusOptions}
              value={project.status}
              onSave={(val) => onUpdate && onUpdate({ status: val as ProjectStatus })}
              displayValue={
                <Badge variant={getStatusVariant(project.status)}>
                  {project.status}
                </Badge>
              }
            />
          </DetailItem>

          <DetailItem label="Progress">
            <InlineEdit
              editor="number"
              value={project.progress.toString()}
              onSave={(val) => {
                const num = parseInt(val, 10);
                if (isNaN(num) || num < 0 || num > 100) return false;
                if (onUpdate) onUpdate({ progress: num });
              }}
              displayValue={
                <Progress value={project.progress} showValue className="w-full max-w-[200px]" />
              }
            />
          </DetailItem>

          <DetailItem label="Created Date">
            {formatDate(project.createdAt)}
          </DetailItem>

          <div className="sm:col-span-2">
            <DetailItem label="Description">
              <InlineEdit
                editor="textarea"
                value={project.description || ''}
                onSave={(val) => onUpdate && onUpdate({ description: val })}
                displayValue={
                  project.description ? (
                    <p className="text-neutral-700 whitespace-pre-wrap">{project.description}</p>
                  ) : (
                    <span className="text-neutral-400 italic">Not provided</span>
                  )
                }
              />
            </DetailItem>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
