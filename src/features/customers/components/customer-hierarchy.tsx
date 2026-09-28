import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { Customer } from '../types/customer.types';
import { CustomerDetailItem } from './customer-detail-item';
import { mockCustomers } from '../data/customers.mock';

export function CustomerHierarchy({ customer }: { customer: Customer }) {
  const parent = customer.parentCustomerId 
    ? mockCustomers.find(c => c.id === customer.parentCustomerId)
    : null;
    
  const children = mockCustomers.filter(c => c.parentCustomerId === customer.id);

  return (
    <Card className="w-full min-w-0 h-full">
      <CardHeader>
        <CardTitle>Customer Hierarchy</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6">
          <CustomerDetailItem 
            label="Parent Customer" 
            value={parent ? parent.name : 'No parent customer'} 
          />
          <CustomerDetailItem 
            label="Child Customers" 
            value={
              children.length > 0 ? (
                <div className="flex flex-col gap-1 mt-1">
                  <span className="text-sm font-medium text-neutral-900 mb-1">{children.length}</span>
                  {children.map(child => (
                    <span key={child.id} className="text-[15px] text-neutral-600">{child.name}</span>
                  ))}
                </div>
              ) : 'No child customers'
            } 
          />
        </div>
      </CardContent>
    </Card>
  );
}
