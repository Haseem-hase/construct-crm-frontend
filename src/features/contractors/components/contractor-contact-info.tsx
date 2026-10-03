import React from 'react';
import { Contractor } from '../types/contractor.types';
import { Card } from '@/src/components/ui/card';
import { InlineEdit } from '@/src/components/ui/inline-edit';

interface ContractorContactInfoProps {
  contractor: Contractor;
  onUpdate?: (updates: Partial<Contractor>) => void;
}

export function ContractorContactInfo({ contractor, onUpdate }: ContractorContactInfoProps) {
  const handleSave = (field: keyof Contractor, value: string, required: boolean = false, isEmail: boolean = false) => {
    if (required && !value.trim()) return false;
    if (isEmail && value.trim() && !/^\S+@\S+\.\S+$/.test(value.trim())) return false;
    onUpdate?.({ [field]: value });
    return true;
  };

  return (
    <Card className="p-6 h-full">
      <h2 className="text-lg font-semibold text-neutral-900 mb-6">Contact Information</h2>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-neutral-500">Email</span>
          <div className="text-[15px] text-neutral-900 font-medium">
            <InlineEdit
              value={contractor.email}
              onSave={(v) => handleSave('email', v, false, true)}
              editor="email"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-sm text-neutral-500">Phone</span>
          <div className="text-[15px] text-neutral-900 font-medium">
            <InlineEdit
              value={contractor.phone}
              onSave={(v) => handleSave('phone', v, true)}
              editor="phone"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-sm text-neutral-500">Alternative Phone</span>
          <div className="text-[15px] text-neutral-900 font-medium">
            <InlineEdit
              value={contractor.alternativePhone || ''}
              onSave={(v) => handleSave('alternativePhone', v)}
              editor="phone"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
