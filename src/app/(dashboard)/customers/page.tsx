'use client';

import React, { useState, useMemo } from 'react';
import { CustomerPageHeader } from '@/src/features/customers/components/customer-page-header';
import { CustomerFilters } from '@/src/features/customers/components/customer-filters';
import { CustomerTable } from '@/src/features/customers/components/customer-table';
import { mockCustomers } from '@/src/features/customers/data/customers.mock';
import { CustomerType, CustomerStatus } from '@/src/features/customers/types/customer.types';
import { Button } from '@/src/components/ui/button';

const ITEMS_PER_PAGE = 10;

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<CustomerType | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | 'ALL'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);

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
    return mockCustomers.filter(customer => {
      // Status filter
      if (statusFilter !== 'ALL' && customer.status !== statusFilter) {
        return false;
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
          customer.customerCode.toLowerCase().includes(query) ||
          customer.email.toLowerCase().includes(query) ||
          customer.phone.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [searchQuery, typeFilter, statusFilter]);

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

  const startRecord = (validCurrentPage - 1) * ITEMS_PER_PAGE + 1;
  const endRecord = Math.min(validCurrentPage * ITEMS_PER_PAGE, filteredCustomers.length);

  return (
    <div className="w-full mx-auto pb-8 min-w-0">
      <CustomerPageHeader />
      
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
        allCustomers={mockCustomers}
        onClearFilters={handleReset}
      />

      {/* Pagination UI */}
      {filteredCustomers.length > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-neutral-600">
          <div>
            Showing <span className="font-medium text-neutral-900">{startRecord}</span> to <span className="font-medium text-neutral-900">{endRecord}</span> of <span className="font-medium text-neutral-900">{filteredCustomers.length}</span> results
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              disabled={validCurrentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <div className="flex items-center px-3 font-medium">
              Page {validCurrentPage} of {totalPages}
            </div>
            <Button 
              variant="outline" 
              size="sm"
              disabled={validCurrentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}