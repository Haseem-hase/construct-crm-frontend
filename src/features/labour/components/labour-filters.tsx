import React from 'react';
import { Input } from '@/src/components/ui/input';
import { Select } from '@/src/components/ui/select';
import { Button } from '@/src/components/ui/button';

interface LabourFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  professionFilter: string;
  onProfessionChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  cityFilter: string;
  onCityChange: (value: string) => void;
  availableCities: string[];
  onReset: () => void;
}

export function LabourFilters({
  searchQuery,
  onSearchChange,
  professionFilter,
  onProfessionChange,
  statusFilter,
  onStatusChange,
  cityFilter,
  onCityChange,
  availableCities,
  onReset
}: LabourFiltersProps) {
  const professionOptions = [
    { value: 'all', label: 'All Professions' },
    { value: 'prof-mason', label: 'Mason' },
    { value: 'prof-electrician', label: 'Electrician' },
    { value: 'prof-plumber', label: 'Plumber' },
    { value: 'prof-carpenter', label: 'Carpenter' },
    { value: 'prof-welder', label: 'Welder' },
    { value: 'prof-painter', label: 'Painter' },
    { value: 'prof-steel-fixer', label: 'Steel Fixer' },
    { value: 'prof-tile-worker', label: 'Tile Worker' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' }
  ];

  const cityOptions = [
    { value: 'all', label: 'All Cities' },
    ...availableCities.map(city => ({ value: city, label: city }))
  ];

  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6">
      <div className="flex-1 min-w-[200px] relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-4 w-4 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <Input 
          className="pl-9 w-full"
          placeholder="Search labour..." 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="w-full sm:w-40">
        <Select 
          options={professionOptions}
          value={professionFilter}
          onChange={onProfessionChange}
        />
      </div>
      <div className="w-full sm:w-40">
        <Select 
          options={statusOptions}
          value={statusFilter}
          onChange={onStatusChange}
        />
      </div>
      <div className="w-full sm:w-40">
        <Select 
          options={cityOptions}
          value={cityFilter}
          onChange={onCityChange}
        />
      </div>
      <Button variant="outline" onClick={onReset} className="w-full sm:w-auto shrink-0">
        Reset
      </Button>
    </div>
  );
}
