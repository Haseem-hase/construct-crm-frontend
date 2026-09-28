'use client';

import React, { useState, useMemo } from 'react';
import { ProjectPageHeader } from '@/src/features/projects/components/project-page-header';
import { ProjectFilters } from '@/src/features/projects/components/project-filters';
import { ProjectTable } from '@/src/features/projects/components/project-table';
import { mockProjects } from '@/src/features/projects/data/projects.mock';
import { ProjectStatus } from '@/src/features/projects/types/project.types';
import { Pagination } from '@/src/components/ui/pagination';

const ITEMS_PER_PAGE = 10;

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'ALL'>('ALL');
  const [customerFilter, setCustomerFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);

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
    return mockProjects.filter(project => {
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
  }, [searchQuery, statusFilter, customerFilter]);

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
    <div className="w-full mx-auto pb-8 min-w-0">
      <ProjectPageHeader />
      
      <ProjectFilters 
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        customerFilter={customerFilter}
        onCustomerFilterChange={handleCustomerFilterChange}
        onReset={handleReset}
      />
      
      <ProjectTable 
        projects={paginatedProjects} 
        onClearFilters={handleReset}
        currentPage={validCurrentPage}
        itemsPerPage={ITEMS_PER_PAGE}
      />

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
