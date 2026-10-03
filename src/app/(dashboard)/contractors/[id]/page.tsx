import React from 'react';
import Link from 'next/link';
import { mockContractors } from '@/src/features/contractors/data/contractors.mock';
import { ContractorDetailsClient } from '@/src/features/contractors/components/contractor-details-client';
import { EmptyState } from '@/src/components/ui/empty-state';
import { Button } from '@/src/components/ui/button';

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
      <div className="w-full mx-auto pb-12 min-w-0 max-w-5xl">
        <EmptyState 
          title="Contractors Not Found"
          description="The contractors you are looking for does not exist or has been removed."
          action={
            <Link href="/contractors">
              <Button variant="outline">
                Back to Contractors
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return <ContractorDetailsClient initialContractor={contractor} />;
}
