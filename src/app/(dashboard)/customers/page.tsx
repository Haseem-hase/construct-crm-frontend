'use client';

import React, { useState, useMemo } from 'react';
import { CustomerPageHeader } from '@/src/features/customers/components/customer-page-header';
import { CustomerFilters } from '@/src/features/customers/components/customer-filters';
import { CustomerTable } from '@/src/features/customers/components/customer-table';
import { mockCustomers } from '@/src/features/customers/data/customers.mock';
import { CustomerType, CustomerStatus } from '@/src/features/customers/types/customer.types';
import { Pagination } from '@/src/components/ui/pagination';

const ITEMS_PER_PAGE = 10;

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<CustomerType | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | 'ALL'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [localCustomers, setLocalCustomers] = useState(mockCustomers);

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
    return localCustomers.filter(customer => {
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
  }, [searchQuery, typeFilter, statusFilter, localCustomers]);

  const handleUpdateStatus = (id: string, newStatus: CustomerStatus) => {
    setLocalCustomers(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
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
        allCustomers={localCustomers}
        onClearFilters={handleReset}
        onUpdateStatus={handleUpdateStatus}
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
    </div>
  );
}