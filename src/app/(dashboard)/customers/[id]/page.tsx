'use client';

import React, { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { 
  fetchCustomerById, 
  fetchCustomerChildren,
  selectSelectedCustomer, 
  selectCustomersDetailStatus, 
  selectCustomersDetailError,
  clearSelectedCustomer,
  selectChildCustomers,
  selectCustomerChildrenStatus,
  selectCustomers
} from '@/src/features/customers/store/customersSlice';
import { Customer } from '@/src/features/customers/types/customer.types';
import { CustomerDetailsHeader } from '@/src/features/customers/components/customer-details-header';
import { CustomerOverview } from '@/src/features/customers/components/customer-overview';
import { CustomerContactInformation } from '@/src/features/customers/components/customer-contact-information';
import { CustomerAddress } from '@/src/features/customers/components/customer-address';
import { CustomerHierarchy } from '@/src/features/customers/components/customer-hierarchy';
import { Button } from '@/src/components/ui/button';
import { ConfirmationDialog } from '@/src/components/ui/confirmation-dialog';
import { EmptyState } from '@/src/components/ui/empty-state';
import Link from 'next/link';

export default function CustomerDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const customer = useAppSelector(selectSelectedCustomer);
  const status = useAppSelector(selectCustomersDetailStatus);
  const error = useAppSelector(selectCustomersDetailError);
  
  const childrenList = useAppSelector(selectChildCustomers);
  const childrenStatus = useAppSelector(selectCustomerChildrenStatus);
  const allCustomers = useAppSelector(selectCustomers);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    // Clear the previous customer and fetch the new one
    dispatch(clearSelectedCustomer());
    if (resolvedParams.id) {
      dispatch(fetchCustomerById(resolvedParams.id));
      dispatch(fetchCustomerChildren(resolvedParams.id));
    }
  }, [dispatch, resolvedParams.id]);

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-neutral-500 bg-white border border-neutral-200 rounded-lg max-w-5xl mx-auto mt-6">
        <svg className="w-8 h-8 animate-spin mb-4 text-neutral-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p>Loading customer details...</p>
      </div>
    );
  }

  if (status === 'failed' || (!customer && status === 'succeeded')) {
    return (
      <div className="w-full mx-auto pb-12 min-w-0 max-w-5xl mt-6">
        <EmptyState 
          title="Customer Not Found"
          description={error || "The customer you are looking for does not exist or has been removed."}
          action={
            <div className="flex gap-4">
              <Link href="/customers">
                <Button variant="outline">
                  Back to Customers
                </Button>
              </Link>
              {status === 'failed' && (
                <Button onClick={() => dispatch(fetchCustomerById(resolvedParams.id))}>
                  Retry
                </Button>
              )}
            </div>
          }
        />
      </div>
    );
  }

  if (!customer) return null; // Safe fallback

  const handleUpdate = (field: keyof Customer, value: string | boolean) => {
    // Real updates are deferred to Phase 6. For now just log.
    console.log(`Update ${field} to ${value} is not integrated in this phase.`);
  };

  const handleToggleStatus = () => {
    console.log('Status toggle not integrated in this phase');
    setIsConfirmOpen(false);
  };

  const parentCustomer = customer.parentCustomerId 
    ? allCustomers.find(c => c.id === customer.parentCustomerId)
    : null;

  return (
    <div className="w-full mx-auto pb-8 min-w-0 mt-6">
      <CustomerDetailsHeader 
        name={customer.name} 
        code={customer.customerCode} 
        status={customer.isActive ? 'Active' : 'Inactive'} 
        onActivateToggle={() => setIsConfirmOpen(true)}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mb-6">
        <CustomerOverview customer={customer} onUpdate={handleUpdate as any} />
        <CustomerContactInformation customer={customer} onUpdate={handleUpdate as any} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <CustomerAddress customer={customer} onUpdate={handleUpdate as any} />
        <CustomerHierarchy 
          customer={customer} 
          parentName={parentCustomer?.name}
          childrenList={childrenList}
          childrenStatus={childrenStatus}
        />
      </div>

      <ConfirmationDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title={customer.isActive ? 'Deactivate customer?' : 'Activate customer?'}
        description={`Are you sure you want to ${customer.isActive ? 'deactivate' : 'activate'} ${customer.name}?`}
        confirmLabel={customer.isActive ? 'Deactivate' : 'Activate'}
        variant={customer.isActive ? 'destructive' : 'primary'}
        onConfirm={handleToggleStatus}
      />
    </div>
  );
}
