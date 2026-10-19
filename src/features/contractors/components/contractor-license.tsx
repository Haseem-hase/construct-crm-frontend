import React from 'react';
import { ApiContractor } from '../types/contractor.types';
import { Card } from '@/src/components/ui/card';
import { CustomerDetailItem } from '@/src/features/customers/components/customer-detail-item';
import { InlineEdit } from '@/src/components/ui/inline-edit';

interface ContractorLicenseProps {
  contractor: ApiContractor;
  onUpdate?: (field: keyof ApiContractor, value: string) => Promise<boolean | void> | boolean | void;
}

export function ContractorLicense({ contractor, onUpdate }: ContractorLicenseProps) {
  const formatExpiryDate = (dateStr?: string | null) => {
    if (!dateStr) return undefined;
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return undefined;
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return undefined;
    }
  };

  return (
    <Card className="p-6 h-full">
      <h2 className="text-lg font-semibold text-neutral-900 mb-6">Legal & License</h2>
      <div className="flex flex-col gap-5">
        <CustomerDetailItem
          label="National ID"
          value={
            onUpdate ? (
              <InlineEdit
                value={contractor.nationalId || ''}
                placeholder="Not provided"
                onSave={(val) => onUpdate('nationalId', val)}
              />
            ) : (
              contractor.nationalId
            )
          }
        />
        <CustomerDetailItem
          label="License Number"
          value={
            onUpdate ? (
              <InlineEdit
                value={contractor.licenseNumber || ''}
                placeholder="Not provided"
                onSave={(val) => onUpdate('licenseNumber', val)}
              />
            ) : (
              contractor.licenseNumber
            )
          }
        />
        <CustomerDetailItem
          label="License Expiry Date"
          value={
            onUpdate ? (
              <InlineEdit
                editor="date"
                value={contractor.licenseExpiryDate ? contractor.licenseExpiryDate.split('T')[0] : ''}
                displayValue={
                  formatExpiryDate(contractor.licenseExpiryDate) || (
                    <span className="text-neutral-400 font-normal">Not provided</span>
                  )
                }
                placeholder="Not provided"
                onSave={(val) => onUpdate('licenseExpiryDate', val)}
              />
            ) : (
              formatExpiryDate(contractor.licenseExpiryDate)
            )
          }
        />
      </div>
    </Card>
  );
}
