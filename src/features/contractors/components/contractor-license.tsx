import React from 'react';
import { Contractor } from '../types/contractor.types';
import { Card } from '@/src/components/ui/card';
import { InlineEdit } from '@/src/components/ui/inline-edit';

interface ContractorLicenseProps {
  contractor: Contractor;
  onUpdate?: (updates: Partial<Contractor>) => void;
}

export function ContractorLicense({ contractor, onUpdate }: ContractorLicenseProps) {
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

  const handleSave = (field: keyof Contractor, value: string, required: boolean = false) => {
    if (required && !value.trim()) return false;
    onUpdate?.({ [field]: value });
    return true;
  };

  const handleDateSave = (value: string) => {
    if (!value) {
      onUpdate?.({ licenseExpiryDate: undefined });
      return true;
    }
    const date = new Date(value);
    onUpdate?.({ licenseExpiryDate: date.toISOString() });
    return true;
  };

  return (
    <Card className="p-6 h-full">
      <h2 className="text-lg font-semibold text-neutral-900 mb-6">Legal & License</h2>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-neutral-500">National ID</span>
          <div className="text-[15px] text-neutral-900 font-medium">
            <InlineEdit
              value={contractor.nationalId || ''}
              onSave={(v) => handleSave('nationalId', v)}
              editor="text"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-sm text-neutral-500">License Number</span>
          <div className="text-[15px] text-neutral-900 font-medium">
            <InlineEdit
              value={contractor.licenseNumber}
              onSave={(v) => handleSave('licenseNumber', v, true)}
              editor="text"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-sm text-neutral-500">License Expiry Date</span>
          <div className="text-[15px] text-neutral-900 font-medium">
            <InlineEdit
              value={contractor.licenseExpiryDate?.split('T')[0] || ''}
              displayValue={formatValue(contractor.licenseExpiryDate)}
              onSave={handleDateSave}
              editor="date"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
