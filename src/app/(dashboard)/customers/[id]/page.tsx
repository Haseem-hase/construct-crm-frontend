'use client';

import React, { use, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { 
  fetchCustomerById, 
  fetchCustomerChildren,
  updateCustomer,
  deleteCustomer,
  selectSelectedCustomer, 
  selectCustomersDetailStatus, 
  selectCustomersDetailError,
  clearSelectedCustomer,
  selectChildCustomers,
  selectCustomerChildrenStatus,
  selectCustomers,
  selectDeleteCustomerStatus,
  selectDeleteCustomerError,
  resetDeleteState
} from '@/src/features/customers/store/customersSlice';
import { Customer, CustomerType, UpdateCustomerRequest } from '@/src/features/customers/types/customer.types';
import { CustomerDetailsHeader } from '@/src/features/customers/components/customer-details-header';
import { CustomerOverview } from '@/src/features/customers/components/customer-overview';
import { CustomerContactInformation } from '@/src/features/customers/components/customer-contact-information';
import { CustomerAddress } from '@/src/features/customers/components/customer-address';
import { CustomerHierarchy } from '@/src/features/customers/components/customer-hierarchy';
import { Button } from '@/src/components/ui/button';
import { ConfirmationDialog } from '@/src/components/ui/confirmation-dialog';
import { EmptyState } from '@/src/components/ui/empty-state';
import { SuccessAlert } from '@/src/components/ui/success-alert';
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

  const deleteStatus = useAppSelector(selectDeleteCustomerStatus);
  const deleteError = useAppSelector(selectDeleteCustomerError);
  const isDeleting = deleteStatus === 'loading';

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState('');
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);
  const successTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const deleteTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activeCustomerIdRef = useRef<string>(resolvedParams.id);
  const isNavigatingAwayRef = useRef<boolean>(false);
  const cachedCustomerRef = useRef<Customer | null>(null);

  if (customer) {
    cachedCustomerRef.current = customer;
  }
  const displayCustomer = customer || (showDeleteSuccess || isNavigatingAwayRef.current ? cachedCustomerRef.current : null);

  useEffect(() => {
    activeCustomerIdRef.current = resolvedParams.id;
    isNavigatingAwayRef.current = false;
    cachedCustomerRef.current = null;
    setPageError(null);
    setShowSuccessAlert(false);
    setShowDeleteSuccess(false);
    dispatch(resetDeleteState());
    // Clear the previous customer and fetch the new one
    dispatch(clearSelectedCustomer());
    if (resolvedParams.id) {
      dispatch(fetchCustomerById(resolvedParams.id));
      dispatch(fetchCustomerChildren(resolvedParams.id));
    }
  }, [dispatch, resolvedParams.id]);

  useEffect(() => {
    return () => {
      activeCustomerIdRef.current = '';
      isNavigatingAwayRef.current = true;
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
      if (deleteTimeoutRef.current) {
        clearTimeout(deleteTimeoutRef.current);
      }
    };
  }, []);

  if (!displayCustomer && (status === 'loading' || status === 'idle')) {
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

  if (!displayCustomer && (status === 'failed' || (!customer && status === 'succeeded'))) {
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

  if (!displayCustomer) return null; // Safe fallback

  const handleUpdate = async (field: keyof Customer, value: string | boolean): Promise<boolean> => {
    if (!displayCustomer || !resolvedParams.id) return false;
    setPageError(null);

    // Contact management fields belong to Customer Contacts and are not integrated in this phase
    if (field === 'email' || field === 'phone' || field === 'alternativePhone') {
      const msg = 'Contact management (email and phone) is not integrated in this phase. Customer Contacts will be integrated in a later phase.';
      setPageError(msg);
      throw new Error(msg);
    }

    const targetId = displayCustomer.id;
    let payloadField: UpdateCustomerRequest = {};

    if (field === 'name') {
      const trimmed = typeof value === 'string' ? value.trim() : '';
      if (!trimmed) throw new Error('Customer name is required.');
      if (trimmed.length < 2) throw new Error('Customer name must be at least 2 characters.');
      if (trimmed.length > 150) throw new Error('Customer name must not exceed 150 characters.');
      payloadField = { name: trimmed };
    } else if (field === 'type') {
      if (!['COMPANY', 'GOVERNMENT', 'INDIVIDUAL', 'OTHER'].includes(value as string)) {
        throw new Error('Invalid customer type.');
      }
      payloadField = { type: value as CustomerType };
    } else if (field === 'status' || field === 'isActive') {
      const isActive = typeof value === 'boolean' ? value : value === 'Active';
      payloadField = { isActive };
    } else if (field === 'country') {
      const trimmed = typeof value === 'string' ? value.trim() : '';
      if (!trimmed) throw new Error('Country is required.');
      if (trimmed.length > 100) throw new Error('Country must not exceed 100 characters.');
      payloadField = { country: trimmed };
    } else if (field === 'city') {
      const trimmed = typeof value === 'string' ? value.trim() : '';
      if (!trimmed) throw new Error('City is required.');
      if (trimmed.length > 100) throw new Error('City must not exceed 100 characters.');
      payloadField = { city: trimmed };
    } else if (field === 'address') {
      const trimmed = typeof value === 'string' ? value.trim() : '';
      if (trimmed.length > 255) throw new Error('Address must not exceed 255 characters.');
      payloadField = { address: trimmed };
    } else {
      return false;
    }

    const payload: UpdateCustomerRequest = {
      ...payloadField,
    };

    const resultAction = await dispatch(updateCustomer({ id: targetId, payload }));

    // Prevent stale response from updating UI if navigating between customer IDs
    if (activeCustomerIdRef.current !== targetId) {
      return false;
    }

    if (updateCustomer.fulfilled.match(resultAction)) {
      const backendMessage = (resultAction.payload as any)?.message || 'Customer updated successfully.';
      setSuccessMessage(backendMessage);
      setShowSuccessAlert(true);
      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
      successTimeoutRef.current = setTimeout(() => {
        setShowSuccessAlert(false);
      }, 3000);
      return true;
    } else {
      const errorMsg =
        (resultAction.payload as string) ||
        resultAction.error?.message ||
        'Failed to update customer.';
      setPageError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const handleToggleStatus = async () => {
    if (!displayCustomer) return;
    setIsConfirmOpen(false);
    try {
      await handleUpdate('status', !displayCustomer.isActive);
    } catch {
      // Error handled inside handleUpdate
    }
  };

  const handleDeleteCustomer = async () => {
    if (!displayCustomer || isDeleting || isNavigatingAwayRef.current) return;
    const targetId = displayCustomer.id;

    const resultAction = await dispatch(deleteCustomer(targetId));

    if (deleteCustomer.fulfilled.match(resultAction)) {
      setIsDeleteDialogOpen(false);
      dispatch(resetDeleteState());
      const backendMsg = (resultAction.payload as any)?.message || 'Customer deleted successfully.';
      setDeleteSuccessMessage(backendMsg);
      setShowDeleteSuccess(true);
      isNavigatingAwayRef.current = true;
      if (deleteTimeoutRef.current) clearTimeout(deleteTimeoutRef.current);
      deleteTimeoutRef.current = setTimeout(() => {
        router.push('/customers');
      }, 1500);
    } else {
      const errorMsg =
        (resultAction.payload as string) ||
        resultAction.error?.message ||
        'Failed to delete customer.';
      throw new Error(errorMsg);
    }
  };

  const handleCloseDeleteDialog = (open: boolean) => {
    if (!open) {
      if (!isDeleting) {
        setIsDeleteDialogOpen(false);
        dispatch(resetDeleteState());
      }
    } else {
      setIsDeleteDialogOpen(true);
    }
  };

  const parentCustomer = displayCustomer.parentCustomerId 
    ? allCustomers.find(c => c.id === displayCustomer.parentCustomerId)
    : null;

  return (
    <div className="w-full mx-auto pb-8 min-w-0 mt-6">
      <SuccessAlert 
        show={showSuccessAlert} 
        title="Customer Updated" 
        description={successMessage} 
      />

      <SuccessAlert 
        show={showDeleteSuccess} 
        title="Customer Deleted" 
        description={deleteSuccessMessage} 
      />

      {pageError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex justify-between items-start">
          <div>
            <h3 className="font-medium text-sm">Failed to update customer</h3>
            <p className="text-sm mt-0.5">{pageError}</p>
          </div>
          <button 
            type="button" 
            onClick={() => setPageError(null)} 
            className="text-red-500 hover:text-red-700 ml-4 p-0.5"
            aria-label="Dismiss error"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <CustomerDetailsHeader 
        id={displayCustomer.id}
        name={displayCustomer.name} 
        code={displayCustomer.customerCode} 
        status={displayCustomer.isActive ? 'Active' : 'Inactive'} 
        onActivateToggle={() => setIsConfirmOpen(true)}
        onDelete={() => {
          dispatch(resetDeleteState());
          setIsDeleteDialogOpen(true);
        }}
        isDeleting={isDeleting}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mb-6">
        <CustomerOverview customer={displayCustomer} onUpdate={handleUpdate} />
        <CustomerContactInformation customer={displayCustomer} onUpdate={handleUpdate} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <CustomerAddress customer={displayCustomer} onUpdate={handleUpdate} />
        <CustomerHierarchy 
          customer={displayCustomer} 
          parentName={parentCustomer?.name}
          childrenList={childrenList}
          childrenStatus={childrenStatus}
        />
      </div>

      <ConfirmationDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title={displayCustomer.isActive ? 'Deactivate customer?' : 'Activate customer?'}
        description={`Are you sure you want to ${displayCustomer.isActive ? 'deactivate' : 'activate'} ${displayCustomer.name}?`}
        confirmLabel={displayCustomer.isActive ? 'Deactivate' : 'Activate'}
        variant={displayCustomer.isActive ? 'destructive' : 'primary'}
        onConfirm={handleToggleStatus}
      />

      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={handleCloseDeleteDialog}
        title="Delete customer?"
        description={
          deleteError ? (
            <div className="flex flex-col gap-2">
              <span className="text-red-600 font-medium">{deleteError}</span>
              <span className="text-neutral-500 text-xs">You may retry or cancel.</span>
            </div>
          ) : (
            `Are you sure you want to delete "${displayCustomer.name}" (${displayCustomer.customerCode})? This action cannot be undone.`
          )
        }
        confirmLabel={isDeleting ? 'Deleting...' : 'Delete Customer'}
        variant="destructive"
        onConfirm={handleDeleteCustomer}
        confirmDisabled={isDeleting}
      />
    </div>
  );
}
