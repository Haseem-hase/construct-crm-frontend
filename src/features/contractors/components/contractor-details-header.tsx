'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Contractor } from '../types/contractor.types';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { User, ChevronLeft } from '@/src/components/ui/icons';

interface ContractorDetailsHeaderProps {
  contractor: Contractor;
}

export function ContractorDetailsHeader({ contractor }: ContractorDetailsHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        {/* Profile Image */}
        <div className="w-[72px] h-[72px] md:w-[96px] md:h-[96px] shrink-0 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center overflow-hidden">
          {contractor.profileImage ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img 
              src={contractor.profileImage} 
              alt={`${contractor.companyName} profile`} 
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-8 h-8 md:w-10 md:h-10 text-neutral-400" />
          )}
        </div>

        {/* Identity Details */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl md:text-3xl font-semibold text-neutral-900 leading-tight">
            {contractor.companyName}
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-md">
              {contractor.contractorCode}
            </span>
            <Badge variant={contractor.status === 'Active' ? 'success' : 'neutral'}>
              {contractor.status}
            </Badge>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        <Button 
          variant="outline" 
          className="flex-1 md:flex-none"
          onClick={() => router.push('/contractors')}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button 
          variant="primary"
          className="flex-1 md:flex-none"
          onClick={() => router.push(`/contractors/${contractor.id}/edit`)}
        >
          Edit Contractor
        </Button>
      </div>
    </div>
  );
}
