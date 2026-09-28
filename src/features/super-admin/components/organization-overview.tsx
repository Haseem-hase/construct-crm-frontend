import React from 'react';
import { OrganizationOverviewItem } from '../types/super-admin.types';

export function OrganizationOverview({ data }: { data: OrganizationOverviewItem[] }) {
  return (
    <div className="bg-white rounded-lg border border-neutral-200/60 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] overflow-hidden">
      <div className="px-6 py-5 border-b border-neutral-200/60">
        <h3 className="text-base font-semibold text-neutral-900 tracking-tight">Organization Overview</h3>
        <p className="text-[13px] text-neutral-500 mt-1">Overview of organizations using ConstructCRM.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-neutral-50/50 text-neutral-500 font-medium border-b border-neutral-200/60">
            <tr>
              <th className="px-6 py-3 font-medium">Organization</th>
              <th className="px-6 py-3 font-medium">Users</th>
              <th className="px-6 py-3 font-medium">Projects</th>
              <th className="px-6 py-3 font-medium">Labour</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Created</th>
              <th className="px-6 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {data.map((org) => (
              <tr key={org.id} className="hover:bg-neutral-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-neutral-900 whitespace-nowrap">{org.name}</td>
                <td className="px-6 py-4 text-neutral-600 whitespace-nowrap">{org.users}</td>
                <td className="px-6 py-4 text-neutral-600 whitespace-nowrap">{org.projects}</td>
                <td className="px-6 py-4 text-neutral-600 whitespace-nowrap">{org.labour}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    org.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200/60' : 'bg-neutral-100 text-neutral-600 border-neutral-200/80'
                  }`}>
                    {org.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-neutral-600 whitespace-nowrap">{org.created}</td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <button className="text-neutral-500 hover:text-neutral-900 font-medium text-[13px] transition-colors focus:outline-none">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
