'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { AssignmentPageHeader } from '@/src/features/assignments/components/assignment-page-header';
import { AssignmentFilters } from '@/src/features/assignments/components/assignment-filters';
import { AssignmentTable } from '@/src/features/assignments/components/assignment-table';
import { Assignment, AssignmentStatus } from '@/src/features/assignments/types/assignment.types';
import { assignmentsApi } from '@/src/features/assignments/api/assignments.api';
import { Pagination } from '@/src/components/ui/pagination';
import { useAuth } from '@/src/features/auth/context/use-auth';

export default function AssignmentsPage() {
  const { user } = useAuth();
  const readOnly = user?.systemRole === 'SUPER_ADMIN';
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AssignmentStatus | ''>('');
  const [projectFilter, setProjectFilter] = useState('');
  const [contractorFilter, setContractorFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const load = async () => { setLoading(true); setLoadError(''); try { const rows = await assignmentsApi.list(); setAssignments(rows.map((a) => ({ id: a.id, projectId: a.projectId, projectCode: a.project.projectCode, projectName: a.project.name, organizationName: a.project.organization?.name, contractorId: a.contractorId, contractorCode: a.contractor.contractorCode, contractorName: a.contractor.fullName, responsibilityIds: a.responsibilities.map((r) => r.responsibilityId), responsibilityNames: a.responsibilities.map((r) => r.responsibility.name), scope: a.scopeDescription || '', startDate: a.startDate || undefined, endDate: a.endDate || undefined, status: a.status, notes: a.notes || undefined, createdAt: a.createdAt }))); } catch (error: any) { setLoadError(error?.response?.data?.message || 'Unable to load contractor assignments.'); } finally { setLoading(false); } };
  useEffect(() => { void load(); }, []);

  const handleReset = () => {
    setSearchTerm('');
    setStatusFilter('');
    setProjectFilter('');
    setContractorFilter('');
    setCurrentPage(1);
  };

  const filteredAssignments = useMemo(() => {
    return assignments.filter((assignment) => {
      // Status filter
      if (statusFilter && assignment.status !== statusFilter) return false;
      // Project filter
      if (projectFilter && assignment.projectId !== projectFilter) return false;
      // Contractor filter
      if (contractorFilter && assignment.contractorId !== contractorFilter) return false;

      // Search term
      if (searchTerm) {
        const lowerSearch = searchTerm.toLowerCase();
        const matchesSearch =
          assignment.projectCode.toLowerCase().includes(lowerSearch) ||
          assignment.projectName.toLowerCase().includes(lowerSearch) ||
          assignment.contractorCode.toLowerCase().includes(lowerSearch) ||
          assignment.contractorName.toLowerCase().includes(lowerSearch);
        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [assignments, searchTerm, statusFilter, projectFilter, contractorFilter]);

  const totalPages = Math.ceil(filteredAssignments.length / itemsPerPage);

  // Reset to page 1 if current page becomes invalid due to filtering
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }

  const paginatedAssignments = filteredAssignments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full mx-auto pb-12 min-w-0">
      <AssignmentPageHeader readOnly={readOnly} />

        <AssignmentFilters
          assignments={assignments}
          searchTerm={searchTerm}
          onSearchChange={(val) => { setSearchTerm(val); setCurrentPage(1); }}
          statusFilter={statusFilter}
          onStatusChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}
          projectFilter={projectFilter}
          onProjectChange={(val) => { setProjectFilter(val); setCurrentPage(1); }}
          contractorFilter={contractorFilter}
          onContractorChange={(val) => { setContractorFilter(val); setCurrentPage(1); }}
          onReset={handleReset}
        />
        {loading && <p className="py-8 text-center text-sm text-neutral-500">Loading assignments…</p>}
        {loadError && <div role="alert" className="my-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{loadError} <button className="ml-2 underline" onClick={() => void load()}>Retry</button></div>}

        {!loading && !loadError && <AssignmentTable
          assignments={paginatedAssignments}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          readOnly={readOnly}
        />}

        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
  );
}
