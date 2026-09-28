import React from 'react';
import { GrowthDataPoint } from '../types/super-admin.types';

export function OrganizationGrowth({ data }: { data: GrowthDataPoint[] }) {
  // Find max value to scale the bars correctly
  const maxVal = Math.max(...data.map(d => d.value));

  return (
    <div className="bg-white p-6 rounded-lg border border-neutral-200/60 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] h-full flex flex-col">
      <h3 className="text-base font-semibold text-neutral-900 tracking-tight">Organization Growth</h3>
      <p className="text-[13px] text-neutral-500 mt-1 mb-8">New organizations registered over time.</p>
      
      <div className="flex-1 flex items-end justify-between space-x-2 pt-4">
        {data.map((point) => {
          const heightPercent = (point.value / maxVal) * 100;
          return (
            <div key={point.month} className="flex flex-col items-center flex-1 group">
              <div className="w-full relative flex justify-center h-32 items-end">
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-neutral-900 text-white text-xs py-1 px-2 rounded transition-opacity whitespace-nowrap z-10 pointer-events-none">
                  {point.value} Orgs
                </div>
                <div 
                  className="w-full max-w-[24px] bg-neutral-800 rounded-t-sm transition-all duration-500 group-hover:bg-neutral-600"
                  style={{ height: `${heightPercent}%` }}
                />
              </div>
              <span className="text-[11px] font-medium text-neutral-400 mt-3">{point.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
