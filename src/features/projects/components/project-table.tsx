import React from 'react';
import { useRouter } from 'next/navigation';
import { Project } from '../types/project.types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Card } from '@/src/components/ui/card';
import { Progress } from '@/src/components/ui/progress';

interface ProjectTableProps {
  projects: Project[];
  onClearFilters: () => void;
  currentPage?: number;
  itemsPerPage?: number;
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

export function ProjectTable({ projects, onClearFilters, currentPage = 1, itemsPerPage = 10 }: ProjectTableProps) {
  const router = useRouter();

  if (projects.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <h3 className="text-base font-medium text-neutral-900 mb-1">No projects found</h3>
        <p className="text-sm text-neutral-500 mb-4">Try adjusting your search or filters.</p>
        <Button variant="outline" onClick={onClearFilters}>
          Clear filters
        </Button>
      </Card>
    );
  }

  return (
    <Card className="w-full min-w-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px] text-center">S.No</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[120px]">Progress</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project, index) => {
            const serialNumber = (currentPage - 1) * itemsPerPage + index + 1;

            return (
              <TableRow key={project.id}>
                <TableCell className="text-center text-neutral-500 text-[13px] font-medium">
                  {serialNumber}
                </TableCell>
                <TableCell>
                  <span className="text-neutral-600 font-mono text-[13px]">{project.projectCode}</span>
                </TableCell>
                <TableCell className="max-w-[200px] truncate" title={project.name}>
                  <span className="font-medium text-neutral-900">{project.name}</span>
                </TableCell>
                <TableCell>
                  <span className="text-neutral-600">{project.customerName}</span>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(project.status)}>
                    {project.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Progress 
                    value={project.progress} 
                    showValue 
                    className="w-24" 
                  />
                </TableCell>
                <TableCell>
                  <span className="text-neutral-600 text-[13px]">{formatDate(project.startDate)}</span>
                </TableCell>
                <TableCell>
                  <span className="text-neutral-600 text-[13px]">{formatDate(project.plannedEndDate)}</span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-16"
                      onClick={() => router.push(`/projects/${project.id}`)}
                    >
                      View
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-16"
                      onClick={() => router.push(`/projects/${project.id}/edit`)}
                    >
                      Edit
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
