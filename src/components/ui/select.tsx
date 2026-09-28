import React, { SelectHTMLAttributes, forwardRef } from 'react';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  fullWidth?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', error, fullWidth = true, children, ...props }, ref) => {
    const baseStyles = 'flex h-10 rounded-md border bg-neutral-50/50 px-3 py-2 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-4 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 appearance-none';
    
    const widthClass = fullWidth ? 'w-full' : '';
    
    const errorStyles = error 
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
      : 'border-neutral-200/80 focus:border-neutral-900/20 focus:ring-neutral-900/5';

    return (
      <div className={`relative ${widthClass}`}>
        <select
          ref={ref}
          className={`${baseStyles} ${widthClass} ${errorStyles} pr-8 ${className}`}
          {...props}
        >
          {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-500">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
    );
  }
);

Select.displayName = 'Select';
