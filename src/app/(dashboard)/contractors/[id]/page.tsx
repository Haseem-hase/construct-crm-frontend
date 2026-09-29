import React from 'react';
import Link from 'next/link';
import { mockContractors } from '@/src/features/contractors/data/contractors.mock';
import { ContractorDetailsHeader } from '@/src/features/contractors/components/contractor-details-header';
import { ContractorOverview } from '@/src/features/contractors/components/contractor-overview';
import { ContractorContactInfo } from '@/src/features/contractors/components/contractor-contact-info';
import { ContractorLocation } from '@/src/features/contractors/components/contractor-location';
import { ContractorLicense } from '@/src/features/contractors/components/contractor-license';

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

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <ContractorDetailsHeader contractor={contractor} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ContractorOverview contractor={contractor} />
        <ContractorContactInfo contractor={contractor} />
        <ContractorLocation contractor={contractor} />
        <ContractorLicense contractor={contractor} />
      </div>
    </div>
  );
}
