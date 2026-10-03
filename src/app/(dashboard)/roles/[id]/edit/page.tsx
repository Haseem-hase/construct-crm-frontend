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
  const role = mockRoles.find(r => r.id === id);
  
  if (!role) {
    notFound();
  }

  const isGlobal = role.type === 'GLOBAL';

  return (
    <div className="w-full mx-auto pb-8 min-w-0">
      <PageHeader 
        title={isGlobal ? 'Configure Permissions' : 'Edit Role'}
        subtitle={
          isGlobal 
            ? 'Configure the permissions for this global role in your organization.' 
            : 'Update the role details and permissions.'
        }
        badges={<RoleTypeBadge type={role.type} />}
        backLink={{ href: `/roles/${role.id}`, label: 'Back to Role Details' }}
      />
      
      <RoleForm mode="edit" initialData={role} />
    </div>
  );
}
