import React, { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, fullWidth = true, ...props }, ref) => {
    const baseStyles = 'flex h-10 rounded-md border bg-neutral-50/50 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-4 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50';
    
    const widthClass = fullWidth ? 'w-full' : '';
    
    const errorStyles = error 
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
      : 'border-neutral-200/80 focus:border-neutral-900/20 focus:ring-neutral-900/5';

    return (
      <input
        ref={ref}
        className={`${baseStyles} ${widthClass} ${errorStyles} ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
