import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { InlineEdit } from '@/src/components/ui/inline-edit';
import { Customer } from '../types/customer.types';
import { CustomerDetailItem } from './customer-detail-item';

const typeLabels: Record<string, string> = {
  COMPANY: 'Company',
  GOVERNMENT: 'Government',
  INDIVIDUAL: 'Individual',
  OTHER: 'Other',
};

export function CustomerOverview({ customer, onUpdate }: { customer: Customer, onUpdate: (field: keyof Customer, value: string) => void }) {
  const formattedDate = new Date(customer.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <Card className="w-full min-w-0 h-full">
      <CardHeader>
        <CardTitle>Customer Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CustomerDetailItem 
            label="Customer Name" 
            value={
              <InlineEdit 
                value={customer.name} 
                onSave={(val) => onUpdate('name', val)} 
              />
            } 
          />
          <CustomerDetailItem 
            label="Customer Type" 
            value={
              <InlineEdit 
                value={customer.type} 
                onSave={(val) => onUpdate('type', val)} 
                editor="select"
                options={[
                  { value: 'COMPANY', label: 'Company' },
                  { value: 'GOVERNMENT', label: 'Government' },
                  { value: 'INDIVIDUAL', label: 'Individual' },
                  { value: 'OTHER', label: 'Other' },
                ]}
                displayValue={typeLabels[customer.type] || customer.type}
              />
            } 
          />
          <CustomerDetailItem label="Customer Code" value={customer.customerCode} />
          <CustomerDetailItem 
            label="Status" 
            value={
              <InlineEdit 
                value={customer.isActive ? 'Active' : 'Inactive'} 
                onSave={(val) => onUpdate('status', val)} 
                editor="select"
                options={[
                  { value: 'Active', label: 'Active' },
                  { value: 'Inactive', label: 'Inactive' },
                ]}
              />
            } 
          />
          <CustomerDetailItem label="Created" value={formattedDate} />
        </div>
      </CardContent>
    </Card>
  );
}
