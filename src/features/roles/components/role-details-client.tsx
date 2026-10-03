'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Role } from '../types/roles.types';
import { PageHeader } from '@/src/components/ui/page-header';
import { Button } from '@/src/components/ui/button';
import { Card } from '@/src/components/ui/card';
import { RoleTypeBadge } from './role-type-badge';

interface RoleDetailsClientProps {
  role: Role;
}

export function RoleDetailsClient({ role }: RoleDetailsClientProps) {
  const router = useRouter();

  return (
    <div className="w-full mx-auto pb-8 min-w-0">
      <PageHeader 
        title={role.name}
        badges={<RoleTypeBadge type={role.type} />}
        backLink={{ href: '/roles', label: 'Back to Roles' }}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={() => router.push(`/roles/${role.id}/edit`)} variant="outline">
              {role.type === 'GLOBAL' ? 'Configure Permissions' : 'Edit Role'}
            </Button>
          </div>
        }
      />

      <div className="flex flex-col gap-8">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-neutral-500 mb-4 uppercase tracking-wider">Role Summary</h3>
          <div className="flex flex-col md:flex-row md:items-start gap-8">
            <div className="flex-1">
              <p className="text-base text-neutral-900 leading-relaxed">
                {role.description}
              </p>
              {role.type === 'GLOBAL' && (
                <div className="mt-4 p-3 bg-neutral-50 border border-neutral-200 rounded-md">
                  <p className="text-sm text-neutral-600">
                    <span className="font-medium text-neutral-900">Note:</span> This is a global system role. You can configure the permissions for your organization, but the role name and description cannot be changed.
                  </p>
                </div>
              )}
            </div>
            <div className="shrink-0 flex flex-col gap-1 min-w-[120px]">
              <span className="text-sm text-neutral-500">Users Assigned</span>
              <span className="text-2xl font-semibold text-neutral-900">{role.usersAssigned}</span>
            </div>
          </div>
        </Card>

        {/* Placeholder for Permission Matrix, to be implemented in Phase 3 */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-neutral-900">Configured Permissions</h3>
          </div>
          <div className="py-12 flex flex-col items-center justify-center text-center bg-neutral-50/50 rounded-lg border border-neutral-100 border-dashed">
            <p className="text-neutral-500 text-sm">Permission Matrix will be displayed here.</p>
            <p className="text-neutral-400 text-xs mt-1">This read-only grid will show the active grants for {role.name}.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
