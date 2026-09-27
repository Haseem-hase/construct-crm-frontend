import React from 'react';
import { ActivityItem } from '../types/dashboard.types';

export function RecentActivity({ data }: { data: ActivityItem[] }) {
  return (
    <div className="bg-white p-6 rounded-lg border border-neutral-200/60 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] h-full">
      <h3 className="text-base font-semibold text-neutral-900 mb-6 tracking-tight">Recent Activity</h3>
      <div className="space-y-6">
        {data.map((item, i) => (
          <div key={item.id} className="relative pl-6">
            {/* Timeline line */}
            {i !== data.length - 1 && (
              <div className="absolute top-6 bottom-[-24px] left-[7px] w-px bg-neutral-100" />
            )}
            
            {/* Dot */}
            <div className="absolute top-1.5 left-0 w-4 h-4 rounded-full bg-neutral-50 border-2 border-neutral-200/80" />
            
            <div>
              <p className="text-[14px] text-neutral-700 leading-snug">{item.description}</p>
              <p className="text-xs text-neutral-400 mt-1">{item.timeAgo}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
