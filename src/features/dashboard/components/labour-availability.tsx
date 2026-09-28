import React from 'react';
import { LabourAvailability } from '../types/dashboard.types';

export function LabourAvailabilitySection({ data }: { data: LabourAvailability }) {
  const percentAssigned = data.total > 0 ? (data.assigned / data.total) * 100 : 0;
  
  return (
    <div className="bg-white p-6 rounded-lg border border-neutral-200/60 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] h-full flex flex-col">
      <h3 className="text-base font-semibold text-neutral-900 mb-6 tracking-tight">Labour Availability</h3>
      
      <div className="flex flex-col flex-1 justify-between">
        <div className="mb-6">
          <div className="flex justify-between items-end mb-3">
            <div>
              <span className="text-3xl font-semibold text-neutral-900 tracking-tight">{data.available}</span>
              <span className="text-sm text-neutral-500 ml-2 font-medium">Available</span>
            </div>
            <div className="text-right pb-1">
              <span className="text-lg font-medium text-neutral-700">{data.assigned}</span>
              <span className="text-xs text-neutral-500 ml-1">Assigned</span>
            </div>
          </div>
          
          <div className="w-full bg-neutral-100 rounded-full h-2.5 overflow-hidden flex">
            <div className="bg-green-500 h-full" style={{ width: `${100 - percentAssigned}%` }} />
            <div className="bg-neutral-800 h-full" style={{ width: `${percentAssigned}%` }} />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-100 mt-auto">
          <div>
            <p className="text-xs text-neutral-500 mb-1 uppercase tracking-wider font-semibold">Total</p>
            <p className="text-sm font-semibold text-neutral-900">{data.total}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500 mb-1 uppercase tracking-wider font-semibold">Inactive</p>
            <p className="text-sm font-semibold text-neutral-900">{data.inactive}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
