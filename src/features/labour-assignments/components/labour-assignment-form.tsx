'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import { Select } from '@/src/components/ui/select';
import { FormField } from '@/src/components/ui/form-field';
import { labourApi, ApiLabour } from '@/src/features/labour/api/labour.api';
import { assignmentsApi, ApiContractorAssignment } from '@/src/features/assignments/api/assignments.api';
import { labourAssignmentsApi, ApiLabourAssignment } from '../api/labour-assignments.api';
import { LabourAssignment } from '../types/labour-assignment.types';

interface LabourAssignmentFormProps {
  mode?: 'create' | 'edit';
  initialData?: LabourAssignment;
}

export function LabourAssignmentForm({ mode = 'create', initialData }: LabourAssignmentFormProps) {
  const router = useRouter();

  // Assignment section
  const [labourId, setLabourId] = useState(initialData?.labourId || '');
  const [contractorProjectAssignmentId, setContractorProjectAssignmentId] = useState(initialData?.contractorProjectAssignmentId || '');

  // Assignment Period
  const [startDate, setStartDate] = useState(initialData?.startDate || '');
  const [endDate, setEndDate] = useState(initialData?.endDate || '');

  // Work Details
  const [notes, setNotes] = useState(initialData?.notes || '');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [labours, setLabours] = useState<ApiLabour[]>([]);
  const [parentAssignments, setParentAssignments] = useState<ApiContractorAssignment[]>([]);
  const [existingAssignments, setExistingAssignments] = useState<ApiLabourAssignment[]>([]);
  const [formError, setFormError] = useState('');
  useEffect(() => { Promise.all([labourApi.list(), assignmentsApi.list(), labourAssignmentsApi.list()]).then(([l, a, la]) => { setLabours(l); setParentAssignments(a); setExistingAssignments(la); }).catch((error: any) => setFormError(error?.response?.data?.message || 'Unable to load assignment options.')); }, []);

  // Derived Options
  const labourOptions = useMemo(() => {
    return labours
      .filter((l) => l.status === 'ACTIVE')
      .map((l) => ({
        value: l.id,
        label: `${l.fullName} · ${l.profession.name}`,
      }));
  }, [labours]);

  const assignmentOptions = useMemo(() => {
    return parentAssignments
      .filter((a) => a.status === 'ACTIVE')
      .map((a) => ({
        value: a.id,
        label: `${a.contractor.contractorCode} ${a.contractor.fullName} | ${a.project.projectCode} ${a.project.name}`,
      }));
  }, [parentAssignments]);

  const selectedParentAssignment = useMemo(() => {
    return parentAssignments.find((a) => a.id === contractorProjectAssignmentId);
  }, [contractorProjectAssignmentId, parentAssignments]);

  // Overlap Check
  const overlapError = useMemo(() => {
    if (!labourId || !startDate || !endDate) return null;
    
    const start = new Date(startDate);
    const end = new Date(endDate);

    const existing = existingAssignments.filter(
      (la) => la.labourId === labourId && la.id !== initialData?.id
    );

    const hasOverlap = existing.some((la) => {
      if (!la.startDate || !la.endDate) return false;
      const exStart = new Date(la.startDate);
      const exEnd = new Date(la.endDate);
      return exStart <= end && exEnd >= start;
    });

    if (hasOverlap) {
      return 'This labour already has an assignment during the selected period.';
    }
    return null;
  }, [labourId, startDate, endDate, initialData?.id, existingAssignments]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!labourId) newErrors.labourId = 'Labour is required.';
    if (!contractorProjectAssignmentId) newErrors.contractorProjectAssignmentId = 'Contractor Project Assignment is required.';
    if (!startDate) newErrors.startDate = 'Start date is required.';
    if (!endDate) newErrors.endDate = 'End date is required.';

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end < start) {
        newErrors.endDate = 'End date must be on or after the start date.';
      }
      
      // Parent Assignment Date boundaries check
      if (selectedParentAssignment) {
        if (selectedParentAssignment.startDate) {
          const parentStart = new Date(selectedParentAssignment.startDate);
          if (start < parentStart) {
            newErrors.startDate = `Start date cannot be before parent assignment start date (${selectedParentAssignment.startDate}).`;
          }
        }
        if (selectedParentAssignment.endDate) {
          const parentEnd = new Date(selectedParentAssignment.endDate);
          if (end > parentEnd) {
            newErrors.endDate = `End date cannot be after parent assignment end date (${selectedParentAssignment.endDate}).`;
          }
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && !overlapError;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || overlapError) return;

    setIsSubmitting(true);

    setIsSubmitting(true); setFormError('');
    try {
    const payload = { startDate: new Date(startDate).toISOString(), endDate: new Date(endDate).toISOString(), notes: notes.trim() || undefined };
    if (mode === 'edit' && initialData) await labourAssignmentsApi.update(initialData.id, payload);
    else await labourAssignmentsApi.create({ ...payload, labourId, contractorProjectAssignmentId });

    if (mode === 'edit' && initialData) {
      router.push(`/labour-assignments/${initialData.id}`);
    } else {
      router.push('/labour-assignments');
    }
    } catch (error: any) { setFormError(error?.response?.data?.message || 'Unable to save labour assignment. Please try again.'); }
    finally { setIsSubmitting(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full min-w-0">
      {formError && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{formError}</div>}
      
      {/* Section 1: Assignment */}
      <Card className="overflow-visible">
        <CardHeader>
          <CardTitle>Assignment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Labour" required error={errors.labourId}>
              {mode === 'edit' && initialData ? (
                <div className="flex flex-col h-auto min-h-10 justify-center px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-md text-[14px]">
                  <span className="font-medium text-neutral-900 truncate">{initialData.labourName}</span>
                  <span className="text-[12px] text-neutral-500 font-mono mt-0.5">{initialData.professionName}</span>
                </div>
              ) : (
                <Select
                  options={[{ value: '', label: 'Select active labour' }, ...labourOptions]}
                  value={labourId}
                  onChange={setLabourId}
                />
              )}
            </FormField>

            <FormField label="Contractor Project Assignment" required error={errors.contractorProjectAssignmentId}>
              {mode === 'edit' && initialData ? (
                <div className="flex flex-col h-auto min-h-10 justify-center px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-md text-[14px]">
                  <span className="font-medium text-neutral-900 truncate">{initialData.contractorName}</span>
                  <span className="text-[12px] text-neutral-500 font-mono mt-0.5">{initialData.projectName}</span>
                </div>
              ) : (
                <Select
                  options={[{ value: '', label: 'Select an existing assignment' }, ...assignmentOptions]}
                  value={contractorProjectAssignmentId}
                  onChange={setContractorProjectAssignmentId}
                />
              )}
            </FormField>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Assignment Period */}
      <Card>
        <CardHeader>
          <CardTitle>Assignment Period</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedParentAssignment && (selectedParentAssignment.startDate || selectedParentAssignment.endDate) && (
            <div className="mb-6 p-3 bg-neutral-50 text-neutral-600 text-[13px] rounded-md border border-neutral-200">
              <span className="font-medium text-neutral-900">Parent Assignment Period:</span>{' '}
              {selectedParentAssignment.startDate || 'No start date'} – {selectedParentAssignment.endDate || 'No end date'}
            </div>
          )}
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
          {overlapError && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">
              {overlapError}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 3: Work Details */}
      <Card>
        <CardHeader>
          <CardTitle>Work Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                router.push(`/labour-assignments/${initialData.id}`);
              } else {
                router.push('/labour-assignments');
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
            disabled={!!overlapError}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Save Changes' : 'Assign Labour'}
          </Button>
        </div>
        {mode === 'create' && (
          <p className="text-center sm:text-right text-[13px] text-neutral-500">
            New labour assignments are created with Active status.
          </p>
        )}
      </div>

    </form>
  );
}
