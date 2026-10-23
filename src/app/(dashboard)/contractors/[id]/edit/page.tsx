'use client';

import React, { use, useEffect } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import {
  fetchContractorById,
  clearSelectedContractor,
  resetUpdateState,
  selectSelectedContractor,
  selectContractorDetailStatus,
  selectContractorDetailError,
} from '@/src/features/contractors/store/contractorsSlice';
import { ContractorForm } from '@/src/features/contractors/components/contractor-form';
import { PageHeader } from '@/src/components/ui/page-header';
import { EmptyState } from '@/src/components/ui/empty-state';
import { Button } from '@/src/components/ui/button';

export default function ContractorEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = 'then' in params ? use(params) : params;
  const id = resolvedParams?.id || '';

  const dispatch = useAppDispatch();
  const contractor = useAppSelector(selectSelectedContractor);
  const status = useAppSelector(selectContractorDetailStatus);
  const error = useAppSelector(selectContractorDetailError);

  useEffect(() => {
    dispatch(clearSelectedContractor());
    dispatch(resetUpdateState());
    if (id) {
      dispatch(fetchContractorById(id));
    }
  }, [id, dispatch]);

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-neutral-500 bg-white border border-neutral-200 rounded-lg max-w-4xl mx-auto mt-6">
        <svg
          className="w-8 h-8 animate-spin mb-4 text-neutral-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p>Loading contractor details...</p>
      </div>
    );
  }

  if (status === 'failed' || !contractor || contractor.id !== id) {
    return (
      <div className="w-full mx-auto pb-12 min-w-0 max-w-4xl mt-6">
        <EmptyState
          title="Contractor Not Found"
          description={
            error || 'The contractor you are looking for does not exist or has been removed.'
          }
          action={
            <div className="flex items-center gap-3">
              <Link href="/contractors">
                <Button variant="outline">Back to Contractors</Button>
              </Link>
              {status === 'failed' && (
                <Button onClick={() => dispatch(fetchContractorById(id))}>Retry</Button>
              )}
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto pb-12 min-w-0 max-w-4xl">
      <PageHeader
        title="Edit Contractor"
        description={contractor.contractorCode}
        backLink={{ href: `/contractors/${id}`, label: 'Back to Contractor' }}
      />
      <ContractorForm key={contractor.id} mode="edit" initialData={contractor} />
    </div>
  );
}

