'use client';

import { ReactNode, useEffect, useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { organizationsApi } from '@/src/features/super-admin/api/organizations.api';
import { Organization } from '@/src/features/super-admin/types/organizations.types';
import { useAuth } from '@/src/features/auth/context/use-auth';
import { clearSelectedInventoryOrganization, getSelectedInventoryOrganization, setSelectedInventoryOrganization } from '../utils/inventory-organization';

export function InventoryOrganizationGate({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const isSuperAdmin = user?.systemRole === 'SUPER_ADMIN';
  const [selected, setSelected] = useState(getSelectedInventoryOrganization);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const syncSelection = () => setSelected(getSelectedInventoryOrganization());
    window.addEventListener('constructcrm:inventory-organization-changed', syncSelection);
    return () => window.removeEventListener('constructcrm:inventory-organization-changed', syncSelection);
  }, []);

  useEffect(() => {
    if (!isSuperAdmin) {
      clearSelectedInventoryOrganization();
      setSelected(null);
      return;
    }
    let active = true;
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError('');
      try {
        const result = await organizationsApi.list({ search: search.trim() || undefined, page: 1, pageSize: 100 });
        if (!active) return;
        setOrganizations(result.organizations);
        const current = getSelectedInventoryOrganization();
        const known = result.organizations.find(org => org.id === current?.id);
        if (known) setSelectedInventoryOrganization({ id: known.id, name: known.name });
      } catch {
        if (active) setError('Organizations could not be loaded. Try again in a moment.');
      } finally {
        if (active) setLoading(false);
      }
    }, 180);
    return () => { active = false; window.clearTimeout(timer); };
  }, [isSuperAdmin, search]);

  const chooseOrganization = (organization: Organization) => {
    setSelectedInventoryOrganization({ id: organization.id, name: organization.name });
    setSelected({ id: organization.id, name: organization.name });
  };

  if (isSuperAdmin && !selected) {
    return (
      <section className="mx-auto max-w-2xl rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-900 text-white">
          <span className="text-lg font-semibold">I</span>
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">Platform access</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900">Choose an organization</h1>
        <p className="mt-2 max-w-lg text-sm leading-6 text-neutral-500">Inventory is always opened inside one organization. Select the tenant you’re authorized to inspect before continuing.</p>
        <div className="mt-6 space-y-3">
          <Input aria-label="Search organizations" placeholder="Search by organization name" value={search} onChange={event => setSearch(event.target.value)} />
          {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
          <div className="max-h-80 overflow-y-auto rounded-xl border border-neutral-200">
            {organizations.map(organization => (
              <button key={organization.id} type="button" onClick={() => chooseOrganization(organization)} className="flex w-full items-center justify-between border-b border-neutral-100 px-4 py-3 text-left last:border-0 hover:bg-neutral-50">
                <span className="min-w-0"><span className="block truncate text-sm font-medium text-neutral-900">{organization.name}</span><span className="mt-0.5 block truncate font-mono text-[11px] text-neutral-400">{organization.id}</span></span>
                <span className="ml-4 text-xs font-medium text-neutral-500">Open →</span>
              </button>
            ))}
            {!loading && organizations.length === 0 && <p className="px-4 py-8 text-center text-sm text-neutral-500">No organizations found.</p>}
            {loading && <p className="px-4 py-8 text-center text-sm text-neutral-500">Loading organizations…</p>}
          </div>
          {organizations.length === 100 && <p className="text-xs text-neutral-400">Showing the first 100 matches. Refine the search to find another organization.</p>}
          <Button type="button" variant="ghost" size="sm" onClick={() => setSearch('')}>Clear search</Button>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 rounded-xl border border-neutral-200/80 bg-white px-4 py-3 sm:flex-row sm:items-center sm:px-5">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400">Inventory workspace</p>
          <p className="mt-0.5 truncate text-sm font-medium text-neutral-900">{isSuperAdmin ? selected?.name : 'Your organization'}</p>
        </div>
        {isSuperAdmin && <button type="button" onClick={clearSelectedInventoryOrganization} className="text-left text-xs font-medium text-neutral-500 underline decoration-neutral-300 underline-offset-4 hover:text-neutral-900 sm:text-right">Switch organization</button>}
      </div>
      <div key={selected?.id || user?.organizationId || 'organization'}>{children}</div>
    </div>
  );
}
