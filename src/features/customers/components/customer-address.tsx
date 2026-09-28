import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { Customer } from '../types/customer.types';
import { CustomerDetailItem } from './customer-detail-item';

export function CustomerAddress({ customer }: { customer: Customer }) {
  return (
    <Card className="w-full min-w-0 h-full">
      <CardHeader>
        <CardTitle>Address</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6">
          <CustomerDetailItem label="Country" value={customer.country} />
          <CustomerDetailItem label="City" value={customer.city} />
          <CustomerDetailItem label="Address" value={customer.address} />
        </div>
      </CardContent>
    </Card>
  );
}
