import React from 'react';
import { GlobalRoleItem, GlobalRolesStats } from '../types/super-admin.types';

export function GlobalRolesOverview({ roles, stats }: { roles: GlobalRoleItem[], stats: GlobalRolesStats }) {
  return (
    <div className="bg-white rounded-lg border border-neutral-200/60 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] overflow-hidden h-full flex flex-col">
      <div className="px-6 py-5 border-b border-neutral-200/60 flex justify-between items-center">
        <div>
          <h3 className="text-base font-semibold text-neutral-900 tracking-tight">Global Roles</h3>
          <p className="text-[13px] text-neutral-500 mt-1">Overview of roles available across the platform.</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Permissions</p>
          <p className="text-lg font-semibold text-neutral-900 leading-tight">{stats.totalPermissions}</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-neutral-50/50 text-neutral-500 font-medium border-b border-neutral-200/60">
            <tr>
              <th className="px-6 py-3 font-medium">Role Name</th>
              <th className="px-6 py-3 font-medium text-right">Organizations Using</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {roles.map((role) => (
              <tr key={role.id} className="hover:bg-neutral-50/50 transition-colors">
                <td className="px-6 py-3 font-medium text-neutral-900 whitespace-nowrap">{role.name}</td>
                <td className="px-6 py-3 text-neutral-600 text-right whitespace-nowrap">{role.organizationsUsing}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
