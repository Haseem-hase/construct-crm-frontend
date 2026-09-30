'use client';

import React, { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { ConfirmationDialog } from '@/src/components/ui/confirmation-dialog';
import { Assignment } from '../types/assignment.types';

type AssignmentStatus = Assignment['status'];

interface AssignmentStatusActionsProps {
  status: AssignmentStatus;
  onStatusChange: (newStatus: AssignmentStatus) => void;
}

type ActionConfig = {
  id: string;
  label: string;
  targetStatus: AssignmentStatus;
  variant: 'primary' | 'secondary' | 'destructive' | 'outline';
  dialogTitle: string;
  dialogMessage: string;
  confirmLabel: string;
};

const ACTIONS: Record<string, ActionConfig> = {
  ACTIVATE: {
    id: 'ACTIVATE',
    label: 'Activate Assignment',
    targetStatus: 'ACTIVE',
    variant: 'primary',
    dialogTitle: 'Activate Assignment',
    dialogMessage: 'Are you sure you want to activate this contractor assignment?',
    confirmLabel: 'Activate Assignment',
  },
  CANCEL: {
    id: 'CANCEL',
    label: 'Cancel Assignment',
    targetStatus: 'CANCELLED',
    variant: 'destructive',
    dialogTitle: 'Cancel Assignment',
    dialogMessage: 'Are you sure you want to cancel this contractor assignment? This action cannot be undone.',
    confirmLabel: 'Cancel Assignment',
  },
  PUT_ON_HOLD: {
    id: 'PUT_ON_HOLD',
    label: 'Put On Hold',
    targetStatus: 'ON_HOLD',
    variant: 'outline',
    dialogTitle: 'Put Assignment On Hold',
    dialogMessage: 'Are you sure you want to put this contractor assignment on hold?',
    confirmLabel: 'Put On Hold',
  },
  COMPLETE: {
    id: 'COMPLETE',
    label: 'Complete Assignment',
    targetStatus: 'COMPLETED',
    variant: 'outline',
    dialogTitle: 'Complete Assignment',
    dialogMessage: 'Are you sure you want to mark this contractor assignment as completed?',
    confirmLabel: 'Complete Assignment',
  },
  TERMINATE: {
    id: 'TERMINATE',
    label: 'Terminate Assignment',
    targetStatus: 'TERMINATED',
    variant: 'destructive',
    dialogTitle: 'Terminate Assignment',
    dialogMessage: 'Are you sure you want to terminate this contractor assignment? This action cannot be undone.',
    confirmLabel: 'Terminate Assignment',
  },
  RESUME: {
    id: 'RESUME',
    label: 'Resume Assignment',
    targetStatus: 'ACTIVE',
    variant: 'primary',
    dialogTitle: 'Resume Assignment',
    dialogMessage: 'Are you sure you want to resume this contractor assignment?',
    confirmLabel: 'Resume Assignment',
  },
};

export function AssignmentStatusActions({ status, onStatusChange }: AssignmentStatusActionsProps) {
  const [selectedAction, setSelectedAction] = useState<ActionConfig | null>(null);

  const getAvailableActions = (): ActionConfig[] => {
    switch (status) {
      case 'PENDING':
        return [ACTIONS.ACTIVATE, ACTIONS.CANCEL];
      case 'ACTIVE':
        return [ACTIONS.PUT_ON_HOLD, ACTIONS.COMPLETE, ACTIONS.TERMINATE];
      case 'ON_HOLD':
        return [ACTIONS.RESUME];
      case 'COMPLETED':
      case 'TERMINATED':
      case 'CANCELLED':
      default:
        return [];
    }
  };

  const availableActions = getAvailableActions();

  const handleConfirm = async () => {
    if (!selectedAction) return;

    // Simulate API request processing
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Execute state update
    onStatusChange(selectedAction.targetStatus);
    setSelectedAction(null);
  };

  if (availableActions.length === 0) {
    return null;
  }

  return (
    <>
      {availableActions.map((action) => (
        <Button
          key={action.id}
          variant={action.variant}
          onClick={() => setSelectedAction(action)}
          className="w-full sm:w-auto"
        >
          {action.label}
        </Button>
      ))}

      <ConfirmationDialog
        open={selectedAction !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedAction(null);
        }}
        onConfirm={handleConfirm}
        title={selectedAction?.dialogTitle || ''}
        description={selectedAction?.dialogMessage || ''}
        confirmLabel={selectedAction?.confirmLabel || 'Confirm'}
        cancelLabel="Cancel"
        variant={selectedAction?.variant === 'destructive' ? 'destructive' : 'primary'}
      />
    </>
  );
}
