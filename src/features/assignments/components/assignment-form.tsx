'use client';

import React, { useState, useMemo } from 'react';
import { Assignment } from '../types/assignment.types';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import { Select } from '@/src/components/ui/select';
import { MultiSelect } from '@/src/components/ui/multi-select';
import { FormField } from '@/src/components/ui/form-field';
import { mockProjects } from '@/src/features/projects/data/projects.mock';
import { mockContractors } from '@/src/features/contractors/data/contractors.mock';
import { mockAssignments } from '@/src/features/assignments/data/assignments.mock';
import { RESPONSIBILITY_OPTIONS } from '../data/assignment-options';

interface AssignmentFormProps {
  mode?: 'create' | 'edit';
  initialData?: Assignment;
}

export function AssignmentForm({ mode = 'create', initialData }: AssignmentFormProps) {
  const router = useRouter();

  // Assignment section
  const [projectId, setProjectId] = useState(initialData?.projectId || '');
  const [contractorId, setContractorId] = useState(initialData?.contractorId || '');

  // Responsibilities
  const [responsibilityIds, setResponsibilityIds] = useState<string[]>(initialData?.responsibilityIds || []);

  // Dates
  const [startDate, setStartDate] = useState(initialData?.startDate || '');
  const [endDate, setEndDate] = useState(initialData?.endDate || '');

  // Work Details
  const [scope, setScope] = useState(initialData?.scope || '');
  const [notes, setNotes] = useState(initialData?.notes || '');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Derived Options
  const projectOptions = useMemo(() => {
    return mockProjects
      .filter((p) => p.status === 'Planning' || p.status === 'Active')
      .map((p) => ({
        value: p.id,
        label: `${p.name} (${p.projectCode})`,
      }));
  }, []);

  const contractorOptions = useMemo(() => {
    return mockContractors
      .filter((c) => c.status === 'Active')
      .map((c) => ({
        value: c.id,
        label: `${c.companyName} (${c.contractorCode})`,
      }));
  }, []);

  const responsibilityMultiSelectOptions = RESPONSIBILITY_OPTIONS.map((r) => ({
    value: r.id,
    label: r.name,
  }));

  // Duplicate Check (only in create mode)
  const duplicateError = useMemo(() => {
    if (mode === 'edit') return null;
    if (!projectId || !contractorId) return null;
    const exists = mockAssignments.some(
      (a) => a.projectId === projectId && a.contractorId === contractorId
    );
    if (exists) {
      return 'This contractor is already assigned to this project.';
    }
    return null;
  }, [projectId, contractorId, mode]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!projectId) newErrors.projectId = 'Project is required.';
    if (!contractorId) newErrors.contractorId = 'Contractor is required.';
    if (!startDate) newErrors.startDate = 'Start date is required.';
    if (!endDate) newErrors.endDate = 'End date is required.';

    if (startDate && endDate) {
      if (new Date(endDate) < new Date(startDate)) {
        newErrors.endDate = 'End date must be on or after the start date.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && !duplicateError;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || duplicateError) return;

    setIsSubmitting(true);

    // Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    let payload;
    if (mode === 'create') {
      payload = {
        projectId,
        contractorId,
        responsibilityIds,
        scope: scope.trim() || null,
        startDate,
        endDate,
        notes: notes.trim() || null,
      };
    } else {
      payload = {
        responsibilityIds,
        scope: scope.trim() || null,
        startDate,
        endDate,
        notes: notes.trim() || null,
      };
    }

    console.log(`Submitted Assignment Payload (${mode}):`, payload);

    if (mode === 'edit' && initialData) {
      router.push(`/assignments/${initialData.id}`);
    } else {
      router.push('/assignments');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full min-w-0">
      
      {/* Section 1: Assignment */}
      <Card className="overflow-visible">
        <CardHeader>
          <CardTitle>Assignment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Project" required error={errors.projectId}>
              {mode === 'edit' && initialData ? (
                <div className="flex flex-col h-10 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-md text-[14px]">
                  <span className="font-medium text-neutral-900 truncate">{initialData.projectName}</span>
                  <span className="text-[12px] text-neutral-500 font-mono mt-0.5">{initialData.projectCode}</span>
                </div>
              ) : (
                <Select
                  options={[{ value: '', label: 'Select a project' }, ...projectOptions]}
                  value={projectId}
                  onChange={setProjectId}
                />
              )}
            </FormField>

            <FormField label="Contractor" required error={errors.contractorId}>
              {mode === 'edit' && initialData ? (
                <div className="flex flex-col h-10 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-md text-[14px]">
                  <span className="font-medium text-neutral-900 truncate">{initialData.contractorName}</span>
                  <span className="text-[12px] text-neutral-500 font-mono mt-0.5">{initialData.contractorCode}</span>
                </div>
              ) : (
                <Select
                  options={[{ value: '', label: 'Select a contractor' }, ...contractorOptions]}
                  value={contractorId}
                  onChange={setContractorId}
                />
              )}
            </FormField>
          </div>
          
          {duplicateError && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">
              {duplicateError}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 2: Responsibilities */}
      <Card className="overflow-visible">
        <CardHeader>
          <CardTitle>Responsibilities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Responsibilities">
              <MultiSelect
                options={responsibilityMultiSelectOptions}
                value={responsibilityIds}
                onChange={setResponsibilityIds}
                placeholder="Select responsibilities"
              />
            </FormField>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Assignment Period */}
      <Card>
        <CardHeader>
          <CardTitle>Assignment Period</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Start Date" required error={errors.startDate}>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </FormField>

            <FormField label="End Date" required error={errors.endDate}>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || undefined}
              />
            </FormField>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Work Details */}
      <Card>
        <CardHeader>
          <CardTitle>Work Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <FormField label="Scope">
                <Textarea
                  placeholder="Describe the contractor's scope of work..."
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                  rows={4}
                />
              </FormField>
            </div>

            <div className="md:col-span-2">
              <FormField label="Notes">
                <Textarea
                  placeholder="Add any additional assignment notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </FormField>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (mode === 'edit' && initialData) {
                router.push(`/assignments/${initialData.id}`);
              } else {
                router.push('/assignments');
              }
            }}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={!!duplicateError}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Save Changes' : 'Assign Contractor'}
          </Button>
        </div>
        {mode === 'create' && (
          <p className="text-center sm:text-right text-[13px] text-neutral-500">
            New contractor assignments are created with Pending status.
          </p>
        )}
      </div>

    </form>
  );
}
