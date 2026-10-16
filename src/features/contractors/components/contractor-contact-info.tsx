import React from 'react';
import { ApiContractor } from '../types/contractor.types';
import { Card } from '@/src/components/ui/card';
import { CustomerDetailItem } from '@/src/features/customers/components/customer-detail-item';

interface ContractorContactInfoProps {
  contractor: ApiContractor;
}

export function ContractorContactInfo({ contractor }: ContractorContactInfoProps) {
  return (
    <Card className="p-6 h-full">
      <h2 className="text-lg font-semibold text-neutral-900 mb-6">Contact Information</h2>
      <div className="flex flex-col gap-5">
        <CustomerDetailItem
          label="Email"
          value={
            contractor.email ? (
              <a href={`mailto:${contractor.email}`} className="text-blue-600 hover:underline">
                {contractor.email}
              </a>
            ) : undefined
          }
        />
        <CustomerDetailItem
          label="Phone"
          value={
            contractor.phone ? (
              <a href={`tel:${contractor.phone}`} className="hover:underline">
                {contractor.phone}
              </a>
            ) : undefined
          }
        />
        <CustomerDetailItem
          label="Alternative Phone"
          value={
            contractor.alternativePhone ? (
              <a href={`tel:${contractor.alternativePhone}`} className="hover:underline">
                {contractor.alternativePhone}
              </a>
            ) : undefined
          }
        />
      </div>
    </Card>
  );
}
