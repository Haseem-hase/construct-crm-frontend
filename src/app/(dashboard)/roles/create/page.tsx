'use client';

import React from 'react';
import { PageHeader } from '@/src/components/ui/page-header';
import { RoleForm } from '@/src/features/roles/components/role-form';
import { useAuth } from '@/src/features/auth/context/use-auth';

export default function CreateRolePage() {
  const { user } = useAuth();
  if (user?.systemRole === 'SUPER_ADMIN') {
    return <div className="mx-auto max-w-4xl pb-12"><PageHeader title="Create Global Role" backLink={{ href: '/roles', label: 'Back to Roles' }} /><div className="rounded-lg border border-neutral-200 bg-white p-6 text-sm text-neutral-600">Global role creation has a backend API, but its permission assignments are provisioned across organizations. This organization-specific form cannot safely create a platform role.</div></div>;
  }

  return (
    <div className="w-full mx-auto pb-8 min-w-0">
      <PageHeader 
        title="Create Custom Role"
        subtitle="Create an organization-specific role and configure its permissions."
        backLink={{ href: '/roles', label: 'Back to Roles' }}
      />
      
      <RoleForm mode="create" />
    </div>
  );
}
