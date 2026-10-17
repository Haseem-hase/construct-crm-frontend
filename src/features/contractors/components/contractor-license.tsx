import React from 'react';
import { ApiContractor } from '../types/contractor.types';
import { Card } from '@/src/components/ui/card';
import { CustomerDetailItem } from '@/src/features/customers/components/customer-detail-item';

interface ContractorLicenseProps {
  contractor: ApiContractor;
}

export function ContractorLicense({ contractor }: ContractorLicenseProps) {
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
        <CustomerDetailItem label="National ID" value={contractor.nationalId} />
        <CustomerDetailItem label="License Number" value={contractor.licenseNumber} />
        <CustomerDetailItem
          label="License Expiry Date"
          value={formatExpiryDate(contractor.licenseExpiryDate)}
        />
      </div>
    </Card>
  );
}
