import React from 'react';
import { ProjectProgressItem } from '../types/dashboard.types';

export function ProjectProgressSection({ data }: { data: ProjectProgressItem[] }) {
  return (
    <div className="bg-white p-6 rounded-sm border border-neutral-200/60 h-full">
      <h3 className="text-base font-semibold text-neutral-900 mb-6 tracking-tight">Project Progress</h3>
      
      <div className="space-y-6">
        {data.map((project) => (
          <div key={project.id}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-neutral-800">{project.name}</span>
              <span className="text-xs font-semibold text-neutral-500">{project.progress}%</span>
            </div>
            <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-neutral-800 h-full rounded-full transition-all duration-500 ease-in-out" 
                style={{ width: `${project.progress}%` }} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
