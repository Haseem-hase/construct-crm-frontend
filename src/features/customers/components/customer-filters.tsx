import React from 'react';
import { Input } from '@/src/components/ui/input';
import { Select } from '@/src/components/ui/select';
import { Button } from '@/src/components/ui/button';
import { Search } from '@/src/components/ui/icons';
import { CustomerType, CustomerStatus } from '../types/customer.types';

export interface CustomerFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  typeFilter: CustomerType | 'ALL';
  onTypeFilterChange: (value: CustomerType | 'ALL') => void;
  statusFilter: CustomerStatus | 'ALL';
  onStatusFilterChange: (value: CustomerStatus | 'ALL') => void;
  onReset: () => void;
}

export function CustomerFilters({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  statusFilter,
  onStatusFilterChange,
  onReset
}: CustomerFiltersProps) {
  const typeOptions = [
    { value: 'ALL', label: 'All Types' },
    { value: 'COMPANY', label: 'Company' },
    { value: 'GOVERNMENT', label: 'Government' },
    { value: 'INDIVIDUAL', label: 'Individual' },
    { value: 'OTHER', label: 'Other' },
  ];

  const statusOptions = [
    { value: 'ALL', label: 'All Statuses' },
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
  ];

  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6 items-start">
      <div className="flex-1 min-w-[200px] relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-neutral-400" />
        </div>
        <Input 
          type="search"
          placeholder="Search customers..." 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search customers"
          className="pl-9 w-full"
        />
      </div>
      <div className="w-full sm:w-48 shrink-0">
        <Select 
          value={typeFilter} 
          onChange={(val) => onTypeFilterChange(val as CustomerType | 'ALL')}
          options={typeOptions}
          aria-label="Filter by customer type"
        />
      </div>
      <div className="w-full sm:w-48 shrink-0">
        <Select 
          value={statusFilter} 
          onChange={(val) => onStatusFilterChange(val as CustomerStatus | 'ALL')}
          options={statusOptions}
          aria-label="Filter by status"
        />
      </div>
      <Button variant="outline" onClick={onReset} className="w-full sm:w-auto shrink-0">
        Reset
      </Button>
    </div>
  );
}
