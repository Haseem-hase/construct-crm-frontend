'use client';

import React, { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { ConfirmationDialog } from '@/src/components/ui/confirmation-dialog';
import { ApiContractorStatus } from '../types/contractor.types';

interface ContractorStatusActionsProps {
  status: ApiContractorStatus;
  isUpdating?: boolean;
  onStatusChange: (newStatus: ApiContractorStatus) => void | Promise<void>;
}

interface ActionConfig {
  status: ApiContractorStatus;
  label: string;
  variant: 'primary' | 'secondary' | 'destructive' | 'outline';
  dialogTitle: string;
  dialogDescription: string;
  confirmLabel: string;
}

const STATUS_CONFIGS: Record<ApiContractorStatus, { label: string; variant: 'primary' | 'secondary' | 'destructive' | 'outline' }> = {
  ACTIVE: { label: 'Activate', variant: 'primary' },
  PENDING: { label: 'Set to Pending', variant: 'outline' },
  SUSPENDED: { label: 'Suspend', variant: 'destructive' },
  INACTIVE: { label: 'Deactivate', variant: 'outline' },
  TERMINATED: { label: 'Terminate', variant: 'destructive' },
};

export function ContractorStatusActions({
  status,
  isUpdating = false,
  onStatusChange,
}: ContractorStatusActionsProps) {
  const [pendingStatus, setPendingStatus] = useState<ApiContractorStatus | null>(null);

  // Available target statuses (all statuses except current)
  const availableStatuses: ApiContractorStatus[] = (
    ['ACTIVE', 'PENDING', 'SUSPENDED', 'INACTIVE', 'TERMINATED'] as ApiContractorStatus[]
  ).filter((s) => s !== status);

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

  const handleActionClick = (target: ApiContractorStatus) => {
    if (isUpdating) return;
    setPendingStatus(target);
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
      <div className="flex flex-wrap items-center gap-2">
        {availableStatuses.map((s) => {
          const cfg = STATUS_CONFIGS[s];
          return (
            <Button
              key={s}
              variant={cfg.variant}
              disabled={isUpdating}
              onClick={() => handleActionClick(s)}
              className="w-full sm:w-auto"
            >
              {cfg.label}
            </Button>
          );
        })}
      </div>

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

