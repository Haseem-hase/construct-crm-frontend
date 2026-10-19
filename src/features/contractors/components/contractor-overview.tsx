import React from 'react';
import { ApiContractor } from '../types/contractor.types';
import { Card } from '@/src/components/ui/card';
import { CustomerDetailItem } from '@/src/features/customers/components/customer-detail-item';
import { InlineEdit } from '@/src/components/ui/inline-edit';

interface ContractorOverviewProps {
  contractor: ApiContractor;
  onUpdate?: (field: keyof ApiContractor, value: string) => Promise<boolean | void> | boolean | void;
}

export function ContractorOverview({ contractor, onUpdate }: ContractorOverviewProps) {
  return (
    <Card className="p-6 h-full">
      <h2 className="text-lg font-semibold text-neutral-900 mb-6">Contractor Overview</h2>
      <div className="flex flex-col gap-5">
        <CustomerDetailItem label="Contractor Code" value={contractor.contractorCode} />
        <CustomerDetailItem
          label="Full Name"
          value={
            onUpdate ? (
              <InlineEdit
                value={contractor.fullName}
                onSave={(val) => onUpdate('fullName', val)}
              />
            ) : (
              contractor.fullName
            )
          }
        />
        <CustomerDetailItem label="Status" value={contractor.status} />
        <CustomerDetailItem
          label="Notes"
          value={
            onUpdate ? (
              <InlineEdit
                value={contractor.notes || ''}
                editor="textarea"
                placeholder="No notes provided"
                onSave={(val) => onUpdate('notes', val)}
              />
            ) : (
              contractor.notes || undefined
            )
          }
        />
      </div>
    </Card>
  );
}
