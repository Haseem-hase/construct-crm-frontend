'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/src/components/ui/button';
import { EmptyState } from '@/src/components/ui/empty-state';
import { Input } from '@/src/components/ui/input';
import { PageHeader } from '@/src/components/ui/page-header';
import { Pagination } from '@/src/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import {
  fetchOrganizations,
  selectOrganizations,
  selectOrganizationsListError,
  selectOrganizationsListStatus,
  selectOrganizationsPagination,
} from '../store/organizationsSlice';

const PAGE_SIZE = 10;

export function OrganizationsList() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const organizations = useAppSelector(selectOrganizations);
  const pagination = useAppSelector(selectOrganizationsPagination);
  const status = useAppSelector(selectOrganizationsListStatus);
  const error = useAppSelector(selectOrganizationsListError);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [ready, setReady] = useState(false);
  const [createdNotice, setCreatedNotice] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialSearch = params.get('search') ?? '';
    setSearch(initialSearch);
    setDebouncedSearch(initialSearch.trim());
    setCreatedNotice(params.get('created') === '1');
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const timeout = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => window.clearTimeout(timeout);
  }, [search, ready]);

  useEffect(() => {
    if (!ready) return;
    const request = dispatch(fetchOrganizations({
      search: debouncedSearch || undefined,
      page,
      pageSize: PAGE_SIZE,
    }));
    return () => request.abort();
  }, [debouncedSearch, dispatch, page, ready]);

  const retry = useCallback(() => {
    void dispatch(fetchOrganizations({ search: debouncedSearch || undefined, page, pageSize: PAGE_SIZE }));
  }, [debouncedSearch, dispatch, page]);

  const total = pagination?.total ?? 0;
  const totalPages = pagination?.totalPages ?? 0;
  const currentPage = pagination?.page ?? page;

  return (
    <div className="w-full min-w-0 pb-12">
      <PageHeader
        title="Organizations"
        description="Manage organizations and their initial owner accounts."
        action={<Button onClick={() => router.push('/super-admin/organizations/create')}>Create Organization</Button>}
      />

      {createdNotice && (
        <div role="status" className="mb-5 flex items-center justify-between gap-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <span>Organization created. It is shown below and can also be found using search.</span>
          <button type="button" className="shrink-0 font-medium underline underline-offset-2" onClick={() => setCreatedNotice(false)}>Dismiss</button>
        </div>
      )}

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m16 16 4 4" />
          </svg>
          <Input
            aria-label="Search organizations by name"
            placeholder="Search organizations"
            value={search}
            maxLength={150}
            onChange={(event) => { setSearch(event.target.value); setPage(1); }}
            className="pl-9"
          />
        </div>
        <p className="text-sm text-neutral-500" aria-live="polite">
          {status === 'loading' ? 'Updating organizations…' : `${total} ${total === 1 ? 'organization' : 'organizations'}`}
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-neutral-200/70 bg-white shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]">
        {status === 'loading' && (
          <div className="px-6 py-12 text-center text-sm text-neutral-500" role="status" aria-busy="true">Loading organizations…</div>
        )}

        {status === 'failed' && (
          <div className="m-4 flex flex-col items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between">
            <p role="alert">{error || 'Unable to load organizations.'}</p>
            <Button variant="outline" size="sm" onClick={retry}>Retry</Button>
          </div>
        )}

        {status === 'succeeded' && organizations.length === 0 && (
          <EmptyState
            title={debouncedSearch ? 'No matching organizations' : 'No organizations yet'}
            description={debouncedSearch ? 'Try another organization name or clear your search.' : 'Create the first organization to get started.'}
            action={debouncedSearch
              ? <Button variant="outline" onClick={() => { setSearch(''); setPage(1); }}>Clear search</Button>
              : <Button onClick={() => router.push('/super-admin/organizations/create')}>Create Organization</Button>}
          />
        )}

        {status === 'succeeded' && organizations.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Organization</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organizations.map((organization) => (
                <TableRow key={organization.id}>
                  <TableCell className="max-w-[220px] sm:max-w-none">
                    <div className="truncate font-medium">{organization.name}</div>
                    <div className="mt-1 truncate font-mono text-xs text-neutral-400">{organization.id}</div>
                  </TableCell>
                  <TableCell className="max-w-[320px] whitespace-normal text-neutral-600">
                    {organization.description?.trim() || <span className="text-neutral-400">No description</span>}
                  </TableCell>
                  <TableCell className="text-neutral-600">
                    <time dateTime={organization.createdAt}>
                      {new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(organization.createdAt))}
                    </time>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {status === 'succeeded' && total > 0 && pagination && (
        <Pagination
          className="mt-5"
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={total}
          itemsPerPage={pagination.pageSize}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
