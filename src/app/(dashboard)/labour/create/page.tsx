'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/src/components/ui/button';
import { ChevronLeft } from '@/src/components/ui/icons';
import { LabourForm } from '@/src/features/labour/components/labour-form';

export default function CreateLabourPage() {
  const router = useRouter();

  return (
    <div className="w-full mx-auto pb-12 min-w-0 max-w-4xl">
      <div className="flex flex-col gap-4 mb-8">
        <div>
          <Button 
            variant="ghost" 
            onClick={() => router.push('/labour')} 
            className="-ml-4 text-neutral-500"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Labour
          </Button>
        </div>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">Add Labour</h1>
          <p className="text-[15px] text-neutral-500 mt-1">Create a labour master record for your organization.</p>
        </div>
      </div>

      <LabourForm mode="create" />
    </div>
  );
}
