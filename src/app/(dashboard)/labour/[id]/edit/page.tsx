'use client';

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { mockLabour } from '@/src/features/labour/data/labour.mock';
import { LabourForm } from '@/src/features/labour/components/labour-form';
import { Button } from '@/src/components/ui/button';
import { ChevronLeft } from '@/src/components/ui/icons';

export default function EditLabourPage() {
  const params = useParams();
  const router = useRouter();
  const labourId = params?.id as string;

  const labour = useMemo(() => {
    return mockLabour.find(l => l.id === labourId);
  }, [labourId]);

  if (!labour) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 px-4">
        <h3 className="text-xl font-medium text-neutral-900 mb-2">Labour Not Found</h3>
        <p className="text-neutral-500 mb-6 text-center max-w-md">
          We couldn&apos;t find the labour record you were looking for. It may have been removed or the link is incorrect.
        </p>
        <Button onClick={() => router.push('/labour')}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Labour
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto pb-12 min-w-0 max-w-4xl">
      <div className="flex flex-col gap-4 mb-8">
        <div>
          <Button 
            variant="ghost" 
            onClick={() => router.push(`/labour/${labour.id}`)} 
            className="-ml-4 text-neutral-500"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Labour Details
          </Button>
        </div>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">Edit Labour</h1>
          <p className="text-[15px] text-neutral-500 mt-1">Update information for {labour.fullName}.</p>
        </div>
      </div>

      <LabourForm mode="edit" initialData={labour} />
    </div>
  );
}
