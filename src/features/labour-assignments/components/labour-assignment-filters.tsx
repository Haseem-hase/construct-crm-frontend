import React from 'react';
import { Input } from '@/src/components/ui/input';
import { Select } from '@/src/components/ui/select';
import { Button } from '@/src/components/ui/button';
import { Search } from '@/src/components/ui/icons';
import { LabourAssignment, LabourAssignmentStatus } from '../types/labour-assignment.types';

interface LabourAssignmentFiltersProps {
  assignments: LabourAssignment[];
  searchTerm: string;
  onSearchChange: (val: string) => void;
  labourFilter: string;
  onLabourChange: (val: string) => void;
  professionFilter: string;
  onProfessionChange: (val: string) => void;
  contractorFilter: string;
  onContractorChange: (val: string) => void;
  projectFilter: string;
  onProjectChange: (val: string) => void;
  statusFilter: LabourAssignmentStatus | '';
  onStatusChange: (val: LabourAssignmentStatus | '') => void;
  onReset: () => void;
}

export function LabourAssignmentFilters({
  assignments,
  searchTerm,
  onSearchChange,
  labourFilter,
  onLabourChange,
  professionFilter,
  onProfessionChange,
  contractorFilter,
  onContractorChange,
  projectFilter,
  onProjectChange,
  statusFilter,
  onStatusChange,
  onReset,
}: LabourAssignmentFiltersProps) {
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

  const uniqueLabours = Array.from(new Set(assignments.map(a => a.labourId)))
    .map(id => {
      const assignment = assignments.find(a => a.labourId === id);
      return {
        value: id,
        label: assignment ? assignment.labourName : id,
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label));

  const labourOptions = [{ value: '', label: 'All Labours' }, ...uniqueLabours];

  const uniqueProfessions = Array.from(new Set(assignments.map(a => a.professionName)))
    .map(name => ({
      value: name,
      label: name,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const professionOptions = [{ value: '', label: 'All Professions' }, ...uniqueProfessions];

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

  return (
    <div className="flex flex-col lg:flex-row flex-wrap gap-4 mb-6 items-start w-full">
      <div className="flex-1 min-w-[200px] relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-neutral-400" />
        </div>
          <Input
            type="text"
            placeholder="Search labour, contractor, or project..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 w-full"
          />
        </div>

      <div className="w-full sm:w-40 lg:w-48 shrink-0">
        <Select
          options={labourOptions}
          value={labourFilter}
          onChange={onLabourChange}
        />
      </div>
      <div className="w-full sm:w-40 lg:w-48 shrink-0">
        <Select
          options={professionOptions}
          value={professionFilter}
          onChange={onProfessionChange}
        />
      </div>
      <div className="w-full sm:w-40 lg:w-48 shrink-0">
        <Select
          options={contractorOptions}
          value={contractorFilter}
          onChange={onContractorChange}
        />
      </div>
      <div className="w-full sm:w-40 lg:w-48 shrink-0">
        <Select
          options={projectOptions}
          value={projectFilter}
          onChange={onProjectChange}
        />
      </div>
      <div className="w-full sm:w-40 lg:w-48 shrink-0">
        <Select
          options={statusOptions}
          value={statusFilter}
          onChange={(val) => onStatusChange(val as LabourAssignmentStatus | '')}
        />
      </div>
      <Button variant="outline" onClick={onReset} className="w-full sm:w-auto shrink-0 whitespace-nowrap">
        Reset
      </Button>
    </div>
  );
}
