import React, { useEffect } from 'react';
import { Project } from '../types/project.types';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { Customer } from '@/src/features/customers/types/customer.types';
import { fetchCustomers, selectCustomers, selectCustomersListStatus, selectCustomersListError } from '@/src/features/customers/store/customersSlice';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { InlineEdit } from '@/src/components/ui/inline-edit';
import { Button } from '@/src/components/ui/button';

interface ProjectCustomerProps {
  project: Project;
  onUpdate?: (updates: Partial<Project>) => Promise<boolean | void> | boolean | void;
}

function DetailItem({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[13px] font-medium text-neutral-500 uppercase tracking-wide">{label}</span>
      <div className="text-[15px] text-neutral-900">{children}</div>
    </div>
  );
}

export function ProjectCustomer({ project, onUpdate }: ProjectCustomerProps) {
  const dispatch = useAppDispatch();
  const customers = useAppSelector(selectCustomers);
  const listStatus = useAppSelector(selectCustomersListStatus);
  const listError = useAppSelector(selectCustomersListError);
  useEffect(() => { if (listStatus === 'idle') void dispatch(fetchCustomers()); }, [dispatch, listStatus]);
  const customer: Customer | undefined = customers.find(c => c.id === project.customerId);

  const customerOptions = customers.map(c => ({
    value: c.id,
    label: c.name
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-y-6">
          <DetailItem label="Customer Name">
            <InlineEdit
              editor="select"
              options={customerOptions}
              value={project.customerId}
              disabled={listStatus === 'loading' || customers.length === 0}
              onSave={(val) => {
                if (!val) return false;
                if (val === project.customerId) return true;
                if (!onUpdate || !customers.some(c => c.id === val)) return false;
                return onUpdate({ customerId: val, customerName: customers.find(c => c.id === val)?.name || '' });
              }}
              displayValue={
                <span className="font-medium">{project.customerName}</span>
              }
            />
          </DetailItem>
          
          {customer || project.customerType || project.customerCode ? (
            <>
              <DetailItem label="Customer Type">
                {customer?.type || project.customerType || 'Not available'}
              </DetailItem>
              <DetailItem label="Customer Code">
                <span className="font-mono text-neutral-600">{customer?.customerCode || project.customerCode || 'Not available'}</span>
              </DetailItem>
            </>
          ) : (
            <DetailItem label="Additional Info">
              <span className="text-neutral-400 italic">Not available</span>
            </DetailItem>
          )}
          {listStatus === 'loading' && <p className="text-xs text-neutral-500">Loading customers…</p>}
          {listError && <p role="alert" className="text-xs text-red-600">{listError} <Button type="button" variant="ghost" size="sm" className="h-auto p-0 text-xs underline" onClick={() => void dispatch(fetchCustomers())}>Retry</Button></p>}
        </div>
      </CardContent>
    </Card>
  );
}
