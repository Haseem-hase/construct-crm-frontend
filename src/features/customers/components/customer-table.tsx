import React from 'react';
import { useRouter } from 'next/navigation';
import { Customer } from '../types/customer.types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Card } from '@/src/components/ui/card';

interface CustomerTableProps {
  customers: Customer[];
  allCustomers: Customer[];
  onClearFilters: () => void;
}

function formatDate(isoString: string) {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function CustomerTable({ customers, allCustomers, onClearFilters }: CustomerTableProps) {
  const router = useRouter();
  if (customers.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <h3 className="text-base font-medium text-neutral-900 mb-1">No customers found</h3>
        <p className="text-sm text-neutral-500 mb-4">Try adjusting your search or filters.</p>
        <Button variant="outline" onClick={onClearFilters}>
          Clear filters
        </Button>
      </Card>
    );
  }

  return (
    <Card className="w-full min-w-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map(customer => {
            let parentName = '—';
            if (customer.parentCustomerId) {
              const parent = allCustomers.find(c => c.id === customer.parentCustomerId);
              if (parent) {
                parentName = parent.name;
              }
            }

            return (
              <TableRow key={customer.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-neutral-900">{customer.name}</span>
                    {customer.parentCustomerId && (
                      <span className="text-[13px] text-neutral-500 mt-0.5">Parent: {parentName}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-neutral-600 font-mono text-[13px]">{customer.customerCode}</span>
                </TableCell>
                <TableCell>
                  <span className="text-neutral-600">{capitalize(customer.type)}</span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col text-neutral-600 text-[13px] space-y-0.5">
                    <span>{customer.email}</span>
                    <span>{customer.phone}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-neutral-600">{customer.city}</span>
                </TableCell>
                <TableCell>
                  <Badge variant={customer.status === 'Active' ? 'success' : 'neutral'}>
                    {customer.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-neutral-600 text-[13px]">{formatDate(customer.createdAt)}</span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => router.push(`/customers/${customer.customerCode.toLowerCase()}`)}>View</Button>
                    <Button variant="ghost" size="sm" onClick={() => {}}>Edit</Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
