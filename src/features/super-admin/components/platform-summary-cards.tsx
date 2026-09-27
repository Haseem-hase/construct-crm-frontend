import React from 'react';
import { PlatformSummaryStats } from '../types/super-admin.types';
import { FolderOpen, Users, Activity, BarChart } from '@/src/components/ui/icons';

export function PlatformSummaryCards({ data }: { data: PlatformSummaryStats }) {
  const cards = [
    { title: 'Total Organizations', value: data.totalOrganizations, sub: data.orgsGrowth, icon: FolderOpen },
    { title: 'Active Organizations', value: data.activeOrganizations, sub: data.activeOrgsPercent, icon: BarChart },
    { title: 'Total Users', value: data.totalUsers, sub: data.usersGrowth, icon: Users },
    { title: 'Active Users', value: data.activeUsers, sub: data.activeUsersPercent, icon: Activity },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {cards.map((c, i) => (
        <div key={i} className="bg-white p-5 rounded-lg border border-neutral-200/60 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-neutral-500">{c.title}</p>
            <c.icon className="w-5 h-5 text-neutral-400" />
          </div>
          <h3 className="text-2xl font-semibold text-neutral-900 tracking-tight">{c.value.toLocaleString()}</h3>
          <p className="text-[13px] font-medium text-neutral-500 mt-1.5">{c.sub}</p>
        </div>
      ))}
    </div>
  );
}
