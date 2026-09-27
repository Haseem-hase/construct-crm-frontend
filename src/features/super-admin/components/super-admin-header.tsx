import React from 'react';
import { RefreshCw, Calendar } from '@/src/components/ui/icons';

export function SuperAdminHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">Platform Overview</h1>
        <p className="text-[15px] text-neutral-500 mt-1">Monitor and manage the ConstructCRM platform.</p>
      </div>
      <div className="flex items-center space-x-3">
        <button className="flex items-center space-x-2 px-3 py-1.5 bg-white border border-neutral-200/60 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors shadow-sm focus:outline-none">
          <Calendar className="w-4 h-4 text-neutral-400" />
          <span>Last 30 Days</span>
        </button>
        <button className="p-1.5 bg-white border border-neutral-200/60 rounded-md text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 transition-colors shadow-sm focus:outline-none" aria-label="Refresh dashboard">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
