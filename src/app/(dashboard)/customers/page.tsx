'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { CustomerPageHeader } from '@/src/features/customers/components/customer-page-header';
import { CustomerFilters } from '@/src/features/customers/components/customer-filters';
import { CustomerTable } from '@/src/features/customers/components/customer-table';
import { CustomerType, CustomerStatus } from '@/src/features/customers/types/customer.types';
import { Pagination } from '@/src/components/ui/pagination';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { fetchCustomers, updateCustomer, selectCustomers, selectCustomersListStatus, selectCustomersListError } from '@/src/features/customers/store/customersSlice';
import { Button } from '@/src/components/ui/button';
import { SuccessAlert } from '@/src/components/ui/success-alert';
import { useAuth } from '@/src/features/auth/context/use-auth';

const ITEMS_PER_PAGE = 10;

export default function CustomersPage() {
  const { user } = useAuth();
  const readOnly = user?.systemRole === 'SUPER_ADMIN';
  const dispatch = useAppDispatch();
  const customers = useAppSelector(selectCustomers);
  const status = useAppSelector(selectCustomersListStatus);
  const error = useAppSelector(selectCustomersListError);

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<CustomerType | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | 'ALL'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCustomers());
    }
  }, [status, dispatch]);

  const handleReset = () => {
    setSearchQuery('');
    setTypeFilter('ALL');
    setStatusFilter('ALL');
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleTypeFilterChange = (val: CustomerType | 'ALL') => {
    setTypeFilter(val);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (val: CustomerStatus | 'ALL') => {
    setStatusFilter(val);
    setCurrentPage(1);
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      // Status filter
      if (statusFilter !== 'ALL') {
        const isActiveStr = customer.isActive ? 'Active' : 'Inactive';
        if (isActiveStr !== statusFilter) {
          return false;
        }
      }
      
      // Type filter
      if (typeFilter !== 'ALL' && customer.type !== typeFilter) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          customer.name.toLowerCase().includes(query) ||
          customer.customerCode.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [searchQuery, typeFilter, statusFilter, customers]);

  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const alertTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
    };
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: CustomerStatus): Promise<void> => {
    setActionError(null);
    const isActive = newStatus === 'Active';
    const resultAction = await dispatch(updateCustomer({ id, payload: { isActive } }));

    if (updateCustomer.fulfilled.match(resultAction)) {
      const msg = resultAction.payload?.message || `Customer status updated to ${newStatus}.`;
      setSuccessMessage(msg);
      setShowSuccessAlert(true);
      if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
      alertTimeoutRef.current = setTimeout(() => {
        setShowSuccessAlert(false);
      }, 3000);
    } else {
      const errorMsg =
        (resultAction.payload as string) ||
        resultAction.error?.message ||
        'Failed to update customer status.';
      setActionError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE));
  
  // Ensure current page is valid after filtering
  const validCurrentPage = Math.min(currentPage, totalPages);
  
  if (currentPage !== validCurrentPage && validCurrentPage > 0) {
    setCurrentPage(validCurrentPage);
  }

  const paginatedCustomers = useMemo(() => {
    const start = (validCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredCustomers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCustomers, validCurrentPage]);

  return (
    <div className="w-full mx-auto pb-12 min-w-0">
      <CustomerPageHeader readOnly={readOnly} />

      <SuccessAlert 
        show={showSuccessAlert} 
        title="Customer Status Updated" 
        description={successMessage} 
      />

      {actionError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex justify-between items-start">
          <div>
            <h3 className="font-medium text-sm">Failed to update status</h3>
            <p className="text-sm mt-0.5">{actionError}</p>
          </div>
          <button 
            type="button" 
            onClick={() => setActionError(null)} 
            className="text-red-500 hover:text-red-700 ml-4 p-0.5"
            aria-label="Dismiss error"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      
      {status === 'loading' || status === 'idle' ? (
        <div className="flex flex-col items-center justify-center py-16 text-neutral-500 bg-white border border-neutral-200 rounded-lg">
          <svg className="w-8 h-8 animate-spin mb-4 text-neutral-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p>Loading customers...</p>
        </div>
      ) : status === 'failed' ? (
        <div className="p-6 text-center bg-red-50 border border-red-200 rounded-lg text-red-700">
          <h3 className="text-lg font-medium mb-2">Error Loading Customers</h3>
          <p className="mb-4">{error}</p>
          <Button 
            variant="outline" 
            className="bg-white hover:bg-red-50 text-red-700 border-red-200 hover:border-red-300"
            onClick={() => dispatch(fetchCustomers())}
          >
            Retry
          </Button>
        </div>
      ) : (
        <>
          <CustomerFilters 
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            typeFilter={typeFilter}
            onTypeFilterChange={handleTypeFilterChange}
            statusFilter={statusFilter}
            onStatusFilterChange={handleStatusFilterChange}
            onReset={handleReset}
          />
          
          <CustomerTable 
            customers={paginatedCustomers} 
            allCustomers={customers}
            onClearFilters={handleReset}
            onUpdateStatus={handleUpdateStatus}
            currentPage={validCurrentPage}
            itemsPerPage={ITEMS_PER_PAGE}
        readOnly={readOnly}
          />

          {/* Pagination UI */}
          {filteredCustomers.length > 0 && (
            <Pagination
              className="mt-6"
              currentPage={validCurrentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredCustomers.length}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          )}
        </>
      )}
    </div>
  );
}
