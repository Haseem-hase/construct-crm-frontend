import React from 'react';
import { ProjectStatusData } from '../types/dashboard.types';

export function ProjectStatusSection({ data }: { data: ProjectStatusData }) {
  return (
    <div className="bg-white p-6 rounded-lg border border-neutral-200/60 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] h-full flex flex-col">
      <h3 className="text-base font-semibold text-neutral-900 mb-6 tracking-tight">Project Status</h3>
      
      <div className="space-y-4 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-900" />
            <span className="text-sm text-neutral-700 font-medium">Active</span>
          </div>
          <span className="text-sm font-semibold text-neutral-900">{data.active}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-sm text-neutral-700 font-medium">Planning</span>
          </div>
          <span className="text-sm font-semibold text-neutral-900">{data.planning}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <span className="text-sm text-neutral-700 font-medium">Completed</span>
          </div>
          <span className="text-sm font-semibold text-neutral-900">{data.completed}</span>
        </div>
      </div>
      
      <div className="pt-4 border-t border-neutral-100 mt-auto">
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Total Projects</span>
          <span className="text-lg font-semibold text-neutral-900 tracking-tight">{data.total}</span>
        </div>
      </div>
    </div>
  );
}
