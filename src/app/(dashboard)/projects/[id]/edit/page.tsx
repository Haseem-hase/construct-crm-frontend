'use client';

import React, { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/src/components/ui/button';
import { ProjectForm } from '@/src/features/projects/components/project-form';
import { ProjectImageManager } from '@/src/features/projects/components/project-image-manager';
import { mockProjects } from '@/src/features/projects/data/projects.mock';
import { ProjectImage } from '@/src/features/projects/types/project.types';

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const initialProject = mockProjects.find(
    p => p.id === id || p.projectCode === id
  );

  const [images, setImages] = useState<ProjectImage[]>(initialProject?.images || []);

  if (!initialProject) {
    return (
      <div className="w-full mx-auto max-w-5xl py-16 flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-semibold text-neutral-900 mb-2">Project Not Found</h2>
        <p className="text-neutral-500 mb-6">The project you are trying to edit does not exist.</p>
        <Button onClick={() => router.push('/projects')}>
          Back to Projects
        </Button>
      </div>
    );
  }

  // To simulate updating images together with the form we just pass it as context 
  // or just manage them entirely locally here. 
  // For UI only, we just keep the image state here.
  
  return (
    <div className="w-full mx-auto pb-12 min-w-0 max-w-5xl">
      <div className="mb-8 flex flex-col gap-4">
        <div>
          <Button 
            variant="ghost" 
            onClick={() => router.push(`/projects/${initialProject.id}`)} 
            className="-ml-4 text-neutral-500"
          >
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Project
          </Button>
        </div>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 mb-1">Edit Project</h1>
          <p className="text-[15px] font-mono text-neutral-500">{initialProject.projectCode}</p>
        </div>
      </div>
      
      <div className="flex flex-col gap-8">
        <ProjectForm mode="edit" initialData={initialProject} />
        
        <ProjectImageManager 
          images={images} 
          onChange={setImages} 
        />
      </div>
    </div>
  );
}
