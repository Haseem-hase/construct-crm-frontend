import React from 'react';
import { Contractor } from '../types/contractor.types';
import { Card } from '@/src/components/ui/card';
import { CustomerDetailItem } from '@/src/features/customers/components/customer-detail-item';

interface ContractorContactInfoProps {
  contractor: Contractor;
}

export function ContractorContactInfo({ contractor }: ContractorContactInfoProps) {
  return (
    <Card className="p-6 h-full">
      <h2 className="text-lg font-semibold text-neutral-900 mb-6">Contact Information</h2>
      <div className="flex flex-col gap-5">
        <CustomerDetailItem label="Email" value={contractor.email} />
        <CustomerDetailItem label="Phone" value={contractor.phone} />
        <CustomerDetailItem label="Alternative Phone" value={contractor.alternativePhone} />
      </div>
    </Card>
  );
}
