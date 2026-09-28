import React from 'react';
import { AssignmentStatusData } from '../types/dashboard.types';

export function ContractorAssignmentOverview({ data }: { data: AssignmentStatusData }) {
  return (
    <div className="bg-white p-6 rounded-lg border border-neutral-200/60 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] h-full">
      <h3 className="text-base font-semibold text-neutral-900 mb-6 tracking-tight">Contractor Project Assignments</h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center py-2 border-b border-neutral-100">
          <span className="text-sm font-medium text-neutral-700">Active</span>
          <span className="text-sm font-semibold text-neutral-900">{data.active}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-neutral-100">
          <span className="text-sm font-medium text-neutral-700">Pending</span>
          <span className="text-sm font-semibold text-neutral-900">{data.pending}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-neutral-100">
          <span className="text-sm font-medium text-neutral-700">On Hold</span>
          <span className="text-sm font-semibold text-amber-600">{data.onHold}</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-sm font-medium text-neutral-700">Completed</span>
          <span className="text-sm font-semibold text-neutral-900">{data.completed}</span>
        </div>
      </div>
    </div>
  );
}
