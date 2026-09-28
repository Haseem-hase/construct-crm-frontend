import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { Customer } from '../types/customer.types';
import { CustomerDetailItem } from './customer-detail-item';

const typeLabels: Record<string, string> = {
  COMPANY: 'Company',
  GOVERNMENT: 'Government',
  INDIVIDUAL: 'Individual',
  OTHER: 'Other',
};

export function CustomerOverview({ customer }: { customer: Customer }) {
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
          <CustomerDetailItem label="Customer Name" value={customer.name} />
          <CustomerDetailItem label="Customer Type" value={typeLabels[customer.type] || customer.type} />
          <CustomerDetailItem label="Customer Code" value={customer.customerCode} />
          <CustomerDetailItem label="Status" value={customer.status} />
          <CustomerDetailItem label="Created" value={formattedDate} />
        </div>
      </CardContent>
    </Card>
  );
}
