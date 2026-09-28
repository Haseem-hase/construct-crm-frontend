import React from 'react';
import { Button } from '@/src/components/ui/button';

export function CustomerPageHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">Customers</h1>
        <p className="text-[15px] text-neutral-500 mt-1">Manage your organization&apos;s customers.</p>
      </div>
      <div>
        <Button onClick={() => {}} variant="primary">
          + Add Customer
        </Button>
      </div>
    </div>
  );
}
