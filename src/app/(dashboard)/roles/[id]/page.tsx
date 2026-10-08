'use client';

import React, { use, useEffect } from 'react';
import Link from 'next/link';
import { RoleDetailsClient } from '@/src/features/roles/components/role-details-client';
import { EmptyState } from '@/src/components/ui/empty-state';
import { Button } from '@/src/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { 
  fetchRoleById, 
  clearSelectedRole, 
  selectSelectedRole, 
  selectRolesDetailStatus, 
  selectRolesDetailError 
} from '@/src/features/roles/store/rolesSlice';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function RoleDetailsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  
  const dispatch = useAppDispatch();
  const role = useAppSelector(selectSelectedRole);
  const status = useAppSelector(selectRolesDetailStatus);
  const error = useAppSelector(selectRolesDetailError);

  useEffect(() => {
    dispatch(fetchRoleById(id));
    
    return () => {
      dispatch(clearSelectedRole());
    };
  }, [dispatch, id]);

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="w-full mx-auto pb-12 min-w-0 max-w-5xl flex flex-col items-center justify-center py-24 text-neutral-500">
        <svg className="w-8 h-8 animate-spin mb-4 text-neutral-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p>Loading role details...</p>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="w-full mx-auto pb-12 min-w-0 max-w-5xl">
        <div className="p-6 text-center bg-red-50 border border-red-200 rounded-lg text-red-700 mt-8">
          <h3 className="text-lg font-medium mb-2">Error Loading Role</h3>
          <p className="mb-4">{error}</p>
          <Button 
            variant="outline" 
            className="bg-white hover:bg-red-50 text-red-700 border-red-200 hover:border-red-300"
            onClick={() => dispatch(fetchRoleById(id))}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="w-full mx-auto pb-12 min-w-0 max-w-5xl">
        <EmptyState 
          title="Role Not Found"
          description="The role you are looking for does not exist or has been removed."
          action={
            <Link href="/roles">
              <Button variant="outline">
                Back to Roles
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return <RoleDetailsClient role={role} />;
}
