'use client';

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { mockLabour } from '@/src/features/labour/data/labour.mock';
import { LabourForm } from '@/src/features/labour/components/labour-form';
import { Button } from '@/src/components/ui/button';
import { ChevronLeft } from '@/src/components/ui/icons';
import { PageHeader } from '@/src/components/ui/page-header';
import { EmptyState } from '@/src/components/ui/empty-state';
import Link from 'next/link';

export default function EditLabourPage() {
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

  return (
    <div className="w-full mx-auto pb-12 min-w-0 max-w-4xl">
      <PageHeader 
        title="Edit Labour" 
        description={`Update information for ${labour.fullName}.`}
        backLink={{ href: `/labour/${labour.id}`, label: 'Back to Labour Details' }}
      />
      <LabourForm mode="edit" initialData={labour} />
    </div>
  );
}
