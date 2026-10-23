'use client';

import React, { use, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/src/components/ui/button';
import { PageHeader } from '@/src/components/ui/page-header';
import { ProjectForm } from '@/src/features/projects/components/project-form';
import { EmptyState } from '@/src/components/ui/empty-state';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { fetchProjectById, selectProjectDetailError, selectProjectDetailStatus, selectSelectedProject } from '@/src/features/projects/store/projectsSlice';
import { ApiProjectStatus } from '@/src/features/projects/api/projects.api';
import { Project, ProjectStatus } from '@/src/features/projects/types/project.types';

interface EditProjectPageProps { params: Promise<{ id: string }> }
const statusLabels: Record<ApiProjectStatus, ProjectStatus> = { PLANNING: 'Planning', ACTIVE: 'Active', ON_HOLD: 'On Hold', COMPLETED: 'Completed', CANCELLED: 'Cancelled' };

export default function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = use(params);
  const dispatch = useAppDispatch();
  const apiProject = useAppSelector(selectSelectedProject);
  const status = useAppSelector(selectProjectDetailStatus);
  const error = useAppSelector(selectProjectDetailError);
  const load = () => { void dispatch(fetchProjectById(id)); };
  useEffect(() => { load(); }, [id]);
  const project: Project | undefined = useMemo(() => {
    if (!apiProject || apiProject.id !== id) return undefined;
    const relation = apiProject.projectCustomers?.find((c) => c.isPrimary) || apiProject.projectCustomers?.[0];
    return { id: apiProject.id, projectCode: apiProject.projectCode, name: apiProject.name, customerId: relation?.customerId || '', customerName: relation?.customer?.name || '', customerCode: relation?.customer?.customerCode, customerType: relation?.customer?.type, projectCustomerRelationId: relation?.id, projectCustomerRelations: apiProject.projectCustomers?.map(({ id, customerId }) => ({ id, customerId })) || [], status: statusLabels[apiProject.status], progress: apiProject.progress, startDate: apiProject.plannedStartDate || '', plannedEndDate: apiProject.plannedEndDate || '', description: apiProject.description || undefined, budget: apiProject.budget ?? undefined, imageUrl: apiProject.imageUrl || undefined, createdAt: apiProject.createdAt };
  }, [apiProject, id]);

  if (status === 'loading' || status === 'idle') return <p className="py-12 text-center text-sm text-neutral-500">Loading project…</p>;
  if (status === 'failed') {
    if (error?.toLowerCase().includes('not found')) return <div className="w-full mx-auto pb-12 min-w-0 max-w-5xl"><EmptyState title="Project not found" description="This project does not exist or is not available to your organization." action={<Link href="/projects"><Button variant="outline">Back to Projects</Button></Link>} /></div>;
    return <div className="mx-auto max-w-3xl py-12 text-center"><p role="alert" className="mb-4 text-sm text-red-600">{error || 'Unable to load project.'}</p><Button variant="outline" onClick={load}>Retry</Button></div>;
  }
  if (!project) return null;

  return <div className="w-full mx-auto pb-12 min-w-0 max-w-4xl"><PageHeader title="Edit Project" description={project.projectCode} backLink={{ href: `/projects/${project.id}`, label: 'Back to Project' }} /><ProjectForm mode="edit" initialData={project} /></div>;
}
