import React from 'react';
import { Contractor } from '../types/contractor.types';
import { Card } from '@/src/components/ui/card';
import { InlineEdit } from '@/src/components/ui/inline-edit';
import { SAUDI_CITIES } from '../data/contractor-options';

interface ContractorLocationProps {
  contractor: Contractor;
  onUpdate?: (updates: Partial<Contractor>) => void;
}

export function ContractorLocation({ contractor, onUpdate }: ContractorLocationProps) {
  const cityOptions = [
    { value: '', label: 'Select city' },
    ...SAUDI_CITIES.map((c) => ({ value: c, label: c })),
  ];

  const handleSave = (field: keyof Contractor, value: string, required: boolean = false) => {
    if (required && !value.trim()) return false;
    onUpdate?.({ [field]: value });
    return true;
  };

  return (
    <Card className="p-6 h-full">
      <h2 className="text-lg font-semibold text-neutral-900 mb-6">Location</h2>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-neutral-500">Country</span>
          <div className="text-[15px] text-neutral-900 font-medium">
            <InlineEdit
              value={contractor.country}
              onSave={(v) => handleSave('country', v)}
              editor="text"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-sm text-neutral-500">City</span>
          <div className="text-[15px] text-neutral-900 font-medium">
            <InlineEdit
              value={contractor.city}
              onSave={(v) => handleSave('city', v, true)}
              editor="select"
              options={cityOptions}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-sm text-neutral-500">Address</span>
          <div className="text-[15px] text-neutral-900 font-medium">
            <InlineEdit
              value={contractor.address}
              onSave={(v) => handleSave('address', v)}
              editor="textarea"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
