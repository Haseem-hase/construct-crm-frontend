'use client';

import React, { useState } from 'react';
import { Contractor } from '../types/contractor.types';
import { ContractorDetailsHeader } from './contractor-details-header';
import { ContractorOverview } from './contractor-overview';
import { ContractorContactInfo } from './contractor-contact-info';
import { ContractorLocation } from './contractor-location';
import { ContractorLicense } from './contractor-license';

export function ContractorDetailsClient({ initialContractor }: { initialContractor: Contractor }) {
  const [contractor, setContractor] = useState<Contractor>(initialContractor);

  const handleUpdate = (updates: Partial<Contractor>) => {
    setContractor(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <ContractorDetailsHeader contractor={contractor} onUpdate={handleUpdate} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ContractorOverview contractor={contractor} onUpdate={handleUpdate} />
        <ContractorContactInfo contractor={contractor} onUpdate={handleUpdate} />
        <ContractorLocation contractor={contractor} onUpdate={handleUpdate} />
        <ContractorLicense contractor={contractor} onUpdate={handleUpdate} />
      </div>
    </div>
  );
}
