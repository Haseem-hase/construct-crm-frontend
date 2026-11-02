'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { ProjectPageHeader } from '@/src/features/projects/components/project-page-header';
import { ProjectFilters } from '@/src/features/projects/components/project-filters';
import { ProjectTable } from '@/src/features/projects/components/project-table';
import { Project, ProjectStatus } from '@/src/features/projects/types/project.types';
import { projectsApi } from '@/src/features/projects/api/projects.api';
import { Pagination } from '@/src/components/ui/pagination';
import { useAuth } from '@/src/features/auth/context/use-auth';

const ITEMS_PER_PAGE = 10;

export default function ProjectsPage() {
  const { user } = useAuth();
  const readOnly = user?.systemRole === 'SUPER_ADMIN';
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'ALL'>('ALL');
  const [customerFilter, setCustomerFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const loadProjects = async () => {
    setLoading(true); setLoadError('');
    try {
      const rows = await projectsApi.list();
      setProjects(rows.map((p) => { const primary = p.projectCustomers?.find((r) => r.isPrimary) || p.projectCustomers?.[0]; return { id: p.id, projectCode: p.projectCode, name: p.name, customerId: primary?.customerId ?? '', customerName: primary?.customer?.name ?? '—', organizationName: p.organization?.name, status: ({ PLANNING: 'Planning', ACTIVE: 'Active', COMPLETED: 'Completed', ON_HOLD: 'On Hold', CANCELLED: 'Cancelled' } as const)[p.status], progress: p.progress, startDate: p.plannedStartDate ?? '', plannedEndDate: p.plannedEndDate ?? '', description: p.description ?? undefined, budget: p.budget ?? undefined, createdAt: p.createdAt }; }));
    } catch (error: any) { setLoadError(error?.response?.data?.message || 'Unable to load projects.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { void loadProjects(); }, []);

  const handleReset = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setCustomerFilter('ALL');
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (val: ProjectStatus | 'ALL') => {
    setStatusFilter(val);
    setCurrentPage(1);
  };

  const handleCustomerFilterChange = (val: string) => {
    setCustomerFilter(val);
    setCurrentPage(1);
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // Status filter
      if (statusFilter !== 'ALL' && project.status !== statusFilter) {
        return false;
      }

      // Customer filter
      if (customerFilter !== 'ALL' && project.customerName !== customerFilter) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          project.name.toLowerCase().includes(query) ||
          project.projectCode.toLowerCase().includes(query) ||
          project.customerName.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [projects, searchQuery, statusFilter, customerFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / ITEMS_PER_PAGE));

  // Ensure current page is valid after filtering
  const validCurrentPage = Math.min(currentPage, totalPages);

  if (currentPage !== validCurrentPage && validCurrentPage > 0) {
    setCurrentPage(validCurrentPage);
  }

  const paginatedProjects = useMemo(() => {
    const start = (validCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredProjects.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProjects, validCurrentPage]);

  return (
    <div className="w-full mx-auto pb-12 min-w-0">
      <ProjectPageHeader readOnly={readOnly} />

      <ProjectFilters
        projects={projects}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        customerFilter={customerFilter}
        onCustomerFilterChange={handleCustomerFilterChange}
        onReset={handleReset}
      />
      {loading && <p className="py-8 text-center text-sm text-neutral-500">Loading projects…</p>}
      {loadError && <div role="alert" className="my-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{loadError} <button className="ml-2 underline" onClick={() => void loadProjects()}>Retry</button></div>}

      {!loading && !loadError && <ProjectTable
        projects={paginatedProjects}
        onClearFilters={handleReset}
        currentPage={validCurrentPage}
        itemsPerPage={ITEMS_PER_PAGE}
        readOnly={readOnly}
      />}

      {/* Pagination UI */}
      {filteredProjects.length > 0 && (
        <Pagination
          className="mt-6"
          currentPage={validCurrentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredProjects.length}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      )}
    </div>
  );
}
