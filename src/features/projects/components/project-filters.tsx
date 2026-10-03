import React from 'react';
import { Input } from '@/src/components/ui/input';
import { Select } from '@/src/components/ui/select';
import { Button } from '@/src/components/ui/button';
import { Search } from '@/src/components/ui/icons';
import { ProjectStatus } from '../types/project.types';
import { mockProjects } from '../data/projects.mock';

interface ProjectFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: ProjectStatus | 'ALL';
  onStatusFilterChange: (value: ProjectStatus | 'ALL') => void;
  customerFilter: string;
  onCustomerFilterChange: (value: string) => void;
  onReset: () => void;
}

const statusOptions = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'Planning', label: 'Planning' },
  { value: 'Active', label: 'Active' },
  { value: 'Completed', label: 'Completed' },
  { value: 'On Hold', label: 'On Hold' },
];

export function ProjectFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  customerFilter,
  onCustomerFilterChange,
  onReset
}: ProjectFiltersProps) {
  // Extract unique customers
  const uniqueCustomers = Array.from(new Set(mockProjects.map(p => p.customerName))).map(name => ({
    value: name,
    label: name
  }));

  const customerOptions = [
    { value: 'ALL', label: 'All Customers' },
    ...uniqueCustomers.sort((a, b) => a.label.localeCompare(b.label))
  ];

  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6 items-start w-full">
      <div className="flex-1 min-w-[200px] relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-neutral-400" />
        </div>
        <Input 
          className="pl-9 w-full"
          placeholder="Search projects..." 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="w-full sm:w-48 shrink-0">
        <Select
          options={statusOptions}
          value={statusFilter}
          onChange={(val) => onStatusFilterChange(val as ProjectStatus | 'ALL')}
        />
      </div>
      <div className="w-full sm:w-48 shrink-0">
        <Select
          options={customerOptions}
          value={customerFilter}
          onChange={(val) => onCustomerFilterChange(val)}
        />
      </div>
      <div className="shrink-0">
        <Button variant="outline" onClick={onReset} className="w-full sm:w-auto shrink-0">
          Reset
        </Button>
      </div>
    </div>
  );
}
