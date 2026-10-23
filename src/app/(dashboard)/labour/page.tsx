'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { labourApi, ApiLabour } from '@/src/features/labour/api/labour.api';
import { labourLookupsApi, LookupItem } from '@/src/features/labour/api/labour-lookups.api';
import { Labour } from '@/src/features/labour/types/labour.types';
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
  const [labourRows, setLabourRows] = useState<Labour[]>([]);
  const [professions, setProfessions] = useState<LookupItem[]>([]);
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(true);
  const load = async () => {
    setLoading(true); setLoadError('');
    try { const rows = await labourApi.list(); setLabourRows(rows.map((l: ApiLabour) => ({ ...l, professionName: l.profession.name, email: l.email ?? undefined, dateOfBirth: l.dateOfBirth ?? undefined, address: l.address ?? undefined, emergencyContactName: l.emergencyContactName ?? undefined, emergencyContactPhone: l.emergencyContactPhone ?? undefined, joiningDate: l.joiningDate ?? undefined, profileImageUrl: l.profileImageUrl ?? undefined, notes: l.notes ?? undefined }))); }
    catch (error: any) { setLoadError(error?.response?.data?.message || 'Unable to load labour records.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); labourLookupsApi.professions().then(setProfessions).catch(() => undefined); }, []);

  const availableCities = useMemo(() => {
    const cities = new Set(labourRows.map(l => l.city));
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
    return labourRows.filter(labour => {
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
  }, [labourRows, searchQuery, professionFilter, statusFilter, cityFilter]);

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
        professions={professions}
        onReset={handleReset}
      />
      {loading && <p className="py-8 text-center text-sm text-neutral-500">Loading labour…</p>}
      {loadError && <div role="alert" className="my-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{loadError} <button className="ml-2 underline" onClick={() => void load()}>Retry</button></div>}

      {!loading && !loadError && <LabourTable
        labourData={currentItems}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />}
    </div>
  );
}
