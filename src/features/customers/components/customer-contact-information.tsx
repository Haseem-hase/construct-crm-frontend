import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { Customer } from '../types/customer.types';
import { CustomerDetailItem } from './customer-detail-item';

export function CustomerContactInformation({ customer }: { customer: Customer }) {
  return (
    <Card className="w-full min-w-0 h-full">
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6">
          <CustomerDetailItem label="Email" value={customer.email} />
          <CustomerDetailItem label="Phone" value={customer.phone} />
          <CustomerDetailItem label="Alternative Phone" value={customer.alternativePhone} />
        </div>
      </CardContent>
    </Card>
  );
}
