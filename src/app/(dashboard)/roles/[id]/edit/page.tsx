'use client';

import React from 'react';
import { notFound, useParams } from 'next/navigation';
import { PageHeader } from '@/src/components/ui/page-header';
import { RoleForm } from '@/src/features/roles/components/role-form';
import { mockRoles } from '@/src/features/roles/data/roles.mock';
import { RoleTypeBadge } from '@/src/features/roles/components/role-type-badge';

export default function EditRolePage() {
  const params = useParams();
  const id = params.id as string;
  
  // Resolve role
  const orgRole = mockRoles.find(r => r.id === id);
  
  if (!orgRole) {
    notFound();
  }

  const isGlobal = orgRole.role.isGlobal;

  return (
    <div className="w-full mx-auto pb-8 min-w-0">
      <PageHeader 
        title={isGlobal ? 'Configure Permissions' : 'Edit Role'}
        subtitle={
          isGlobal 
            ? 'Configure the permissions for this global role in your organization.' 
            : 'Update the role details and permissions.'
        }
        badges={<RoleTypeBadge isGlobal={isGlobal} />}
        backLink={{ href: `/roles/${orgRole.id}`, label: 'Back to Role Details' }}
      />
      
      <RoleForm mode="edit" initialData={orgRole} />
    </div>
  );
}
