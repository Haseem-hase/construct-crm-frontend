'use client';

import React from 'react';
import { ApiContractor } from '../types/contractor.types';
import { ContractorDetailsHeader } from './contractor-details-header';
import { ContractorOverview } from './contractor-overview';
import { ContractorContactInfo } from './contractor-contact-info';
import { ContractorLocation } from './contractor-location';
import { ContractorLicense } from './contractor-license';

export function ContractorDetailsClient({ contractor }: { contractor: ApiContractor }) {
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
