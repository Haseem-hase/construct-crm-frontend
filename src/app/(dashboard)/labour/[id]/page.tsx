'use client';

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { mockLabour } from '@/src/features/labour/data/labour.mock';
import { LabourDetailsHeader } from '@/src/features/labour/components/labour-details-header';
import { LabourPersonalInfo } from '@/src/features/labour/components/labour-personal-info';
import { LabourContactInfo } from '@/src/features/labour/components/labour-contact-info';
import { LabourLocation } from '@/src/features/labour/components/labour-location';
import { LabourAdditionalInfo } from '@/src/features/labour/components/labour-additional-info';
import { Button } from '@/src/components/ui/button';
import { ChevronLeft } from '@/src/components/ui/icons';

export default function LabourDetailsPage() {
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
    <div className="flex flex-col max-w-6xl mx-auto pb-16">
      <LabourDetailsHeader labour={labour} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <LabourPersonalInfo labour={labour} />
          <LabourContactInfo labour={labour} />
        </div>
        
        <div className="lg:col-span-1 flex flex-col gap-8">
          <LabourLocation labour={labour} />
          <LabourAdditionalInfo labour={labour} />
        </div>
      </div>
    </div>
  );
}
