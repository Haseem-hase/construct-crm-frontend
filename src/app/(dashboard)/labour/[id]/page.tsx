'use client';

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { mockLabour } from '@/src/features/labour/data/labour.mock';
import { LabourDetailsClient } from '@/src/features/labour/components/labour-details-client';
import { Button } from '@/src/components/ui/button';
import { ChevronLeft } from '@/src/components/ui/icons';
import { EmptyState } from '@/src/components/ui/empty-state';
import Link from 'next/link';

export default function LabourDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const labourId = params?.id as string;

  const labour = useMemo(() => {
    return mockLabour.find(l => l.id === labourId);
  }, [labourId]);

  if (!labour) {
    return (
      <div className="w-full mx-auto pb-12 min-w-0 max-w-5xl">
        <EmptyState 
          title="Labour Not Found"
          description="The labour you are looking for does not exist or has been removed."
          action={
            <Link href="/labour">
              <Button variant="outline">
                Back to Labour
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return <LabourDetailsClient initialLabour={labour} />;
}
