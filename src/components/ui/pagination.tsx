import React from 'react';
import { Button } from './button';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  className = '',
}: PaginationProps) {
  if (totalPages <= 1 && !totalItems) {
    return null;
  }

  // Calculate start and end records if totalItems and itemsPerPage are provided
  let startRecord = 0;
  let endRecord = 0;
  if (totalItems !== undefined && itemsPerPage !== undefined) {
    startRecord = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    endRecord = Math.min(currentPage * itemsPerPage, totalItems);
  }

  // Generate page numbers with ellipses
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-neutral-600 ${className}`}>
      {totalItems !== undefined && itemsPerPage !== undefined ? (
        <div>
          Showing <span className="font-medium text-neutral-900">{startRecord}</span> to <span className="font-medium text-neutral-900">{endRecord}</span> of <span className="font-medium text-neutral-900">{totalItems}</span> results
        </div>
      ) : (
        <div /> // Spacer if no results text
      )}

      <div className="flex flex-wrap items-center justify-center gap-1">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          aria-label="Previous page"
        >
          Previous
        </Button>

        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="px-2 text-neutral-400">
                &hellip;
              </span>
            );
          }
          const pageNumber = page as number;
          const isActive = currentPage === pageNumber;
          return (
            <Button
              key={pageNumber}
              variant={isActive ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onPageChange(pageNumber)}
              aria-current={isActive ? 'page' : undefined}
              className={`w-8 px-0 hidden sm:inline-flex ${isActive ? '' : 'text-neutral-600'}`}
            >
              {pageNumber}
            </Button>
          );
        })}

        {/* Mobile simplified page indicator */}
        <div className="sm:hidden flex items-center px-2 font-medium text-neutral-900">
          {currentPage} / {totalPages}
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          aria-label="Next page"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
