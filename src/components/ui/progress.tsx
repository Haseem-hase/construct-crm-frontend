import React, { forwardRef } from 'react';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  showValue?: boolean;
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ value, max = 100, showValue = false, className = '', ...props }, ref) => {
    // Clamp value between 0 and max
    const safeValue = Math.min(Math.max(value, 0), max);
    const percentage = Math.round((safeValue / max) * 100);

    return (
      <div 
        ref={ref} 
        className={`flex flex-col gap-1.5 w-full ${className}`}
        {...props}
      >
        {showValue && (
          <div className="flex justify-between items-center text-[12px] font-medium text-neutral-600 leading-none">
            <span>{percentage}%</span>
          </div>
        )}
        <div 
          className="w-full bg-neutral-100/80 rounded-full h-1.5 overflow-hidden ring-1 ring-inset ring-neutral-200/50"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={max}
          aria-valuenow={safeValue}
        >
          <div 
            className="bg-neutral-800 h-full rounded-full transition-all duration-300 ease-in-out" 
            style={{ width: `${percentage}%` }} 
          />
        </div>
      </div>
    );
  }
);

Progress.displayName = 'Progress';
