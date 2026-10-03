'use client';

import React, { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { ConfirmationDialog } from '@/src/components/ui/confirmation-dialog';
import { LabourStatus } from '../types/labour.types';

interface LabourStatusActionsProps {
  status: LabourStatus;
  onStatusChange: (status: LabourStatus) => void;
}

export function LabourStatusActions({ status, onStatusChange }: LabourStatusActionsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isActive = status === 'ACTIVE';

  const handleConfirm = async () => {
    // Mock API processing delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    onStatusChange(isActive ? 'INACTIVE' : 'ACTIVE');
  };

  return (
    <>
      <Button
        variant={isActive ? 'destructive' : 'primary'}
        className="w-full sm:w-auto"
        onClick={() => setIsDialogOpen(true)}
      >
        {isActive ? 'Deactivate Labour' : 'Activate Labour'}
      </Button>

      <ConfirmationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfirm={handleConfirm}
        title={isActive ? 'Deactivate Labour?' : 'Activate Labour?'}
        description={
          isActive
            ? 'Are you sure you want to deactivate this labour record? The record will be retained, but it will no longer be active.'
            : 'Are you sure you want to activate this labour record?'
        }
        confirmLabel={isActive ? 'Deactivate Labour' : 'Activate Labour'}
        cancelLabel="Cancel"
        variant={isActive ? 'destructive' : 'default'}
      />
    </>
  );
}
