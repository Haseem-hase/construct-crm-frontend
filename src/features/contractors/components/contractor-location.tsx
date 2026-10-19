import React from 'react';
import { ApiContractor } from '../types/contractor.types';
import { Card } from '@/src/components/ui/card';
import { CustomerDetailItem } from '@/src/features/customers/components/customer-detail-item';
import { InlineEdit } from '@/src/components/ui/inline-edit';
import { SAUDI_CITIES } from '../data/contractor-options';

interface ContractorLocationProps {
  contractor: ApiContractor;
  onUpdate?: (field: keyof ApiContractor, value: string) => Promise<boolean | void> | boolean | void;
}

export function ContractorLocation({ contractor, onUpdate }: ContractorLocationProps) {
  const cityOptions = [
    { value: '', label: 'Select city' },
    ...SAUDI_CITIES.map((c) => ({ value: c, label: c })),
  ];

  return (
    <Card className="p-6 h-full">
      <h2 className="text-lg font-semibold text-neutral-900 mb-6">Location</h2>
      <div className="flex flex-col gap-5">
        <CustomerDetailItem
          label="Country"
          value={
            onUpdate ? (
              <InlineEdit
                value={contractor.country}
                onSave={(val) => onUpdate('country', val)}
              />
            ) : (
              contractor.country
            )
          }
        />
        <CustomerDetailItem
          label="City"
          value={
            onUpdate ? (
              <InlineEdit
                value={contractor.city}
                editor="select"
                options={cityOptions}
                displayValue={contractor.city || <span className="text-neutral-400 font-normal">Select city</span>}
                onSave={(val) => onUpdate('city', val)}
              />
            ) : (
              contractor.city
            )
          }
        />
        <CustomerDetailItem
          label="Address"
          value={
            onUpdate ? (
              <InlineEdit
                value={contractor.address || ''}
                placeholder="Not provided"
                onSave={(val) => onUpdate('address', val)}
              />
            ) : (
              contractor.address
            )
          }
        />
      </div>
    </Card>
  );
}
