import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Project, ProjectStatus } from '../types/project.types';
import { ProjectStatusActions } from './project-status-actions';
import { PageHeader } from '@/src/components/ui/page-header';

interface ProjectDetailsHeaderProps {
  project: Project;
  onStatusChange: (newStatus: ProjectStatus) => void;
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

export function ProjectDetailsHeader({ project, onStatusChange }: ProjectDetailsHeaderProps) {
  const router = useRouter();

  return (
    <PageHeader 
      title={project.name}
      subtitle={project.projectCode}
      badges={<Badge variant={getStatusVariant(project.status)}>{project.status}</Badge>}
      backLink={{ href: '/projects', label: 'Back to Projects' }}
      action={
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={() => router.push(`/projects/${project.id}/edit`)} variant="outline">
            Edit Project
          </Button>
          <ProjectStatusActions status={project.status} onStatusChange={onStatusChange} />
        </div>
      }
    />
  );
}
