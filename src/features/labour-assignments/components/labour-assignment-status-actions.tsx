'use client';

import React, { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { ConfirmationDialog } from '@/src/components/ui/confirmation-dialog';
import { LabourAssignment } from '../types/labour-assignment.types';

type LabourAssignmentStatus = LabourAssignment['status'];

interface LabourAssignmentStatusActionsProps {
  status: LabourAssignmentStatus;
  onStatusChange: (newStatus: LabourAssignmentStatus) => void;
}

type ActionConfig = {
  id: string;
  label: string;
  targetStatus: LabourAssignmentStatus;
  variant: 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost';
  dialogTitle: string;
  dialogMessage: string;
  confirmLabel: string;
  cancelLabel?: string;
};

const ACTIONS: Record<string, ActionConfig> = {
  COMPLETE: {
    id: 'COMPLETE',
    label: 'Mark as Completed',
    targetStatus: 'COMPLETED',
    variant: 'outline',
    dialogTitle: 'Mark Assignment as Completed?',
    dialogMessage: 'This will mark the labour assignment as completed. The assignment will remain available as historical project data, but no further lifecycle changes will be allowed.',
    confirmLabel: 'Mark as Completed',
    cancelLabel: 'Cancel',
  },
  CANCEL: {
    id: 'CANCEL',
    label: 'Cancel Assignment',
    targetStatus: 'CANCELLED',
    variant: 'destructive',
    dialogTitle: 'Cancel Labour Assignment?',
    dialogMessage: 'This will cancel the labour assignment. The assignment will remain available as historical project data, but no further lifecycle changes will be allowed.',
    confirmLabel: 'Cancel Assignment',
    cancelLabel: 'Keep Assignment',
  },
};

export function LabourAssignmentStatusActions({ status, onStatusChange }: LabourAssignmentStatusActionsProps) {
  const [selectedAction, setSelectedAction] = useState<ActionConfig | null>(null);

  const getAvailableActions = (): ActionConfig[] => {
    switch (status) {
      case 'ACTIVE':
        return [ACTIONS.COMPLETE, ACTIONS.CANCEL];
      case 'COMPLETED':
      case 'CANCELLED':
      default:
        return [];
    }
  };

  const availableActions = getAvailableActions();

  const handleConfirm = async () => {
    if (!selectedAction) return;

    if (status !== 'ACTIVE') {
      setSelectedAction(null);
      return;
    }

    // Simulate API request processing
    await new Promise((resolve) => setTimeout(resolve, 800));

    console.log(`Submitted Labour Assignment Status Update Payload:`, { status: selectedAction.targetStatus });

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
        cancelLabel={selectedAction?.cancelLabel || 'Cancel'}
        variant={selectedAction?.variant === 'destructive' ? 'destructive' : 'primary'}
      />
    </>
  );
}
