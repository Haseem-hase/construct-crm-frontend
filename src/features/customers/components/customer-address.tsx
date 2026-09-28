import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { InlineEdit } from '@/src/components/ui/inline-edit';
import { Customer } from '../types/customer.types';
import { CustomerDetailItem } from './customer-detail-item';

export function CustomerAddress({ customer, onUpdate }: { customer: Customer, onUpdate: (field: keyof Customer, value: string) => void }) {
  return (
    <Card className="w-full min-w-0 h-full">
      <CardHeader>
        <CardTitle>Address</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6">
          <CustomerDetailItem 
            label="Country" 
            value={
              <InlineEdit 
                value={customer.country || ''} 
                onSave={(val) => onUpdate('country', val)} 
              />
            } 
          />
          <CustomerDetailItem 
            label="City" 
            value={
              <InlineEdit 
                value={customer.city} 
                onSave={(val) => onUpdate('city', val)} 
              />
            } 
          />
          <CustomerDetailItem 
            label="Address" 
            value={
              <InlineEdit 
                value={customer.address || ''} 
                onSave={(val) => onUpdate('address', val)} 
                editor="textarea"
              />
            } 
          />
        </div>
      </CardContent>
    </Card>
  );
}
