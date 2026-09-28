import React from 'react';
import { Project } from '../types/project.types';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { mockCustomers } from '@/src/features/customers/data/customers.mock';

interface ProjectCustomerProps {
  project: Project;
}

function DetailItem({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[13px] font-medium text-neutral-500 uppercase tracking-wide">{label}</span>
      <div className="text-[15px] text-neutral-900">{children}</div>
    </div>
  );
}

export function ProjectCustomer({ project }: ProjectCustomerProps) {
  // Resolve customer details from mock data
  const customer = mockCustomers.find(c => c.id === project.customerId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-y-6">
          <DetailItem label="Customer Name">
            <span className="font-medium">{project.customerName}</span>
          </DetailItem>
          
          {customer ? (
            <>
              <DetailItem label="Customer Type">
                {customer.type}
              </DetailItem>
              <DetailItem label="Customer Code">
                <span className="font-mono text-neutral-600">{customer.customerCode}</span>
              </DetailItem>
            </>
          ) : (
            <DetailItem label="Additional Info">
              <span className="text-neutral-400 italic">Not available</span>
            </DetailItem>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
