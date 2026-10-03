'use client';

import React, { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/src/components/ui/button';
import { PageHeader } from '@/src/components/ui/page-header';
import { ProjectForm } from '@/src/features/projects/components/project-form';
import { ProjectImageManager } from '@/src/features/projects/components/project-image-manager';
import { mockProjects } from '@/src/features/projects/data/projects.mock';
import { ProjectImage } from '@/src/features/projects/types/project.types';
import { EmptyState } from '@/src/components/ui/empty-state';
import Link from 'next/link';

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
      <div className="w-full mx-auto pb-12 min-w-0 max-w-5xl">
        <EmptyState 
          title="Projects Not Found"
          description="The projects you are looking for does not exist or has been removed."
          action={
            <Link href="/projects">
              <Button variant="outline">
                Back to Projects
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  // To simulate updating images together with the form we just pass it as context 
  // or just manage them entirely locally here. 
  // For UI only, we just keep the image state here.
  
  return (
    <div className="w-full mx-auto pb-12 min-w-0 max-w-4xl">
      <PageHeader 
        title="Edit Project" 
        description={initialProject.projectCode}
        backLink={{ href: `/projects/${initialProject.id}`, label: 'Back to Project' }}
      />
      
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
