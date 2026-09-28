'use client';

import React, { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockProjects } from '@/src/features/projects/data/projects.mock';
import { Project } from '@/src/features/projects/types/project.types';
import { ProjectDetailsHeader } from '@/src/features/projects/components/project-details-header';
import { ProjectOverview } from '@/src/features/projects/components/project-overview';
import { ProjectCustomer } from '@/src/features/projects/components/project-customer';
import { ProjectPlanning } from '@/src/features/projects/components/project-planning';
import { ProjectFinancials } from '@/src/features/projects/components/project-financials';
import { ProjectContractorOverview } from '@/src/features/projects/components/project-contractor-overview';
import { ProjectLabourOverview } from '@/src/features/projects/components/project-labour-overview';
import { ProjectImageGallery } from '@/src/features/projects/components/project-image-gallery';
import { Button } from '@/src/components/ui/button';

interface ProjectDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectDetailsPage({ params }: ProjectDetailsPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const initialProject = mockProjects.find(
    p => p.id === id || p.projectCode === id
  );

  const [project, setProject] = useState<Project | undefined>(initialProject);

  if (!project) {
    return (
      <div className="w-full mx-auto max-w-5xl py-16 flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-semibold text-neutral-900 mb-2">Project Not Found</h2>
        <p className="text-neutral-500 mb-6">The project you are looking for does not exist or has been removed.</p>
        <Button onClick={() => router.push('/projects')}>
          Back to Projects
        </Button>
      </div>
    );
  }

  const coverImage = project.images?.find(img => img.isCover);

  return (
    <div className="w-full mx-auto pb-12 min-w-0 max-w-6xl">
      <ProjectDetailsHeader 
        project={project} 
        onStatusChange={(newStatus) => setProject(p => p ? { ...p, status: newStatus } : p)}
      />

      <div className="flex flex-col gap-8">
        
        {/* Project Cover Image */}
        {coverImage && (
          <div className="w-full aspect-[21/9] sm:aspect-[3/1] rounded-2xl overflow-hidden ring-1 ring-neutral-200/60 shadow-sm relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={coverImage.url} 
              alt={coverImage.alt || `${project.name} cover`} 
              className="w-full h-full object-cover"
            />
            {/* Subtle gradient overlay at bottom to anchor the image if desired, left empty for crispness */}
          </div>
        )}

        {/* Project Gallery */}
        <ProjectImageGallery images={project.images} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <ProjectOverview project={project} onUpdate={(updates) => setProject(p => p ? { ...p, ...updates } : p)} />
            <ProjectPlanning project={project} onUpdate={(updates) => setProject(p => p ? { ...p, ...updates } : p)} />
          </div>
          
          <div className="flex flex-col gap-6">
            <ProjectCustomer project={project} onUpdate={(updates) => setProject(p => p ? { ...p, ...updates } : p)} />
            <ProjectFinancials project={project} onUpdate={(updates) => setProject(p => p ? { ...p, ...updates } : p)} />
          </div>
        </div>

        {/* Relationships */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProjectContractorOverview />
          <ProjectLabourOverview />
        </div>

      </div>
    </div>
  );
}
