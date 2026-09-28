import React, { useState } from 'react';
import { ProjectStatus } from '../types/project.types';
import { Button } from '@/src/components/ui/button';
import { ConfirmationDialog } from '@/src/components/ui/confirmation-dialog';

interface ProjectStatusActionsProps {
  status: ProjectStatus;
  onStatusChange: (newStatus: ProjectStatus) => void;
}

type ActionType = 'Activate' | 'Put On Hold' | 'Mark Completed' | 'Resume' | null;

export function ProjectStatusActions({ status, onStatusChange }: ProjectStatusActionsProps) {
  const [pendingAction, setPendingAction] = useState<ActionType>(null);

  const getDialogConfig = () => {
    switch (pendingAction) {
      case 'Activate':
        return {
          title: 'Activate project?',
          description: 'Are you sure you want to activate this project?',
          confirmLabel: 'Activate Project',
          variant: 'primary' as const,
          nextStatus: 'Active' as ProjectStatus,
        };
      case 'Put On Hold':
        return {
          title: 'Put project on hold?',
          description: 'Are you sure you want to put this project on hold?',
          confirmLabel: 'Put On Hold',
          variant: 'destructive' as const,
          nextStatus: 'On Hold' as ProjectStatus,
        };
      case 'Mark Completed':
        return {
          title: 'Complete project?',
          description: 'Are you sure you want to mark this project as completed?',
          confirmLabel: 'Mark Completed',
          variant: 'destructive' as const,
          nextStatus: 'Completed' as ProjectStatus,
        };
      case 'Resume':
        return {
          title: 'Resume project?',
          description: 'Are you sure you want to resume this project?',
          confirmLabel: 'Resume Project',
          variant: 'primary' as const,
          nextStatus: 'Active' as ProjectStatus,
        };
      default:
        return null;
    }
  };

  const handleConfirm = () => {
    const config = getDialogConfig();
    if (config) {
      onStatusChange(config.nextStatus);
    }
    setPendingAction(null);
  };

  const dialogConfig = getDialogConfig();

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {status === 'Planning' && (
          <Button variant="primary" onClick={() => setPendingAction('Activate')}>
            Activate Project
          </Button>
        )}
        
        {status === 'Active' && (
          <>
            <Button variant="outline" onClick={() => setPendingAction('Put On Hold')}>
              Put On Hold
            </Button>
            <Button variant="destructive" onClick={() => setPendingAction('Mark Completed')}>
              Mark Completed
            </Button>
          </>
        )}

        {status === 'On Hold' && (
          <Button variant="primary" onClick={() => setPendingAction('Resume')}>
            Resume Project
          </Button>
        )}
      </div>

      <ConfirmationDialog
        open={pendingAction !== null}
        onOpenChange={(open) => !open && setPendingAction(null)}
        title={dialogConfig?.title || ''}
        description={dialogConfig?.description || ''}
        confirmLabel={dialogConfig?.confirmLabel || ''}
        cancelLabel="Cancel"
        onConfirm={handleConfirm}
        variant={dialogConfig?.variant || 'primary'}
      />
    </>
  );
}
