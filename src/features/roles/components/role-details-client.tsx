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
import { SuccessAlert } from '@/src/components/ui/success-alert';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { deleteRole, selectDeleteRoleStatus, selectDeleteRoleError, resetDeleteState } from '../store/rolesSlice';

interface RoleDetailsClientProps {
  role: OrganizationRole;
}

export function RoleDetailsClient({ role: orgRole }: RoleDetailsClientProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const deleteStatus = useAppSelector(selectDeleteRoleStatus);
  const deleteError = useAppSelector(selectDeleteRoleError);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleDelete = async () => {
    const resultAction = await dispatch(deleteRole(orgRole.id));
    if (deleteRole.fulfilled.match(resultAction)) {
      setIsDeleteDialogOpen(false);
      setShowSuccessAlert(true);
      timeoutRef.current = setTimeout(() => {
        setShowSuccessAlert(false);
        router.push('/roles');
      }, 1500);
    }
  };

  const handleCloseDialog = (open: boolean) => {
    if (!open) {
      if (deleteStatus !== 'loading') {
        setIsDeleteDialogOpen(false);
        dispatch(resetDeleteState());
      }
    } else {
      setIsDeleteDialogOpen(true);
    }
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
            <Button onClick={() => router.push(`/roles/${orgRole.id}/edit?from=details`)} variant={!isGlobal ? 'primary' : 'outline'}>
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
          onOpenChange={handleCloseDialog}
          title="Delete Role?"
          description={
            deleteError 
              ? <span className="text-red-600">{deleteError}</span>
              : `Are you sure you want to delete the role "${orgRole.role.name}"? This action cannot be undone.`
          }
          confirmLabel={deleteStatus === 'loading' ? 'Deleting...' : 'Delete Role'}
          variant="destructive"
          onConfirm={handleDelete}
          confirmDisabled={deleteStatus === 'loading'}
        />
      )}

      <SuccessAlert 
        title="Role deleted successfully"
        description="The role has been deleted successfully."
        show={showSuccessAlert} 
      />
    </div>
  );
}
