'use client';

import React, { use, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/src/components/ui/button';
import { EmptyState } from '@/src/components/ui/empty-state';
import { SuccessAlert } from '@/src/components/ui/success-alert';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { fetchProjectById, selectProjectDetailError, selectProjectDetailStatus, selectSelectedProject, updateProject } from '@/src/features/projects/store/projectsSlice';
import { projectsApi, ApiProjectStatus, ProjectPayload } from '@/src/features/projects/api/projects.api';
import { Project, ProjectStatus } from '@/src/features/projects/types/project.types';
import { ProjectDetailsHeader } from '@/src/features/projects/components/project-details-header';
import { ProjectOverview } from '@/src/features/projects/components/project-overview';
import { ProjectCustomer } from '@/src/features/projects/components/project-customer';
import { ProjectPlanning } from '@/src/features/projects/components/project-planning';
import { ProjectFinancials } from '@/src/features/projects/components/project-financials';
import { ProjectContractorOverview } from '@/src/features/projects/components/project-contractor-overview';
import { ProjectLabourOverview } from '@/src/features/projects/components/project-labour-overview';
import { assignmentsApi, ApiContractorAssignment } from '@/src/features/assignments/api/assignments.api';
import { labourAssignmentsApi, ApiLabourAssignment } from '@/src/features/labour-assignments/api/labour-assignments.api';

interface ProjectDetailsPageProps { params: Promise<{ id: string }> }
const fromApiStatus: Record<ApiProjectStatus, ProjectStatus> = { PLANNING: 'Planning', ACTIVE: 'Active', ON_HOLD: 'On Hold', COMPLETED: 'Completed', CANCELLED: 'Cancelled' };
const toApiStatus: Record<ProjectStatus, ApiProjectStatus> = { Planning: 'PLANNING', Active: 'ACTIVE', 'On Hold': 'ON_HOLD', Completed: 'COMPLETED', Cancelled: 'CANCELLED' };

export default function ProjectDetailsPage({ params }: ProjectDetailsPageProps) {
  const { id } = use(params);
  const dispatch = useAppDispatch();
  const apiProject = useAppSelector(selectSelectedProject);
  const detailStatus = useAppSelector(selectProjectDetailStatus);
  const detailError = useAppSelector(selectProjectDetailError);
  const [contractorAssignments, setContractorAssignments] = useState<ApiContractorAssignment[]>([]);
  const [labourAssignments, setLabourAssignments] = useState<ApiLabourAssignment[]>([]);
  const [relationshipsLoading, setRelationshipsLoading] = useState(false);
  const [relationshipsError, setRelationshipsError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const loadProject = () => { void dispatch(fetchProjectById(id)); };
  const loadRelationships = async (projectId: string) => {
    setRelationshipsLoading(true); setRelationshipsError('');
    try {
      const [contractors, labour] = await Promise.all([assignmentsApi.list({ projectId }), labourAssignmentsApi.list()]);
      const projectContractors = contractors.filter((a) => a.projectId === projectId);
      const parentIds = new Set(projectContractors.map((a) => a.id));
      setContractorAssignments(projectContractors);
      setLabourAssignments(labour.filter((a) => parentIds.has(a.contractorProjectAssignmentId)));
    } catch (error: any) { setRelationshipsError(error?.response?.data?.message || 'Unable to load project assignments.'); }
    finally { setRelationshipsLoading(false); }
  };

  useEffect(() => { loadProject(); }, [id]);
  useEffect(() => { if (apiProject?.id === id) void loadRelationships(id); }, [apiProject?.id, id]);

  const project: Project | null = useMemo(() => {
    if (!apiProject) return null;
    const primary = apiProject.projectCustomers?.find((relation) => relation.isPrimary) || apiProject.projectCustomers?.[0];
    const image = apiProject.imageUrl ? [{ id: apiProject.id, url: apiProject.imageUrl, alt: apiProject.name, isCover: true }] : [];
    return { id: apiProject.id, projectCode: apiProject.projectCode, name: apiProject.name, customerId: primary?.customerId || '', customerName: primary?.customer?.name || 'No customer', customerCode: primary?.customer?.customerCode, customerType: primary?.customer?.type, projectCustomerRelationId: primary?.id, projectCustomerRelations: apiProject.projectCustomers?.map(({ id, customerId }) => ({ id, customerId })) || [], status: fromApiStatus[apiProject.status], progress: apiProject.progress, startDate: apiProject.plannedStartDate || '', plannedEndDate: apiProject.plannedEndDate || '', description: apiProject.description || undefined, budget: apiProject.budget ?? undefined, imageUrl: apiProject.imageUrl || undefined, images: image, createdAt: apiProject.createdAt };
  }, [apiProject]);

  const saveInline = async (updates: Partial<Project>) => {
    if (!apiProject || apiProject.id !== id) return false;
    try {
      if (updates.customerId && updates.customerId !== project?.customerId) {
        const existing = apiProject.projectCustomers?.find((relation) => relation.customerId === updates.customerId);
        if (existing) await projectsApi.updateCustomerRelationship(id, existing.id, { isPrimary: true });
        else await projectsApi.addCustomer(id, updates.customerId);
        void dispatch(fetchProjectById(id));
      }
      const payload: Partial<ProjectPayload> = {};
      if (updates.name !== undefined) payload.name = updates.name;
      if (updates.description !== undefined) payload.description = updates.description || null;
      if (updates.status !== undefined) payload.status = toApiStatus[updates.status];
      if (updates.progress !== undefined) payload.progress = updates.progress;
      if (updates.startDate !== undefined) payload.plannedStartDate = updates.startDate || null;
      if (updates.plannedEndDate !== undefined) payload.plannedEndDate = updates.plannedEndDate || null;
      if (updates.budget !== undefined) payload.budget = updates.budget;
      if (Object.keys(payload).length) await dispatch(updateProject({ id, payload })).unwrap();
      setShowSuccess(true); setTimeout(() => setShowSuccess(false), 2800);
      return true;
    } catch (error: any) { throw new Error(typeof error === 'string' ? error : error?.response?.data?.message || error?.message || 'Unable to save project changes.'); }
  };

  if (detailStatus === 'loading' || (detailStatus === 'idle' && !apiProject)) return <p className="py-12 text-center text-sm text-neutral-500">Loading project…</p>;
  if (detailStatus === 'failed') {
    const notFound = detailError?.toLowerCase().includes('not found');
    if (notFound) return <div className="w-full mx-auto pb-12 min-w-0 max-w-5xl"><EmptyState title="Project not found" description="This project does not exist or is not available to your organization." action={<Link href="/projects"><Button variant="outline">Back to Projects</Button></Link>} /></div>;
    return <div className="mx-auto max-w-3xl py-12 text-center"><p role="alert" className="mb-4 text-sm text-red-600">{detailError || 'Unable to load project.'}</p><Button variant="outline" onClick={loadProject}>Retry</Button></div>;
  }
  if (!project) return null;

  return (
    <div className="w-full mx-auto pb-12 min-w-0 max-w-6xl">
      <SuccessAlert title="Project updated" description="Your changes were saved." show={showSuccess} />
      <ProjectDetailsHeader project={project} onStatusChange={async (status) => { const saved = await saveInline({ status }); if (!saved) throw new Error('Unable to update project status.'); }} />
      <div className="flex flex-col gap-8">
        {project.imageUrl && <div className="w-full aspect-[21/9] sm:aspect-[3/1] rounded-2xl overflow-hidden ring-1 ring-neutral-200/60 shadow-sm relative">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={project.imageUrl} alt={`${project.name} project`} className="w-full h-full object-cover" /></div>}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6"><ProjectOverview project={project} onUpdate={saveInline} /><ProjectPlanning project={project} onUpdate={saveInline} /></div>
          <div className="flex flex-col gap-6"><ProjectCustomer project={project} onUpdate={saveInline} /><ProjectFinancials project={project} onUpdate={saveInline} /></div>
        </div>
        {relationshipsError && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{relationshipsError} <button className="ml-2 underline" onClick={() => apiProject && void loadRelationships(apiProject.id)}>Retry</button></div>}
        {relationshipsLoading && <p className="text-center text-sm text-neutral-500">Loading project assignments…</p>}
        {!relationshipsLoading && !relationshipsError && <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><ProjectContractorOverview assignments={contractorAssignments} /><ProjectLabourOverview assignments={labourAssignments} /></div>}
      </div>
    </div>
  );
}
