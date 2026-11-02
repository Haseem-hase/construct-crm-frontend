'use client';

import React, { useState } from 'react';
import { Select } from '@/src/components/ui/select';
import { ConfirmationDialog } from '@/src/components/ui/confirmation-dialog';
import { ApiContractorStatus } from '../types/contractor.types';

interface ContractorStatusActionsProps {
  status: ApiContractorStatus;
  isUpdating?: boolean;
  onStatusChange: (newStatus: ApiContractorStatus) => void | Promise<void>;
}

const STATUS_OPTIONS: Array<{ value: ApiContractorStatus; label: string }> = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'SUSPENDED', label: 'Suspended' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'TERMINATED', label: 'Terminated' },
];

export function ContractorStatusActions({
  status,
  isUpdating = false,
  onStatusChange,
}: ContractorStatusActionsProps) {
  const [pendingStatus, setPendingStatus] = useState<ApiContractorStatus | null>(null);

  const getDialogDetails = (target: ApiContractorStatus): {
    title: string;
    description: string;
    confirmLabel: string;
    variant: 'primary' | 'destructive' | 'default';
  } => {
    switch (target) {
      case 'ACTIVE':
        return {
          title: 'Activate Contractor?',
          description: 'Are you sure you want to activate this contractor? They will be marked as eligible for active project assignments.',
          confirmLabel: 'Activate Contractor',
          variant: 'primary',
        };
      case 'SUSPENDED':
        return {
          title: 'Suspend Contractor?',
          description: 'Are you sure you want to suspend this contractor? Active operations or assignments may be temporarily paused.',
          confirmLabel: 'Suspend Contractor',
          variant: 'destructive',
        };
      case 'TERMINATED':
        return {
          title: 'Terminate Contractor?',
          description: 'Are you sure you want to terminate this contractor? This is a significant status change indicating the relationship has ended.',
          confirmLabel: 'Terminate Contractor',
          variant: 'destructive',
        };
      case 'INACTIVE':
        return {
          title: 'Deactivate Contractor?',
          description: 'Are you sure you want to set this contractor to inactive?',
          confirmLabel: 'Deactivate Contractor',
          variant: 'destructive',
        };
      case 'PENDING':
        return {
          title: 'Set Contractor to Pending?',
          description: 'Are you sure you want to return this contractor to pending verification status?',
          confirmLabel: 'Set to Pending',
          variant: 'default',
        };
    }
  };

  const handleSelectStatus = (value: string) => {
    const target = value as ApiContractorStatus;
    if (!isUpdating && target !== status && STATUS_OPTIONS.some(option => option.value === target)) {
      setPendingStatus(target);
    }
  };

  const handleConfirm = async () => {
    if (!pendingStatus || isUpdating) return;
    const target = pendingStatus;
    setPendingStatus(null);
    await onStatusChange(target);
  };

  const dialogDetails = pendingStatus ? getDialogDetails(pendingStatus) : null;

  return (
    <>
      <Select
        aria-label="Contractor status"
        value={status}
        options={STATUS_OPTIONS}
        onChange={handleSelectStatus}
        disabled={isUpdating}
        fullWidth={false}
        className="w-[190px]"
      />

      <ConfirmationDialog
        open={pendingStatus !== null}
        onOpenChange={(open) => {
          if (!open) setPendingStatus(null);
        }}
        onConfirm={handleConfirm}
        title={dialogDetails?.title || 'Change Status?'}
        description={dialogDetails?.description || 'Are you sure you want to change this contractor status?'}
        confirmLabel={dialogDetails?.confirmLabel || 'Confirm'}
        cancelLabel="Cancel"
        variant={dialogDetails?.variant || 'primary'}
      />
    </>
  );
}

