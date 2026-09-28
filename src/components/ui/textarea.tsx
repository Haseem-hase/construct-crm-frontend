import React, { TextareaHTMLAttributes, forwardRef } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  fullWidth?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', error, fullWidth = true, rows = 3, ...props }, ref) => {
    const baseStyles = 'flex min-h-[80px] rounded-md border bg-neutral-50/50 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-4 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50';
    
    const widthClass = fullWidth ? 'w-full' : '';
    
    const errorStyles = error 
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
      : 'border-neutral-200/80 focus:border-neutral-900/20 focus:ring-neutral-900/5';

    return (
      <textarea
        ref={ref}
        rows={rows}
        className={`${baseStyles} ${widthClass} ${errorStyles} ${className}`}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
