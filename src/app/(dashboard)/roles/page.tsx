'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/src/components/ui/page-header';
import { Button } from '@/src/components/ui/button';
import { RolesTable } from '@/src/features/roles/components/roles-table';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { fetchRoles, selectRoles, selectRolesListStatus, selectRolesListError } from '@/src/features/roles/store/rolesSlice';
import { useAuth } from '@/src/features/auth/context/use-auth';
import { rolesApi } from '@/src/features/roles/api/roles.api';
import { BaseRole } from '@/src/features/roles/types/roles.types';
import { useRouter } from 'next/navigation';

export default function RolesPage() {
  const dispatch = useAppDispatch();
  const roles = useAppSelector(selectRoles);
  const status = useAppSelector(selectRolesListStatus);
  const error = useAppSelector(selectRolesListError);
  const { user } = useAuth();
  const router = useRouter();
  const isSuperAdmin = user?.systemRole === 'SUPER_ADMIN';
  const [globalRoles, setGlobalRoles] = React.useState<BaseRole[]>([]);
  const [globalStatus, setGlobalStatus] = React.useState<'loading' | 'succeeded' | 'failed'>('loading');
  const [globalError, setGlobalError] = React.useState('');

  const loadGlobalRoles = async () => {
    setGlobalStatus('loading');
    setGlobalError('');
    try {
      const response = await rolesApi.getGlobalRoles();
      setGlobalRoles(response.data.roles);
      setGlobalStatus('succeeded');
    } catch (err: any) {
      setGlobalError(err?.response?.data?.message || 'Failed to load global roles.');
      setGlobalStatus('failed');
    }
  };

  useEffect(() => {
    if (isSuperAdmin) {
      void loadGlobalRoles();
    } else if (status === 'idle') {
      dispatch(fetchRoles());
    }
  }, [status, dispatch, isSuperAdmin]);

  if (isSuperAdmin) {
    return (
      <div className="w-full mx-auto pb-12 min-w-0">
        <PageHeader title="Roles & Permissions" description="Global roles available across organizations." />
        {globalStatus === 'loading' ? <p className="py-8 text-center text-sm text-neutral-500">Loading global roles…</p>
          : globalStatus === 'failed' ? <div role="alert" className="p-6 text-center bg-red-50 border border-red-200 rounded-lg text-red-700"><h3 className="text-lg font-medium mb-2">Error Loading Roles</h3><p className="mb-4">{globalError}</p><Button variant="outline" onClick={() => void loadGlobalRoles()}>Retry</Button></div>
            : globalRoles.length === 0 ? <div className="rounded-lg border border-neutral-200 bg-white p-10 text-center text-sm text-neutral-500">No global roles found.</div>
              : <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white"><table className="w-full text-sm"><thead><tr className="border-b border-neutral-200 text-left text-neutral-500"><th className="px-5 py-3 font-medium">Role Name</th><th className="px-5 py-3 font-medium">Description</th><th className="px-5 py-3 text-right font-medium">Details</th></tr></thead><tbody>{globalRoles.map((role) => <tr key={role.id} className="border-b last:border-0"><td className="px-5 py-4 font-medium text-neutral-900">{role.name}</td><td className="px-5 py-4 text-neutral-600">{role.description || '—'}</td><td className="px-5 py-4 text-right"><Button variant="ghost" size="sm" onClick={() => router.push(`/roles/${role.id}`)}>View</Button></td></tr>)}</tbody></table></div>}
      </div>
    );
  }

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
