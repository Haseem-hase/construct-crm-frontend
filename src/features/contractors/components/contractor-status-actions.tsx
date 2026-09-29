import React, { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { ConfirmationDialog } from '@/src/components/ui/confirmation-dialog';
import { ContractorStatus } from '../types/contractor.types';

interface ContractorStatusActionsProps {
  status: ContractorStatus;
  onStatusChange: (newStatus: ContractorStatus) => void;
}

export function ContractorStatusActions({ status, onStatusChange }: ContractorStatusActionsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isActivate = status === 'Inactive';

  const handleConfirm = () => {
    onStatusChange(isActivate ? 'Active' : 'Inactive');
    setIsDialogOpen(false);
  };

  return (
    <>
      <Button
        variant={isActivate ? 'primary' : 'destructive'}
        onClick={() => setIsDialogOpen(true)}
        className="w-full md:w-auto"
      >
        {isActivate ? 'Activate Contractor' : 'Deactivate Contractor'}
      </Button>

      <ConfirmationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfirm={handleConfirm}
        title={isActivate ? 'Activate contractor?' : 'Deactivate contractor?'}
        description={
          isActivate
            ? 'Are you sure you want to activate this contractor?'
            : 'Are you sure you want to deactivate this contractor?'
        }
        confirmLabel={isActivate ? 'Activate Contractor' : 'Deactivate Contractor'}
        cancelLabel="Cancel"
        variant={isActivate ? 'primary' : 'destructive'}
      />
    </>
  );
}
