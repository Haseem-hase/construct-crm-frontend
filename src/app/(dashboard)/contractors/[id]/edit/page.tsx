import React from 'react';
import Link from 'next/link';
import { mockContractors } from '@/src/features/contractors/data/contractors.mock';
import { ContractorForm } from '@/src/features/contractors/components/contractor-form';
import { ChevronLeft } from '@/src/components/ui/icons';

export default async function ContractorEditPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id || '';
  
  const contractor = mockContractors.find(
    (c) =>
      c.id === id ||
      (c.contractorCode && c.contractorCode.toLowerCase() === id.toLowerCase())
  );

  if (!contractor) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <h1 className="text-2xl font-semibold text-neutral-900">Contractor Not Found</h1>
        <p className="text-neutral-500">The contractor you are looking for does not exist or has been removed.</p>
        <Link href="/contractors" className="text-blue-600 hover:underline">
          Return to Contractors List
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 w-full">
      <div className="flex flex-col gap-2">
        <Link href={`/contractors/${id}`} className="text-sm font-medium text-neutral-500 hover:text-neutral-900 flex items-center w-fit mb-2">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Contractor
        </Link>
        <div className="flex items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-semibold text-neutral-900">Edit Contractor</h1>
          <span className="text-sm font-medium text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-md">
            {contractor.contractorCode}
          </span>
        </div>
      </div>

      <ContractorForm mode="edit" initialData={contractor} />
    </div>
  );
}
