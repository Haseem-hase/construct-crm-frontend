import React from 'react';
import { ContractorOverviewData } from '../types/dashboard.types';
import { Hammer } from '@/src/components/ui/icons';

export function ContractorOverviewSection({ data }: { data: ContractorOverviewData }) {
  return (
    <div className="bg-white p-6 rounded-lg border border-neutral-200/60 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-base font-semibold text-neutral-900 tracking-tight">Contractor Overview</h3>
        <Hammer className="w-4 h-4 text-neutral-400" />
      </div>
      
      <div className="flex-1 grid grid-cols-2 gap-4">
        <div className="p-4 bg-neutral-50/50 rounded-md border border-neutral-100">
          <p className="text-xs font-medium text-neutral-500 mb-1 uppercase tracking-wider">Total</p>
          <p className="text-2xl font-semibold text-neutral-900 tracking-tight">{data.total}</p>
        </div>
        
        <div className="p-4 bg-neutral-50/50 rounded-md border border-neutral-100">
          <p className="text-xs font-medium text-neutral-500 mb-1 uppercase tracking-wider">Active</p>
          <p className="text-2xl font-semibold text-neutral-900 tracking-tight">{data.active}</p>
        </div>
        
        <div className="p-4 bg-neutral-50/50 rounded-md border border-neutral-100">
          <p className="text-xs font-medium text-neutral-500 mb-1 uppercase tracking-wider">Inactive</p>
          <p className="text-2xl font-semibold text-neutral-900 tracking-tight">{data.inactive}</p>
        </div>
        
        <div className="p-4 bg-neutral-50/50 rounded-md border border-neutral-100">
          <p className="text-xs font-medium text-neutral-500 mb-1 uppercase tracking-wider">Assignments</p>
          <p className="text-2xl font-semibold text-neutral-900 tracking-tight">{data.activeAssignments}</p>
        </div>
      </div>
    </div>
  );
}
