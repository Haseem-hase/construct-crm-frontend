import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Project } from '../types/project.types';

interface ProjectDetailsHeaderProps {
  project: Project;
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

export function ProjectDetailsHeader({ project }: ProjectDetailsHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4 mb-8">
      <div>
        <Button 
          variant="ghost" 
          onClick={() => router.push('/projects')} 
          className="-ml-4 text-neutral-500"
        >
          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Projects
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 mb-2">{project.name}</h1>
          <div className="flex items-center gap-3">
            <span className="text-neutral-500 font-mono text-[14px]">{project.projectCode}</span>
            <Badge variant={getStatusVariant(project.status)}>
              {project.status}
            </Badge>
          </div>
        </div>
        <div className="shrink-0">
          <Button onClick={() => router.push(`/projects/${project.id}/edit`)} variant="outline">
            Edit Project
          </Button>
        </div>
      </div>
    </div>
  );
}
