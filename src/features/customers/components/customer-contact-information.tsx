import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { InlineEdit } from '@/src/components/ui/inline-edit';
import { Customer } from '../types/customer.types';
import { CustomerDetailItem } from './customer-detail-item';

export function CustomerContactInformation({ customer, onUpdate }: { customer: Customer, onUpdate: (field: keyof Customer, value: string) => void }) {
  return (
    <Card className="w-full min-w-0 h-full">
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6">
          <CustomerDetailItem 
            label="Email" 
            value={
              <InlineEdit 
                value={customer.email || 'N/A'} 
                onSave={(val) => onUpdate('email', val)} 
                editor="email"
              />
            } 
          />
          <CustomerDetailItem 
            label="Phone" 
            value={
              <InlineEdit 
                value={customer.phone || 'N/A'} 
                onSave={(val) => onUpdate('phone', val)} 
                editor="phone"
              />
            } 
          />
          <CustomerDetailItem 
            label="Alternative Phone" 
            value={
              <InlineEdit 
                value={customer.alternativePhone || ''} 
                onSave={(val) => onUpdate('alternativePhone', val)} 
                editor="phone"
              />
            } 
          />
        </div>
      </CardContent>
    </Card>
  );
}
