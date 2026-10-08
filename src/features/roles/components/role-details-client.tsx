'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { OrganizationRole } from '../types/roles.types';
import { PageHeader } from '@/src/components/ui/page-header';
import { Button } from '@/src/components/ui/button';
import { RoleTypeBadge } from './role-type-badge';
import { RoleDetailsOverview } from './role-details-overview';
import { RoleDetailsPermissions } from './role-details-permissions';
import { ConfirmationDialog } from '@/src/components/ui/confirmation-dialog';

interface RoleDetailsClientProps {
  role: OrganizationRole;
}

export function RoleDetailsClient({ role: orgRole }: RoleDetailsClientProps) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const handleDelete = async () => {
    // Simulate 800ms API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log('Custom Role deleted:', { id: orgRole.id, name: orgRole.role.name });
    router.push('/roles');
  };

  const isGlobal = orgRole.role.isGlobal;

  return (
    <div className="w-full mx-auto pb-8 min-w-0">
      <PageHeader 
        title={orgRole.role.name}
        badges={<RoleTypeBadge isGlobal={isGlobal} />}
        backLink={{ href: '/roles', label: 'Back to Roles' }}
        action={
          <div className="flex flex-wrap items-center gap-2">
            {!isGlobal && (
              <Button onClick={() => setIsDeleteDialogOpen(true)} variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-neutral-200">
                Delete Role
              </Button>
            )}
            <Button onClick={() => router.push(`/roles/${orgRole.id}/edit`)} variant={!isGlobal ? 'primary' : 'outline'}>
              {isGlobal ? 'Configure Permissions' : 'Edit Role'}
            </Button>
          </div>
        }
      />

      <div className="flex flex-col gap-8">
        <RoleDetailsOverview role={orgRole} />
        <RoleDetailsPermissions role={orgRole} />
      </div>

      {!isGlobal && (
        <ConfirmationDialog 
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          title="Delete Role?"
          description={`Are you sure you want to delete the role "${orgRole.role.name}"? This action cannot be undone.`}
          confirmLabel="Delete Role"
          variant="destructive"
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
