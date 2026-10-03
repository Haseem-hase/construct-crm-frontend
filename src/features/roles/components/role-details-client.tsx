'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Role } from '../types/roles.types';
import { PageHeader } from '@/src/components/ui/page-header';
import { Button } from '@/src/components/ui/button';
import { RoleTypeBadge } from './role-type-badge';
import { RoleDetailsOverview } from './role-details-overview';
import { RoleDetailsPermissions } from './role-details-permissions';

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
        <RoleDetailsOverview role={role} />
        <RoleDetailsPermissions role={role} />
      </div>
    </div>
  );
}
