import React, { ReactNode } from 'react';

export interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  children: ReactNode;
  className?: string;
}

export function FormField({
  label,
  required,
  error,
  helperText,
  children,
  className = '',
}: FormFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-neutral-700">
        {label}
        {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      {!error && helperText && (
        <p className="text-sm text-neutral-500">{helperText}</p>
      )}
    </div>
  );
}
