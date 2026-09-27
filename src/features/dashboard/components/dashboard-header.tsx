import React from 'react';

export function DashboardHeader() {
  const today = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date());

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">Dashboard</h1>
      <div className="flex items-center space-x-2 mt-1">
        <p className="text-[15px] text-neutral-500">Overview of your organization</p>
        <span className="text-neutral-300">&bull;</span>
        <p className="text-[14px] text-neutral-400 font-medium">{today}</p>
      </div>
    </div>
  );
}
