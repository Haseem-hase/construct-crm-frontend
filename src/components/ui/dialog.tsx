'use client';

import React, { useEffect, useRef } from 'react';

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  panelClassName?: string;
}

export function Dialog({ open, onOpenChange, title, description, children, panelClassName }: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onOpenChange(false);
      }
    };
    
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onOpenChange]);

  // Focus trap could be added here, but for simplicity we rely on native focus order and aria semantics
  useEffect(() => {
    if (open && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:items-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm transition-opacity"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />
      
      {/* Dialog Panel */}
      <div 
        ref={dialogRef}
        role="dialog" 
        aria-modal="true"
        aria-labelledby={title ? 'dialog-title' : undefined}
        aria-describedby={description ? 'dialog-description' : undefined}
        tabIndex={-1}
        className={panelClassName || "relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6 sm:p-8 outline-none"}
      >
        {(title || description) && (
          <div className="mb-6">
            {title && <h2 id="dialog-title" className="text-xl font-semibold text-neutral-900 mb-1">{title}</h2>}
            {description && <p id="dialog-description" className="text-[15px] text-neutral-500">{description}</p>}
          </div>
        )}
        
        {children}
      </div>
    </div>
  );
}
