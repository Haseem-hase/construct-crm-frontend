import React from 'react';
import { Card } from '@/src/components/ui/card';
import { Role } from '../types/roles.types';

interface RoleDetailsOverviewProps {
  role: Role;
}

export function RoleDetailsOverview({ role }: RoleDetailsOverviewProps) {
  return (
    <Card className="p-6">
      <h3 className="text-sm font-medium text-neutral-500 mb-4 uppercase tracking-wider">Role Summary</h3>
      <div className="flex flex-col md:flex-row md:items-start gap-8">
        <div className="flex-1">
          <h4 className="text-sm font-medium text-neutral-500 mb-1">Description</h4>
          <p className="text-base text-neutral-900 leading-relaxed">
            {role.description || 'No description provided.'}
          </p>
          
          {role.type === 'GLOBAL' && (
            <div className="mt-4 p-3 bg-neutral-50 border border-neutral-200 rounded-md">
              <p className="text-sm text-neutral-600">
                <span className="font-medium text-neutral-900">Note:</span> This is a global system role. You can configure the permissions for your organization, but the role name and description cannot be changed.
              </p>
            </div>
          )}
        </div>
        
        <div className="shrink-0 flex flex-col gap-1 min-w-[120px] md:border-l md:border-neutral-100 md:pl-8">
          <span className="text-sm text-neutral-500">Users Assigned</span>
          <span className="text-2xl font-semibold text-neutral-900">{role.usersAssigned ?? 0}</span>
        </div>
      </div>
    </Card>
  );
}
