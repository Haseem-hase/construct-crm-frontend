import React from 'react';
import { Button } from '@/src/components/ui/button';

export function ProjectPageHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">Projects</h1>
        <p className="text-[15px] text-neutral-500 mt-1">Manage your organization&apos;s construction projects.</p>
      </div>
      <div className="shrink-0">
        <Button onClick={() => {}}>
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Project
        </Button>
      </div>
    </div>
  );
}
