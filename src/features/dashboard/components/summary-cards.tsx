import React from 'react';
import { SummaryStats } from '../types/dashboard.types';
import { Users, FolderOpen, Hammer, HardHat } from '@/src/components/ui/icons';

export function SummaryCards({ data }: { data: SummaryStats }) {
  const cards = [
    { title: 'Customers', value: data.customers, icon: Users, desc: 'Total customers' },
    { title: 'Projects', value: data.projects, icon: FolderOpen, desc: 'Total projects' },
    { title: 'Contractors', value: data.contractors, icon: Hammer, desc: 'Total contractors' },
    { title: 'Labour', value: data.labour, icon: HardHat, desc: 'Total labour' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {cards.map((c, i) => (
        <div key={i} className="bg-white p-5 rounded-lg border border-neutral-200/60 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-600">
            <c.icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500">{c.title}</p>
            <h3 className="text-2xl font-semibold text-neutral-900 tracking-tight">{c.value}</h3>
            <p className="text-xs text-neutral-400 mt-0.5">{c.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
