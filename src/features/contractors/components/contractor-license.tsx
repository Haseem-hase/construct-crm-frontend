import React from 'react';
import { Contractor } from '../types/contractor.types';
import { Card } from '@/src/components/ui/card';
import { CustomerDetailItem } from '@/src/features/customers/components/customer-detail-item';

interface ContractorLicenseProps {
  contractor: Contractor;
}

export function ContractorLicense({ contractor }: ContractorLicenseProps) {
  // Format dates appropriately
  const formatValue = (dateStr?: string) => {
    if (!dateStr) return undefined;
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Card className="p-6 h-full">
      <h2 className="text-lg font-semibold text-neutral-900 mb-6">Legal & License</h2>
      <div className="flex flex-col gap-5">
        <CustomerDetailItem label="National ID" value={contractor.nationalId} />
        <CustomerDetailItem label="License Number" value={contractor.licenseNumber} />
        <CustomerDetailItem label="License Expiry Date" value={formatValue(contractor.licenseExpiryDate)} />
      </div>
    </Card>
  );
}
