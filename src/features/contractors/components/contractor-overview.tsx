import React from 'react';
import { Contractor } from '../types/contractor.types';
import { Card } from '@/src/components/ui/card';
import { CustomerDetailItem } from '@/src/features/customers/components/customer-detail-item';
import { InlineEdit } from '@/src/components/ui/inline-edit';

interface ContractorOverviewProps {
  contractor: Contractor;
  onUpdate?: (updates: Partial<Contractor>) => void;
}

export function ContractorOverview({ contractor, onUpdate }: ContractorOverviewProps) {
  const handleSave = (field: keyof Contractor, value: string) => {
    if (!value.trim()) return false;
    onUpdate?.({ [field]: value });
    return true;
  };

  return (
    <Card className="p-6 h-full">
      <h2 className="text-lg font-semibold text-neutral-900 mb-6">Contractor Overview</h2>
      <div className="flex flex-col gap-5">
        <CustomerDetailItem label="Contractor Code" value={contractor.contractorCode} />
        
        <div className="flex flex-col gap-1">
          <span className="text-sm text-neutral-500">Company Name</span>
          <div className="text-[15px] text-neutral-900 font-medium">
            <InlineEdit
              value={contractor.companyName}
              onSave={(v) => handleSave('companyName', v)}
              editor="text"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-sm text-neutral-500">Contact Person</span>
          <div className="text-[15px] text-neutral-900 font-medium">
            <InlineEdit
              value={contractor.contactPerson}
              onSave={(v) => handleSave('contactPerson', v)}
              editor="text"
            />
          </div>
        </div>

        <CustomerDetailItem label="Status" value={contractor.status} />
      </div>
    </Card>
  );
}
