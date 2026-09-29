'use client';

import React, { useState, useMemo } from 'react';
import { AssignmentPageHeader } from '@/src/features/assignments/components/assignment-page-header';
import { AssignmentFilters } from '@/src/features/assignments/components/assignment-filters';
import { AssignmentTable } from '@/src/features/assignments/components/assignment-table';
import { mockAssignments } from '@/src/features/assignments/data/assignments.mock';
import { AssignmentStatus } from '@/src/features/assignments/types/assignment.types';
import { Pagination } from '@/src/components/ui/pagination';

export default function AssignmentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AssignmentStatus | ''>('');
  const [projectFilter, setProjectFilter] = useState('');
  const [contractorFilter, setContractorFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleReset = () => {
    setSearchTerm('');
    setStatusFilter('');
    setProjectFilter('');
    setContractorFilter('');
    setCurrentPage(1);
  };

  const filteredAssignments = useMemo(() => {
    return mockAssignments.filter((assignment) => {
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
  }, [searchTerm, statusFilter, projectFilter, contractorFilter]);

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
    <div className="flex flex-col gap-8 pb-12">
      <AssignmentPageHeader />
      
      <div className="flex flex-col gap-6">
        <AssignmentFilters
          assignments={mockAssignments}
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

        <AssignmentTable 
          assignments={paginatedAssignments} 
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
        />

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
    </div>
  );
}
