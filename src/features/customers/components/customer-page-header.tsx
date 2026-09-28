import React from 'react';
import { Button } from '@/src/components/ui/button';

export function CustomerPageHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
      <div className="min-w-0">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 truncate">Customers</h1>
        <p className="text-[15px] text-neutral-500 mt-1 truncate">Manage your organization&apos;s customers.</p>
      </div>
      <div className="shrink-0">
        <Button onClick={() => {}} variant="primary">
          + Add Customer
        </Button>
      </div>
    </div>
  );
}
