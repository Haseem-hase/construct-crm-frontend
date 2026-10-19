import React from 'react';
import { ApiContractor } from '../types/contractor.types';
import { Card } from '@/src/components/ui/card';
import { CustomerDetailItem } from '@/src/features/customers/components/customer-detail-item';
import { InlineEdit } from '@/src/components/ui/inline-edit';

interface ContractorContactInfoProps {
  contractor: ApiContractor;
  onUpdate?: (field: keyof ApiContractor, value: string) => Promise<boolean | void> | boolean | void;
}

export function ContractorContactInfo({ contractor, onUpdate }: ContractorContactInfoProps) {
  return (
    <Card className="p-6 h-full">
      <h2 className="text-lg font-semibold text-neutral-900 mb-6">Contact Information</h2>
      <div className="flex flex-col gap-5">
        <CustomerDetailItem
          label="Email"
          value={
            onUpdate ? (
              <InlineEdit
                value={contractor.email || ''}
                editor="email"
                placeholder="Not provided"
                displayValue={
                  contractor.email ? (
                    <a href={`mailto:${contractor.email}`} className="text-blue-600 hover:underline">
                      {contractor.email}
                    </a>
                  ) : undefined
                }
                onSave={(val) => onUpdate('email', val)}
              />
            ) : contractor.email ? (
              <a href={`mailto:${contractor.email}`} className="text-blue-600 hover:underline">
                {contractor.email}
              </a>
            ) : undefined
          }
        />
        <CustomerDetailItem
          label="Phone"
          value={
            onUpdate ? (
              <InlineEdit
                value={contractor.phone || ''}
                editor="phone"
                placeholder="Not provided"
                displayValue={
                  contractor.phone ? (
                    <a href={`tel:${contractor.phone}`} className="hover:underline">
                      {contractor.phone}
                    </a>
                  ) : undefined
                }
                onSave={(val) => onUpdate('phone', val)}
              />
            ) : contractor.phone ? (
              <a href={`tel:${contractor.phone}`} className="hover:underline">
                {contractor.phone}
              </a>
            ) : undefined
          }
        />
        <CustomerDetailItem
          label="Alternative Phone"
          value={
            onUpdate ? (
              <InlineEdit
                value={contractor.alternativePhone || ''}
                editor="phone"
                placeholder="Not provided"
                displayValue={
                  contractor.alternativePhone ? (
                    <a href={`tel:${contractor.alternativePhone}`} className="hover:underline">
                      {contractor.alternativePhone}
                    </a>
                  ) : undefined
                }
                onSave={(val) => onUpdate('alternativePhone', val)}
              />
            ) : contractor.alternativePhone ? (
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
