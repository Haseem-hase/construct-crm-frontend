import React from 'react';
import { useRouter } from 'next/navigation';
import { Project } from '../types/project.types';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Card } from '@/src/components/ui/card';
import { Progress } from '@/src/components/ui/progress';
import { projectImageUrl } from '../utils/project-image';

interface ProjectGridProps {
  projects: Project[];
  readOnly?: boolean;
  onClearFilters: () => void;
}

function statusVariant(status: Project['status']): 'default' | 'success' | 'warning' | 'destructive' | 'info' | 'neutral' {
  switch (status) {
    case 'Active': return 'success';
    case 'Planning': return 'info';
    case 'On Hold': return 'warning';
    case 'Completed': return 'neutral';
    case 'Cancelled': return 'destructive';
    default: return 'default';
  }
}

function formatDate(value: string) {
  if (!value) return 'Not set';
  return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function ProjectGrid({ projects, readOnly = false, onClearFilters }: ProjectGridProps) {
  const router = useRouter();

  if (!projects.length) {
    return (
      <Card className="flex flex-col items-center justify-center px-4 py-16 text-center">
        <h3 className="mb-1 text-base font-medium text-neutral-900">No projects found</h3>
        <p className="mb-4 text-sm text-neutral-500">Try adjusting your search or filters.</p>
        <Button variant="outline" onClick={onClearFilters}>Clear filters</Button>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => {
        const image = projectImageUrl(project.imageUrl);
        return (
          <Card key={project.id} className="group overflow-hidden border-neutral-200 transition-shadow hover:shadow-md">
            <div className="relative h-44 overflow-hidden bg-neutral-100">
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={image} alt={`${project.name} project`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              ) : (
                <div className="flex h-full items-end bg-gradient-to-br from-neutral-700 via-neutral-800 to-neutral-950 p-5">
                  <span className="font-mono text-sm tracking-[0.2em] text-white/70">{project.projectCode}</span>
                </div>
              )}
              <div className="absolute left-4 top-4"><Badge variant={statusVariant(project.status)}>{project.status}</Badge></div>
            </div>
            <div className="space-y-4 p-5">
              <div className="min-w-0">
                <p className="mb-1 font-mono text-xs tracking-wide text-neutral-500">{project.projectCode}</p>
                <h2 className="truncate text-lg font-semibold text-neutral-900" title={project.name}>{project.name}</h2>
                <p className="mt-1 truncate text-sm text-neutral-500" title={project.customerName}>{project.customerName}</p>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between text-xs text-neutral-500">
                  <span>Project progress</span><span className="font-medium text-neutral-800">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="w-full" />
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-neutral-100 pt-4 text-xs">
                <div><p className="mb-1 uppercase tracking-wide text-neutral-400">Starts</p><p className="font-medium text-neutral-700">{formatDate(project.startDate)}</p></div>
                <div><p className="mb-1 uppercase tracking-wide text-neutral-400">Target finish</p><p className="font-medium text-neutral-700">{formatDate(project.plannedEndDate)}</p></div>
              </div>

              <div className="flex justify-end gap-2 border-t border-neutral-100 pt-3">
                <Button size="sm" variant="ghost" onClick={() => router.push(`/projects/${project.id}`)}>View project</Button>
                {!readOnly && <Button size="sm" variant="outline" onClick={() => router.push(`/projects/${project.id}/edit`)}>Edit</Button>}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
