import React from 'react';
import { UserOverviewStats, UserOverviewItem } from '../types/super-admin.types';

export function UserOverview({ stats, recentUsers }: { stats: UserOverviewStats, recentUsers: UserOverviewItem[] }) {
  return (
    <div className="bg-white rounded-lg border border-neutral-200/60 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] h-full flex flex-col overflow-hidden">
      <div className="px-6 py-5 border-b border-neutral-200/60">
        <h3 className="text-base font-semibold text-neutral-900 tracking-tight">User Overview</h3>
        <p className="text-[13px] text-neutral-500 mt-1">Summary and recently registered platform users.</p>
      </div>
      
      {/* Summary grid */}
      <div className="grid grid-cols-4 border-b border-neutral-200/60 divide-x divide-neutral-100 bg-neutral-50/30">
        <div className="p-4 text-center">
          <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">Total</p>
          <p className="text-xl font-semibold text-neutral-900">{stats.total.toLocaleString()}</p>
        </div>
        <div className="p-4 text-center">
          <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">Active</p>
          <p className="text-xl font-semibold text-neutral-900">{stats.active.toLocaleString()}</p>
        </div>
        <div className="p-4 text-center">
          <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">Inactive</p>
          <p className="text-xl font-semibold text-neutral-900">{stats.inactive.toLocaleString()}</p>
        </div>
        <div className="p-4 text-center">
          <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">New</p>
          <p className="text-xl font-semibold text-neutral-900">{stats.recentlyRegistered}</p>
        </div>
      </div>
      
      {/* Table */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-neutral-500 font-medium border-b border-neutral-100">
            <tr>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Organization</th>
              <th className="px-6 py-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {recentUsers.map((user) => (
              <tr key={user.id} className="hover:bg-neutral-50/50 transition-colors">
                <td className="px-6 py-3 whitespace-nowrap">
                  <p className="font-medium text-neutral-900">{user.name}</p>
                  <p className="text-[12px] text-neutral-500">{user.email}</p>
                </td>
                <td className="px-6 py-3 whitespace-nowrap">
                  <p className="text-neutral-700">{user.organization}</p>
                  <p className="text-[12px] text-neutral-500">{user.role}</p>
                </td>
                <td className="px-6 py-3 text-neutral-600 whitespace-nowrap">{user.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
