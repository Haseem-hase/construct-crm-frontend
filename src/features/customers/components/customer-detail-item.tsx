import React from 'react';

export function CustomerDetailItem({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-neutral-500">{label}</span>
      <span className="text-[15px] text-neutral-900 font-medium">
        {value || <span className="text-neutral-400 font-normal">Not provided</span>}
      </span>
    </div>
  );
}
