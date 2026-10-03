import React from 'react';
import { Input } from '@/src/components/ui/input';
import { Select } from '@/src/components/ui/select';
import { Button } from '@/src/components/ui/button';
import { Search } from '@/src/components/ui/icons';

interface ContractorFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  cityFilter: string;
  onCityChange: (value: string) => void;
  availableCities: string[];
  onReset: () => void;
}

export function ContractorFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  cityFilter,
  onCityChange,
  availableCities,
  onReset
}: ContractorFiltersProps) {
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' }
  ];

  const cityOptions = [
    { value: 'all', label: 'All Cities' },
    ...availableCities.map(city => ({ value: city, label: city }))
  ];

  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6 items-start">
      <div className="flex-1 min-w-[200px] relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-neutral-400" />
        </div>
        <Input 
          className="pl-9 w-full"
          placeholder="Search contractors..." 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="w-full sm:w-48 shrink-0">
        <Select 
          options={statusOptions}
          value={statusFilter}
          onChange={onStatusChange}
        />
      </div>
      <div className="w-full sm:w-48 shrink-0">
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
