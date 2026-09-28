import React from 'react';
import { useRouter } from 'next/navigation';
import { Customer } from '../types/customer.types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Card } from '@/src/components/ui/card';
import { ConfirmationDialog } from '@/src/components/ui/confirmation-dialog';
import { CustomerStatus } from '../types/customer.types';

interface CustomerTableProps {
  customers: Customer[];
  allCustomers: Customer[];
  onClearFilters: () => void;
  onUpdateStatus: (id: string, status: CustomerStatus) => void;
  currentPage?: number;
  itemsPerPage?: number;
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

export function CustomerTable({ customers, allCustomers, onClearFilters, onUpdateStatus, currentPage = 1, itemsPerPage = 10 }: CustomerTableProps) {
  const router = useRouter();
  const [targetCustomer, setTargetCustomer] = React.useState<Customer | null>(null);

  const handleConfirmStatus = () => {
    if (!targetCustomer) return;
    const newStatus = targetCustomer.status === 'Active' ? 'Inactive' : 'Active';
    onUpdateStatus(targetCustomer.id, newStatus);
    setTargetCustomer(null);
  };

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
            <TableHead className="w-[60px] text-center">S.No</TableHead>
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
          {customers.map((customer, index) => {
            const serialNumber = (currentPage - 1) * itemsPerPage + index + 1;
            let parentName = '—';
            if (customer.parentCustomerId) {
              const parent = allCustomers.find(c => c.id === customer.parentCustomerId);
              if (parent) {
                parentName = parent.name;
              }
            }

            return (
              <TableRow key={customer.id}>
                <TableCell className="text-center text-neutral-500 text-[13px] font-medium">
                  {serialNumber}
                </TableCell>
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
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-16"
                      onClick={() => router.push(`/customers/${customer.customerCode.toLowerCase()}`)}
                    >
                      View
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-16"
                      onClick={() => router.push(`/customers/${customer.customerCode.toLowerCase()}/edit`)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setTargetCustomer(customer)}
                      className={`w-24 ${customer.status === 'Active' ? 'text-red-600 hover:text-red-700 hover:bg-red-50' : 'text-neutral-900'}`}
                    >
                      {customer.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <ConfirmationDialog
        open={!!targetCustomer}
        onOpenChange={(open) => !open && setTargetCustomer(null)}
        title={targetCustomer?.status === 'Active' ? 'Deactivate customer?' : 'Activate customer?'}
        description={`Are you sure you want to ${targetCustomer?.status === 'Active' ? 'deactivate' : 'activate'} ${targetCustomer?.name}?`}
        confirmLabel={targetCustomer?.status === 'Active' ? 'Deactivate' : 'Activate'}
        variant={targetCustomer?.status === 'Active' ? 'destructive' : 'primary'}
        onConfirm={handleConfirmStatus}
      />
    </Card>
  );
}
