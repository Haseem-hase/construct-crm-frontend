import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { Customer } from '../types/customer.types';
import { CustomerDetailItem } from './customer-detail-item';

interface CustomerHierarchyProps {
  customer: Customer;
  parentName?: string | null;
  childrenList: Customer[];
  childrenStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

export function CustomerHierarchy({ customer, parentName, childrenList, childrenStatus }: CustomerHierarchyProps) {
  return (
    <Card className="w-full min-w-0 h-full">
      <CardHeader>
        <CardTitle>Customer Hierarchy</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6">
          <CustomerDetailItem 
            label="Parent Customer" 
            value={
              customer.parentCustomerId 
                ? (parentName || `ID: ${customer.parentCustomerId}`) 
                : 'No parent customer'
            } 
          />
          <CustomerDetailItem 
            label="Child Customers" 
            value={
              childrenStatus === 'loading' ? (
                <span className="text-neutral-500">Loading...</span>
              ) : childrenStatus === 'failed' ? (
                <span className="text-red-500">Failed to load</span>
              ) : childrenList.length > 0 ? (
                <div className="flex flex-col gap-1 mt-1">
                  <span className="text-sm font-medium text-neutral-900 mb-1">{childrenList.length}</span>
                  {childrenList.map(child => (
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
