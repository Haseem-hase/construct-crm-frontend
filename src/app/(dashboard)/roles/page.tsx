'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/src/components/ui/page-header';
import { Button } from '@/src/components/ui/button';
import { RolesTable } from '@/src/features/roles/components/roles-table';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { fetchRoles, selectRoles, selectRolesListStatus, selectRolesListError } from '@/src/features/roles/store/rolesSlice';

export default function RolesPage() {
  const dispatch = useAppDispatch();
  const roles = useAppSelector(selectRoles);
  const status = useAppSelector(selectRolesListStatus);
  const error = useAppSelector(selectRolesListError);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchRoles());
    }
  }, [status, dispatch]);

  return (
    <div className="w-full mx-auto pb-12 min-w-0">
      <PageHeader 
        title="Roles & Permissions"
        description="Manage global system roles and custom organization roles."
        action={
          <Link href="/roles/create">
            <Button variant="primary">
              Create Custom Role
            </Button>
          </Link>
        }
      />
      
      {status === 'loading' || status === 'idle' ? (
        <div className="flex flex-col items-center justify-center py-16 text-neutral-500 bg-white border border-neutral-200 rounded-lg">
          <svg className="w-8 h-8 animate-spin mb-4 text-neutral-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p>Loading roles...</p>
        </div>
      ) : status === 'failed' ? (
        <div className="p-6 text-center bg-red-50 border border-red-200 rounded-lg text-red-700">
          <h3 className="text-lg font-medium mb-2">Error Loading Roles</h3>
          <p className="mb-4">{error}</p>
          <Button 
            variant="outline" 
            className="bg-white hover:bg-red-50 text-red-700 border-red-200 hover:border-red-300"
            onClick={() => dispatch(fetchRoles())}
          >
            Retry
          </Button>
        </div>
      ) : (
        <RolesTable roles={roles} />
      )}
    </div>
  );
}
