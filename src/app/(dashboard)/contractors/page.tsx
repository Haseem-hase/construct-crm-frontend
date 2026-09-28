'use client';

import React, { useState, useMemo } from 'react';
import { mockContractors } from '@/src/features/contractors/data/contractors.mock';
import { ContractorPageHeader } from '@/src/features/contractors/components/contractor-page-header';
import { ContractorFilters } from '@/src/features/contractors/components/contractor-filters';
import { ContractorTable } from '@/src/features/contractors/components/contractor-table';

const ITEMS_PER_PAGE = 10;

export default function ContractorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Extract unique cities from mock data
  const availableCities = useMemo(() => {
    const cities = new Set(mockContractors.map(c => c.city));
    return Array.from(cities).sort((a, b) => a.localeCompare(b));
  }, []);

  const handleReset = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCityFilter('all');
    setCurrentPage(1);
  };

  const filteredContractors = useMemo(() => {
    return mockContractors.filter(contractor => {
      // 1. Search Query Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const searchMatches = 
          contractor.contractorCode.toLowerCase().includes(query) ||
          contractor.companyName.toLowerCase().includes(query) ||
          contractor.contactPerson.toLowerCase().includes(query) ||
          contractor.email.toLowerCase().includes(query) ||
          contractor.phone.toLowerCase().includes(query) ||
          contractor.city.toLowerCase().includes(query) ||
          contractor.licenseNumber.toLowerCase().includes(query);
          
        if (!searchMatches) return false;
      }

      // 2. Status Filter
      if (statusFilter !== 'all' && contractor.status !== statusFilter) {
        return false;
      }

      // 3. City Filter
      if (cityFilter !== 'all' && contractor.city !== cityFilter) {
        return false;
      }

      return true;
    });
  }, [searchQuery, statusFilter, cityFilter]);

  const totalPages = Math.ceil(filteredContractors.length / ITEMS_PER_PAGE) || 1;
  const currentItems = filteredContractors.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="w-full mx-auto pb-12 min-w-0 max-w-7xl">
      <ContractorPageHeader />
      
      <ContractorFilters
        searchQuery={searchQuery}
        onSearchChange={(val) => { setSearchQuery(val); setCurrentPage(1); }}
        statusFilter={statusFilter}
        onStatusChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}
        cityFilter={cityFilter}
        onCityChange={(val) => { setCityFilter(val); setCurrentPage(1); }}
        availableCities={availableCities}
        onReset={handleReset}
      />

      <ContractorTable
        contractors={currentItems}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
