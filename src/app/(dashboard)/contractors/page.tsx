'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import {
  fetchContractors,
  selectContractors,
  selectContractorsListStatus,
  selectContractorsListError,
} from '@/src/features/contractors/store/contractorsSlice';
import { ContractorPageHeader } from '@/src/features/contractors/components/contractor-page-header';
import { ContractorFilters } from '@/src/features/contractors/components/contractor-filters';
import { ContractorTable } from '@/src/features/contractors/components/contractor-table';
import { Button } from '@/src/components/ui/button';

const ITEMS_PER_PAGE = 10;

export default function ContractorsPage() {
  const dispatch = useAppDispatch();
  const contractors = useAppSelector(selectContractors);
  const status = useAppSelector(selectContractorsListStatus);
  const error = useAppSelector(selectContractorsListError);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchContractors());
    }
  }, [status, dispatch]);

  // Extract unique cities from loaded contractor data
  const availableCities = useMemo(() => {
    const cities = new Set<string>();
    contractors.forEach((c) => {
      if (c.city && c.city.trim()) {
        cities.add(c.city.trim());
      }
    });
    return Array.from(cities).sort((a, b) => a.localeCompare(b));
  }, [contractors]);

  const handleReset = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCityFilter('all');
    setCurrentPage(1);
  };

  const filteredContractors = useMemo(() => {
    return contractors.filter((contractor) => {
      // 1. Search Query Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const searchMatches =
          (contractor.contractorCode && contractor.contractorCode.toLowerCase().includes(query)) ||
          (contractor.fullName && contractor.fullName.toLowerCase().includes(query)) ||
          (contractor.email && contractor.email.toLowerCase().includes(query)) ||
          (contractor.phone && contractor.phone.toLowerCase().includes(query)) ||
          (contractor.city && contractor.city.toLowerCase().includes(query)) ||
          (contractor.licenseNumber && contractor.licenseNumber.toLowerCase().includes(query));

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
  }, [searchQuery, statusFilter, cityFilter, contractors]);

  const totalPages = Math.ceil(filteredContractors.length / ITEMS_PER_PAGE) || 1;
  const currentItems = filteredContractors.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="w-full mx-auto pb-12 min-w-0">
      <ContractorPageHeader />

      <ContractorFilters
        searchQuery={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          setCurrentPage(1);
        }}
        statusFilter={statusFilter}
        onStatusChange={(val) => {
          setStatusFilter(val);
          setCurrentPage(1);
        }}
        cityFilter={cityFilter}
        onCityChange={(val) => {
          setCityFilter(val);
          setCurrentPage(1);
        }}
        availableCities={availableCities}
        onReset={handleReset}
      />

      {status === 'loading' || status === 'idle' ? (
        <div className="flex flex-col items-center justify-center py-16 text-neutral-500 bg-white border border-neutral-200 rounded-lg">
          <svg
            className="w-8 h-8 animate-spin mb-4 text-neutral-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p>Loading contractors...</p>
        </div>
      ) : status === 'failed' ? (
        <div className="p-6 text-center bg-red-50 border border-red-200 rounded-lg text-red-700">
          <h3 className="text-lg font-medium mb-2">Error Loading Contractors</h3>
          <p className="mb-4">{error || 'Failed to load contractors.'}</p>
          <Button
            variant="outline"
            className="bg-white hover:bg-red-50 text-red-700 border-red-200 hover:border-red-300"
            onClick={() => dispatch(fetchContractors())}
          >
            Retry
          </Button>
        </div>
      ) : (
        <ContractorTable
          contractors={currentItems}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
