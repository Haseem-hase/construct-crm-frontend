'use client';

import React from 'react';
import { PageHeader } from '@/src/components/ui/page-header';
import { RoleForm } from '@/src/features/roles/components/role-form';

export default function CreateRolePage() {
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
