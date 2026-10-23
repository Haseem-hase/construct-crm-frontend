'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { LabourAssignmentPageHeader } from '@/src/features/labour-assignments/components/labour-assignment-page-header';
import { LabourAssignmentFilters } from '@/src/features/labour-assignments/components/labour-assignment-filters';
import { LabourAssignmentTable } from '@/src/features/labour-assignments/components/labour-assignment-table';
import { LabourAssignment, LabourAssignmentStatus } from '@/src/features/labour-assignments/types/labour-assignment.types';
import { labourAssignmentsApi } from '@/src/features/labour-assignments/api/labour-assignments.api';
import { labourApi } from '@/src/features/labour/api/labour.api';
import { Pagination } from '@/src/components/ui/pagination';

export default function LabourAssignmentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [labourFilter, setLabourFilter] = useState('');
  const [professionFilter, setProfessionFilter] = useState('');
  const [contractorFilter, setContractorFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<LabourAssignmentStatus | ''>('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [assignments, setAssignments] = useState<LabourAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const load = async () => { setLoading(true); setLoadError(''); try { const [rows, labours] = await Promise.all([labourAssignmentsApi.list(), labourApi.list()]); const labourById = new Map(labours.map((l) => [l.id, l])); setAssignments(rows.map((a) => { const labour = labourById.get(a.labourId); return { id: a.id, labourId: a.labourId, labourName: a.labour.fullName, labourPhone: a.labour.phone, professionId: labour?.professionId || '', professionName: labour?.profession.name || '—', contractorProjectAssignmentId: a.contractorProjectAssignmentId, contractorId: a.assignment.contractor.id, contractorCode: a.assignment.contractor.contractorCode, contractorName: a.assignment.contractor.fullName, projectId: a.assignment.project.id, projectCode: a.assignment.project.projectCode, projectName: a.assignment.project.name, startDate: a.startDate, endDate: a.endDate, status: a.status, notes: a.notes || undefined, createdAt: a.createdAt }; })); } catch (error: any) { setLoadError(error?.response?.data?.message || 'Unable to load labour assignments.'); } finally { setLoading(false); } };
  useEffect(() => { void load(); }, []);

  const handleReset = () => {
    setSearchTerm('');
    setLabourFilter('');
    setProfessionFilter('');
    setContractorFilter('');
    setProjectFilter('');
    setStatusFilter('');
    setCurrentPage(1);
  };

  const filteredAssignments = useMemo(() => {
    return assignments.filter((assignment) => {
      if (statusFilter && assignment.status !== statusFilter) return false;
      if (labourFilter && assignment.labourId !== labourFilter) return false;
      if (professionFilter && assignment.professionName !== professionFilter) return false;
      if (contractorFilter && assignment.contractorId !== contractorFilter) return false;
      if (projectFilter && assignment.projectId !== projectFilter) return false;

      if (searchTerm) {
        const lowerSearch = searchTerm.toLowerCase();
        const matchesSearch =
          assignment.labourName.toLowerCase().includes(lowerSearch) ||
          assignment.labourPhone.toLowerCase().includes(lowerSearch) ||
          assignment.professionName.toLowerCase().includes(lowerSearch) ||
          assignment.contractorName.toLowerCase().includes(lowerSearch) ||
          assignment.contractorCode.toLowerCase().includes(lowerSearch) ||
          assignment.projectName.toLowerCase().includes(lowerSearch) ||
          assignment.projectCode.toLowerCase().includes(lowerSearch);
        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [assignments, searchTerm, labourFilter, professionFilter, contractorFilter, projectFilter, statusFilter]);

  const totalPages = Math.ceil(filteredAssignments.length / itemsPerPage);

  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }

  const paginatedAssignments = filteredAssignments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full mx-auto pb-12 min-w-0">
      <LabourAssignmentPageHeader />

        <LabourAssignmentFilters
          assignments={assignments}
          searchTerm={searchTerm}
          onSearchChange={(val) => { setSearchTerm(val); setCurrentPage(1); }}
          labourFilter={labourFilter}
          onLabourChange={(val) => { setLabourFilter(val); setCurrentPage(1); }}
          professionFilter={professionFilter}
          onProfessionChange={(val) => { setProfessionFilter(val); setCurrentPage(1); }}
          contractorFilter={contractorFilter}
          onContractorChange={(val) => { setContractorFilter(val); setCurrentPage(1); }}
          projectFilter={projectFilter}
          onProjectChange={(val) => { setProjectFilter(val); setCurrentPage(1); }}
          statusFilter={statusFilter}
          onStatusChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}
          onReset={handleReset}
        />
        {loading && <p className="py-8 text-center text-sm text-neutral-500">Loading labour assignments…</p>}
        {loadError && <div role="alert" className="my-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{loadError} <button className="ml-2 underline" onClick={() => void load()}>Retry</button></div>}

        {!loading && !loadError && <LabourAssignmentTable
          assignments={paginatedAssignments}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
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
