import React from 'react';
import { Input } from '@/src/components/ui/input';
import { Select } from '@/src/components/ui/select';
import { Button } from '@/src/components/ui/button';
import { Search } from '@/src/components/ui/icons';
import { Assignment, AssignmentStatus } from '../types/assignment.types';

interface AssignmentFiltersProps {
  assignments: Assignment[];
  searchTerm: string;
  onSearchChange: (val: string) => void;
  statusFilter: AssignmentStatus | '';
  onStatusChange: (val: AssignmentStatus | '') => void;
  projectFilter: string;
  onProjectChange: (val: string) => void;
  contractorFilter: string;
  onContractorChange: (val: string) => void;
  onReset: () => void;
}

export function AssignmentFilters({
  assignments,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  projectFilter,
  onProjectChange,
  contractorFilter,
  onContractorChange,
  onReset,
}: AssignmentFiltersProps) {
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'ON_HOLD', label: 'On Hold' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'TERMINATED', label: 'Terminated' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

  const uniqueProjects = Array.from(new Set(assignments.map(a => a.projectId)))
    .map(id => {
      const assignment = assignments.find(a => a.projectId === id);
      return {
        value: id,
        label: assignment ? `${assignment.projectName} (${assignment.projectCode})` : id,
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label));

  const projectOptions = [{ value: '', label: 'All Projects' }, ...uniqueProjects];

  const uniqueContractors = Array.from(new Set(assignments.map(a => a.contractorId)))
    .map(id => {
      const assignment = assignments.find(a => a.contractorId === id);
      return {
        value: id,
        label: assignment ? `${assignment.contractorName} (${assignment.contractorCode})` : id,
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label));

  const contractorOptions = [{ value: '', label: 'All Contractors' }, ...uniqueContractors];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-neutral-400" />
          </div>
          <Input
            type="text"
            placeholder="Search project or contractor..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 w-full"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={(val) => onStatusChange(val as AssignmentStatus | '')}
          />
          <Select
            options={projectOptions}
            value={projectFilter}
            onChange={onProjectChange}
          />
          <Select
            options={contractorOptions}
            value={contractorFilter}
            onChange={onContractorChange}
          />
          <Button variant="outline" onClick={onReset} className="whitespace-nowrap">
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
