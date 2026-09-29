import React from 'react';
import { Contractor } from '../types/contractor.types';
import { Card } from '@/src/components/ui/card';
import { CustomerDetailItem } from '@/src/features/customers/components/customer-detail-item';

interface ContractorLocationProps {
  contractor: Contractor;
}

export function ContractorLocation({ contractor }: ContractorLocationProps) {
  return (
    <Card className="p-6 h-full">
      <h2 className="text-lg font-semibold text-neutral-900 mb-6">Location</h2>
      <div className="flex flex-col gap-5">
        <CustomerDetailItem label="Country" value={contractor.country} />
        <CustomerDetailItem label="City" value={contractor.city} />
        <CustomerDetailItem label="Address" value={contractor.address} />
      </div>
    </Card>
  );
}
