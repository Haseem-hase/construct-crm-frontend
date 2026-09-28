'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/src/components/ui/button';
import { ProjectForm } from '@/src/features/projects/components/project-form';

export default function CreateProjectPage() {
  const router = useRouter();

  return (
    <div className="w-full mx-auto pb-8 min-w-0 max-w-5xl">
      <div className="mb-8 flex flex-col gap-4">
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
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">Create Project</h1>
          <p className="text-[15px] text-neutral-500 mt-1">Add a new construction project to your organization.</p>
        </div>
      </div>
      
      <ProjectForm mode="create" />
    </div>
  );
}
