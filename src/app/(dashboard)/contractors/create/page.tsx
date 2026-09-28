'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/src/components/ui/button';
import { ContractorForm } from '@/src/features/contractors/components/contractor-form';

export default function CreateContractorPage() {
  const router = useRouter();

  return (
    <div className="w-full mx-auto pb-12 min-w-0 max-w-4xl">
      <div className="flex flex-col gap-2 mb-8">
        <Button 
          variant="ghost" 
          className="w-fit -ml-4 text-neutral-500 hover:text-neutral-900"
          onClick={() => router.push('/contractors')}
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Contractors
        </Button>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">Add Contractor</h1>
        <p className="text-[15px] text-neutral-500">Create a new contractor for your organization.</p>
      </div>

      <ContractorForm mode="create" />
    </div>
  );
}
