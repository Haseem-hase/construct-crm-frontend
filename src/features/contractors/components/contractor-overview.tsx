import React from 'react';
import { ApiContractor } from '../types/contractor.types';
import { Card } from '@/src/components/ui/card';
import { CustomerDetailItem } from '@/src/features/customers/components/customer-detail-item';

interface ContractorOverviewProps {
  contractor: ApiContractor;
}

export function ContractorOverview({ contractor }: ContractorOverviewProps) {
  return (
    <Card className="p-6 h-full">
      <h2 className="text-lg font-semibold text-neutral-900 mb-6">Contractor Overview</h2>
      <div className="flex flex-col gap-5">
        <CustomerDetailItem label="Contractor Code" value={contractor.contractorCode} />
        <CustomerDetailItem label="Full Name" value={contractor.fullName} />
        <CustomerDetailItem label="Status" value={contractor.status} />
        {contractor.notes ? (
          <CustomerDetailItem label="Notes" value={contractor.notes} />
        ) : null}
      </div>
    </Card>
  );
}
