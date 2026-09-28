'use client';

import React, { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockCustomers } from '@/src/features/customers/data/customers.mock';
import { Customer } from '@/src/features/customers/types/customer.types';
import { CustomerDetailsHeader } from '@/src/features/customers/components/customer-details-header';
import { CustomerOverview } from '@/src/features/customers/components/customer-overview';
import { CustomerContactInformation } from '@/src/features/customers/components/customer-contact-information';
import { CustomerAddress } from '@/src/features/customers/components/customer-address';
import { CustomerHierarchy } from '@/src/features/customers/components/customer-hierarchy';
import { Button } from '@/src/components/ui/button';
import { ConfirmationDialog } from '@/src/components/ui/confirmation-dialog';

export default function CustomerDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  
  const initialCustomer = mockCustomers.find(
    c => c.id === resolvedParams.id || c.customerCode.toLowerCase() === resolvedParams.id.toLowerCase()
  );

  const [customer, setCustomer] = useState(initialCustomer);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  if (!customer) {
    return (
      <div className="w-full mx-auto pb-8 min-w-0 flex flex-col items-center justify-center pt-24">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-2">Customer not found</h1>
        <p className="text-neutral-500 mb-6">We couldn&apos;t find the customer you&apos;re looking for.</p>
        <Button variant="outline" onClick={() => router.push('/customers')}>
          Back to Customers
        </Button>
      </div>
    );
  }

  const handleUpdate = (field: keyof Customer, value: string) => {
    setCustomer(prev => {
      if (!prev) return prev;
      return { ...prev, [field]: value };
    });
  };

  const handleToggleStatus = () => {
    handleUpdate('status', customer.status === 'Active' ? 'Inactive' : 'Active');
  };

  return (
    <div className="w-full mx-auto pb-8 min-w-0">
      <CustomerDetailsHeader 
        name={customer.name} 
        code={customer.customerCode} 
        status={customer.status} 
        onActivateToggle={() => setIsConfirmOpen(true)}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mb-6">
        <CustomerOverview customer={customer} onUpdate={handleUpdate} />
        <CustomerContactInformation customer={customer} onUpdate={handleUpdate} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <CustomerAddress customer={customer} onUpdate={handleUpdate} />
        <CustomerHierarchy customer={customer} />
      </div>

      <ConfirmationDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title={customer.status === 'Active' ? 'Deactivate customer?' : 'Activate customer?'}
        description={`Are you sure you want to ${customer.status === 'Active' ? 'deactivate' : 'activate'} ${customer.name}?`}
        confirmLabel={customer.status === 'Active' ? 'Deactivate' : 'Activate'}
        variant={customer.status === 'Active' ? 'destructive' : 'primary'}
        onConfirm={handleToggleStatus}
      />
    </div>
  );
}
