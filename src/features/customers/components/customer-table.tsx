import React from 'react';
import { useRouter } from 'next/navigation';
import { Customer } from '../types/customer.types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Card } from '@/src/components/ui/card';
import { ConfirmationDialog } from '@/src/components/ui/confirmation-dialog';
import { SuccessAlert } from '@/src/components/ui/success-alert';
import { CustomerStatus } from '../types/customer.types';
import { User } from '@/src/components/ui/icons';
import { projectImageUrl } from '@/src/features/projects/utils/project-image';
import { ViewMode } from '@/src/components/ui/view-mode-toggle';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { 
  deleteCustomer, 
  selectDeleteCustomerStatus, 
  selectDeleteCustomerError, 
  resetDeleteState 
} from '../store/customersSlice';

interface CustomerTableProps {
  customers: Customer[];
  allCustomers: Customer[];
  onClearFilters: () => void;
  onUpdateStatus: (id: string, status: CustomerStatus) => Promise<void> | void;
  currentPage?: number;
  itemsPerPage?: number;
  readOnly?: boolean;
  viewMode?: ViewMode;
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

export function CustomerTable({ customers, allCustomers, onClearFilters, onUpdateStatus, currentPage = 1, itemsPerPage = 10, readOnly = false, viewMode = 'list' }: CustomerTableProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [targetCustomer, setTargetCustomer] = React.useState<Customer | null>(null);
  const [customerToDelete, setCustomerToDelete] = React.useState<Customer | null>(null);
  const [showSuccessAlert, setShowSuccessAlert] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState('');
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const deleteStatus = useAppSelector(selectDeleteCustomerStatus);
  const deleteError = useAppSelector(selectDeleteCustomerError);
  const isDeleting = deleteStatus === 'loading';
  const hasOrganizationColumn = customers.some((customer) => customer.organization?.name);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleConfirmStatus = async () => {
    if (!targetCustomer) return;
    const newStatus = targetCustomer.isActive ? 'Inactive' : 'Active';
    try {
      await onUpdateStatus(targetCustomer.id, newStatus);
      setTargetCustomer(null);
    } catch {
      // Keep dialog open if onUpdateStatus threw so user sees error and can retry
    }
  };

  const handleDeleteCustomer = async () => {
    if (!customerToDelete || isDeleting) return;

    const resultAction = await dispatch(deleteCustomer(customerToDelete.id));

    if (deleteCustomer.fulfilled.match(resultAction)) {
      const msg = (resultAction.payload as any)?.message || 'Customer deleted successfully.';
      setCustomerToDelete(null);
      dispatch(resetDeleteState());
      setSuccessMessage(msg);
      setShowSuccessAlert(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setShowSuccessAlert(false);
      }, 3000);
    } else {
      const errorMsg =
        (resultAction.payload as string) ||
        resultAction.error?.message ||
        'Failed to delete customer.';
      throw new Error(errorMsg);
    }
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
    <div className="w-full min-w-0">
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {customers.map((customer) => {
            const parentName = customer.parentCustomerId ? allCustomers.find(item => item.id === customer.parentCustomerId)?.name : undefined;
            const image = projectImageUrl(customer.profileImageUrl);
            return (
              <Card key={customer.id} className="overflow-hidden border-neutral-200 transition-shadow hover:shadow-md">
                <div className="flex items-start justify-between gap-4 bg-neutral-50 p-5">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-neutral-200 bg-white">
                      {image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={image} alt={`${customer.name} profile`} className="h-full w-full object-cover" />
                      ) : <User className="h-6 w-6 text-neutral-400" />}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold text-neutral-900" title={customer.name}>{customer.name}</p>
                      <p className="mt-1 font-mono text-xs text-neutral-500">{customer.customerCode}</p>
                    </div>
                  </div>
                  <Badge variant={customer.isActive ? 'success' : 'neutral'}>{customer.isActive ? 'Active' : 'Inactive'}</Badge>
                </div>
                <div className="space-y-3 p-5 text-sm">
                  <div className="flex justify-between gap-3"><span className="text-neutral-500">Type</span><span className="font-medium text-neutral-800">{capitalize(customer.type)}</span></div>
                  <div className="flex justify-between gap-3"><span className="text-neutral-500">Location</span><span className="text-right font-medium text-neutral-800">{[customer.city, customer.country].filter(Boolean).join(', ') || '—'}</span></div>
                  {parentName && <div className="flex justify-between gap-3"><span className="text-neutral-500">Parent</span><span className="max-w-[65%] truncate text-right font-medium text-neutral-800" title={parentName}>{parentName}</span></div>}
                  {customer.organization?.name && <p className="truncate border-t border-neutral-100 pt-3 text-xs text-neutral-500" title={customer.organization.name}>{customer.organization.name}</p>}
                  <div className="flex flex-wrap justify-end gap-1 border-t border-neutral-100 pt-3">
                    <Button size="sm" variant="ghost" onClick={() => router.push(`/customers/${customer.id}`)}>View</Button>
                    {!readOnly && <>
                      <Button size="sm" variant="outline" onClick={() => router.push(`/customers/${customer.id}/edit`)}>Edit</Button>
                      <Button size="sm" variant="ghost" className={customer.isActive ? 'text-red-600 hover:bg-red-50 hover:text-red-700' : ''} onClick={() => setTargetCustomer(customer)} disabled={isDeleting}>{customer.isActive ? 'Deactivate' : 'Activate'}</Button>
                      <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => { dispatch(resetDeleteState()); setCustomerToDelete(customer); }} disabled={isDeleting}>Delete</Button>
                    </>}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
      <Card className="w-full min-w-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px] text-center">S.No</TableHead>
            <TableHead>Customer</TableHead>
            {hasOrganizationColumn && <TableHead>Organization</TableHead>}
            <TableHead>Code</TableHead>
            <TableHead>Type</TableHead>
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
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-neutral-200 bg-neutral-100">
                      {customer.profileImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={projectImageUrl(customer.profileImageUrl) || customer.profileImageUrl} alt="" className="h-full w-full object-cover" />
                      ) : <User className="h-4 w-4 text-neutral-400" />}
                    </div>
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate font-medium text-neutral-900">{customer.name}</span>
                      {customer.parentCustomerId && <span className="mt-0.5 text-[13px] text-neutral-500">Parent: {parentName}</span>}
                    </div>
                  </div>
                </TableCell>
                {hasOrganizationColumn && <TableCell className="text-neutral-600">{customer.organization?.name || '—'}</TableCell>}
                <TableCell>
                  <span className="text-neutral-600 font-mono text-[13px]">{customer.customerCode}</span>
                </TableCell>
                <TableCell>
                  <span className="text-neutral-600">{capitalize(customer.type)}</span>
                </TableCell>
                <TableCell>
                  <span className="text-neutral-600">{customer.city}</span>
                </TableCell>
                <TableCell>
                  <Badge variant={customer.isActive ? 'success' : 'neutral'}>
                    {customer.isActive ? 'Active' : 'Inactive'}
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
                      onClick={() => router.push(`/customers/${customer.id}`)}
                    >
                      View
                    </Button>
                    {!readOnly && <>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-16"
                      onClick={() => router.push(`/customers/${customer.id}/edit`)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setTargetCustomer(customer)}
                      className={`w-24 ${customer.isActive ? 'text-red-600 hover:text-red-700 hover:bg-red-50' : 'text-neutral-900'}`}
                      disabled={isDeleting}
                    >
                      {customer.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="w-16 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        dispatch(resetDeleteState());
                        setCustomerToDelete(customer);
                      }}
                      disabled={isDeleting}
                    >
                      Delete
                    </Button>
                    </>}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      </Card>
      )}
      <ConfirmationDialog
        open={!!targetCustomer}
        onOpenChange={(open) => !open && setTargetCustomer(null)}
        title={targetCustomer?.isActive ? 'Deactivate customer?' : 'Activate customer?'}
        description={`Are you sure you want to ${targetCustomer?.isActive ? 'deactivate' : 'activate'} ${targetCustomer?.name}?`}
        confirmLabel={targetCustomer?.isActive ? 'Deactivate' : 'Activate'}
        variant={targetCustomer?.isActive ? 'destructive' : 'primary'}
        onConfirm={handleConfirmStatus}
      />
      <ConfirmationDialog
        open={!!customerToDelete}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setCustomerToDelete(null);
            dispatch(resetDeleteState());
          }
        }}
        title="Delete customer?"
        description={
          deleteError ? (
            <div className="flex flex-col gap-2">
              <span className="text-red-600 font-medium">{deleteError}</span>
              <span className="text-neutral-500 text-xs">You may retry or cancel.</span>
            </div>
          ) : (
            `Are you sure you want to delete "${customerToDelete?.name}" (${customerToDelete?.customerCode})? This action cannot be undone.`
          )
        }
        confirmLabel={isDeleting ? 'Deleting...' : 'Delete Customer'}
        variant="destructive"
        onConfirm={handleDeleteCustomer}
        confirmDisabled={isDeleting}
      />
      <SuccessAlert 
        show={showSuccessAlert} 
        title="Customer Deleted" 
        description={successMessage} 
      />
    </div>
  );
}
