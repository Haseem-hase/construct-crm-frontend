'use client';

import React from 'react';
import { PageHeader } from '@/src/components/ui/page-header';
import { RoleForm } from '@/src/features/roles/components/role-form';
import { useAuth } from '@/src/features/auth/context/use-auth';

export default function CreateRolePage() {
  const { user, isLoading } = useAuth();
  if (isLoading) return <p className="py-12 text-center text-sm text-neutral-500">Loading role access…</p>;
  const isSuperAdmin = user?.systemRole === 'SUPER_ADMIN';

  return (
    <div className="w-full mx-auto pb-8 min-w-0">
      <PageHeader 
        title={isSuperAdmin ? 'Create Global Role' : 'Create Custom Role'}
        subtitle={isSuperAdmin ? 'Create a role that is available across organizations.' : 'Create an organization-specific role and configure its permissions.'}
        backLink={{ href: '/roles', label: 'Back to Roles' }}
      />
      
      <RoleForm mode="create" scope={isSuperAdmin ? 'global' : 'organization'} />
    </div>
  );
}
