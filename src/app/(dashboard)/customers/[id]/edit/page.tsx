'use client';

import React, { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { 
  fetchCustomerById, 
  clearSelectedCustomer, 
  selectSelectedCustomer, 
  selectCustomersDetailStatus, 
  selectCustomersDetailError 
} from '@/src/features/customers/store/customersSlice';
import { CustomerForm } from '@/src/features/customers/components/customer-form';
import { Button } from '@/src/components/ui/button';
import { PageHeader } from '@/src/components/ui/page-header';
import { EmptyState } from '@/src/components/ui/empty-state';

export default function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();
  const dispatch = useAppDispatch();

  const customer = useAppSelector(selectSelectedCustomer);
  const status = useAppSelector(selectCustomersDetailStatus);
  const error = useAppSelector(selectCustomersDetailError);

  useEffect(() => {
    dispatch(clearSelectedCustomer());
    if (id) {
      dispatch(fetchCustomerById(id));
    }
    return () => {
      dispatch(clearSelectedCustomer());
    };
  }, [dispatch, id]);

  const isLoading = status === 'loading' || status === 'idle' || (customer !== null && customer.id !== id);

  if (!customer && isLoading) {
    return (
      <div className="w-full mx-auto pb-12 min-w-0 max-w-5xl flex flex-col items-center justify-center py-24 text-neutral-500">
        <svg className="w-8 h-8 animate-spin mb-4 text-neutral-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p>Loading customer details...</p>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="w-full mx-auto pb-12 min-w-0 max-w-5xl">
        <div className="p-6 text-center bg-red-50 border border-red-200 rounded-lg text-red-700 mt-8">
          <h3 className="text-lg font-medium mb-2">Error Loading Customer</h3>
          <p className="mb-4">{error || 'Failed to load customer details'}</p>
          <div className="flex justify-center gap-4">
            <Link href="/customers">
              <Button variant="outline">
                Back to Customers
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="bg-white hover:bg-red-50 text-red-700 border-red-200 hover:border-red-300"
              onClick={() => dispatch(fetchCustomerById(id))}
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!customer || customer.id !== id) {
    return (
      <div className="w-full mx-auto pb-12 min-w-0 max-w-5xl">
        <EmptyState 
          title="Customer Not Found"
          description="The customer you are looking for does not exist or has been removed."
          action={
            <Link href="/customers">
              <Button variant="outline">
                Back to Customers
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto pb-12 min-w-0 max-w-4xl">
      <PageHeader 
        title="Edit Customer" 
        description={`${customer.name} (${customer.customerCode})`}
        backLink={{ href: `/customers/${customer.id}`, label: 'Back to Customer' }}
      />
      <CustomerForm key={customer.id} mode="edit" initialData={customer} />
    </div>
  );
}
