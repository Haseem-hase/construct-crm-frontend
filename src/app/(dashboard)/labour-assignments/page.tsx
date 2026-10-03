'use client';

import React, { useState, useMemo } from 'react';
import { LabourAssignmentPageHeader } from '@/src/features/labour-assignments/components/labour-assignment-page-header';
import { LabourAssignmentFilters } from '@/src/features/labour-assignments/components/labour-assignment-filters';
import { LabourAssignmentTable } from '@/src/features/labour-assignments/components/labour-assignment-table';
import { mockLabourAssignments } from '@/src/features/labour-assignments/data/labour-assignments.mock';
import { LabourAssignmentStatus } from '@/src/features/labour-assignments/types/labour-assignment.types';
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
    return mockLabourAssignments.filter((assignment) => {
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
  }, [searchTerm, labourFilter, professionFilter, contractorFilter, projectFilter, statusFilter]);

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
          assignments={mockLabourAssignments}
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

        <LabourAssignmentTable 
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
  );
}
