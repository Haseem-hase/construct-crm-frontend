'use client';

import React, { useState, useMemo } from 'react';
import { mockLabour } from '@/src/features/labour/data/labour.mock';
import { LabourPageHeader } from '@/src/features/labour/components/labour-page-header';
import { LabourFilters } from '@/src/features/labour/components/labour-filters';
import { LabourTable } from '@/src/features/labour/components/labour-table';

const ITEMS_PER_PAGE = 10;

export default function LabourPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [professionFilter, setProfessionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Extract unique cities from mock data
  const availableCities = useMemo(() => {
    const cities = new Set(mockLabour.map(l => l.city));
    return Array.from(cities).sort((a, b) => a.localeCompare(b));
  }, []);

  const handleReset = () => {
    setSearchQuery('');
    setProfessionFilter('all');
    setStatusFilter('all');
    setCityFilter('all');
    setCurrentPage(1);
  };

  const filteredLabour = useMemo(() => {
    return mockLabour.filter(labour => {
      // 1. Search Query Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const searchMatches = 
          labour.fullName.toLowerCase().includes(query) ||
          labour.phone.toLowerCase().includes(query) ||
          (labour.email && labour.email.toLowerCase().includes(query)) ||
          labour.professionName.toLowerCase().includes(query);
          
        if (!searchMatches) return false;
      }

      // 2. Profession Filter
      if (professionFilter !== 'all' && labour.professionId !== professionFilter) {
        return false;
      }

      // 3. Status Filter
      if (statusFilter !== 'all' && labour.status !== statusFilter) {
        return false;
      }

      // 4. City Filter
      if (cityFilter !== 'all' && labour.city !== cityFilter) {
        return false;
      }

      return true;
    });
  }, [searchQuery, professionFilter, statusFilter, cityFilter]);

  const totalPages = Math.ceil(filteredLabour.length / ITEMS_PER_PAGE) || 1;
  const currentItems = filteredLabour.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="w-full mx-auto pb-12 min-w-0">
      <LabourPageHeader />
      
      <LabourFilters
        searchQuery={searchQuery}
        onSearchChange={(val) => { setSearchQuery(val); setCurrentPage(1); }}
        professionFilter={professionFilter}
        onProfessionChange={(val) => { setProfessionFilter(val); setCurrentPage(1); }}
        statusFilter={statusFilter}
        onStatusChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}
        cityFilter={cityFilter}
        onCityChange={(val) => { setCityFilter(val); setCurrentPage(1); }}
        availableCities={availableCities}
        onReset={handleReset}
      />

      <LabourTable
        labourData={currentItems}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
