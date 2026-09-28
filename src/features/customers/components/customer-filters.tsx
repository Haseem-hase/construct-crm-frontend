import React from 'react';
import { Input } from '@/src/components/ui/input';
import { Select } from '@/src/components/ui/select';
import { Button } from '@/src/components/ui/button';
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
    <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto_auto_auto] gap-4 mb-6 items-start">
      <div className="min-w-0">
        <Input 
          type="search"
          placeholder="Search customers..." 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search customers"
        />
      </div>
      <div className="min-w-0 md:w-48">
        <Select 
          value={typeFilter} 
          onChange={(val) => onTypeFilterChange(val as CustomerType | 'ALL')}
          options={typeOptions}
          aria-label="Filter by customer type"
        />
      </div>
      <div className="min-w-0 md:w-48">
        <Select 
          value={statusFilter} 
          onChange={(val) => onStatusFilterChange(val as CustomerStatus | 'ALL')}
          options={statusOptions}
          aria-label="Filter by status"
        />
      </div>
      <Button variant="outline" onClick={onReset} className="w-full md:w-auto">
        Reset
      </Button>
    </div>
  );
}
