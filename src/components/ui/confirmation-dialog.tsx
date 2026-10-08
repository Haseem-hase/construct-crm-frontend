'use client';

import React, { useState } from 'react';
import { Dialog } from './dialog';
import { Button } from './button';

export interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  description: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'primary' | 'destructive' | 'default';
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  confirmDisabled?: boolean;
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'primary',
  onConfirm,
  onCancel,
  confirmDisabled = false,
}: ConfirmationDialogProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await onConfirm();
    } finally {
      setIsConfirming(false);
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    onOpenChange(false);
  };

  const buttonVariant = variant === 'destructive' ? 'destructive' : variant === 'primary' ? 'primary' : 'secondary';

  return (
    <Dialog 
      open={open} 
      onOpenChange={isConfirming ? () => {} : onOpenChange} 
      title={title} 
      description={description}
    >
      <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
        <Button 
          variant="outline" 
          onClick={handleCancel} 
          disabled={isConfirming}
          className="w-full sm:w-auto"
        >
          {cancelLabel}
        </Button>
        <Button 
          variant={buttonVariant} 
          onClick={handleConfirm} 
          disabled={isConfirming || confirmDisabled}
          className="w-full sm:w-auto"
        >
          {isConfirming ? `${confirmLabel.replace(/e$/, '')}ing...` : confirmLabel}
        </Button>
      </div>
    </Dialog>
  );
}
