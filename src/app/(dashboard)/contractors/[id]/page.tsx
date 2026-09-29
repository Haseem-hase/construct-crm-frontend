import React from 'react';
import Link from 'next/link';
import { mockContractors } from '@/src/features/contractors/data/contractors.mock';
import { ContractorDetailsClient } from '@/src/features/contractors/components/contractor-details-client';

export default async function ContractorDetailsPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  // Await params to support Next.js 15+ where params is a Promise
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

  return <ContractorDetailsClient initialContractor={contractor} />;
}
