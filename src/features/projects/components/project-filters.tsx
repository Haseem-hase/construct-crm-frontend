import React from 'react';
import { Input } from '@/src/components/ui/input';
import { Select } from '@/src/components/ui/select';
import { Button } from '@/src/components/ui/button';
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
    <div className="flex flex-col sm:flex-row gap-3 mb-6 w-full">
      <div className="sm:w-80 shrink-0">
        <Input 
          placeholder="Search projects..." 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="sm:w-48 shrink-0">
        <Select
          options={statusOptions}
          value={statusFilter}
          onChange={(val) => onStatusFilterChange(val as ProjectStatus | 'ALL')}
        />
      </div>
      <div className="sm:w-64 shrink-0">
        <Select
          options={customerOptions}
          value={customerFilter}
          onChange={(val) => onCustomerFilterChange(val)}
        />
      </div>
      <div className="shrink-0">
        <Button variant="ghost" onClick={onReset} className="text-neutral-500">
          Reset
        </Button>
      </div>
    </div>
  );
}
