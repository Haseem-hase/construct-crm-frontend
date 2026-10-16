import React from 'react';
import { useRouter } from 'next/navigation';
import { ApiContractor, ApiContractorStatus } from '../types/contractor.types';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { User } from '@/src/components/ui/icons';
import { PageHeader } from '@/src/components/ui/page-header';

interface ContractorDetailsHeaderProps {
  contractor: ApiContractor;
}

function getStatusVariant(status: ApiContractorStatus): 'default' | 'success' | 'warning' | 'destructive' | 'info' | 'neutral' {
  switch (status) {
    case 'ACTIVE':
      return 'success';
    case 'PENDING':
      return 'warning';
    case 'SUSPENDED':
      return 'destructive';
    case 'INACTIVE':
      return 'neutral';
    case 'TERMINATED':
      return 'destructive';
    default:
      return 'default';
  }
}

export function ContractorDetailsHeader({ contractor }: ContractorDetailsHeaderProps) {
  const router = useRouter();

  return (
    <PageHeader
      title={contractor.fullName}
      subtitle={contractor.contractorCode}
      badges={
        <Badge variant={getStatusVariant(contractor.status)}>
          {contractor.status}
        </Badge>
      }
      backLink={{ href: '/contractors', label: 'Back to Contractors' }}
      avatar={
        <div className="w-[72px] h-[72px] md:w-[96px] md:h-[96px] shrink-0 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center overflow-hidden">
          {contractor.profileImageUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={contractor.profileImageUrl}
              alt={`${contractor.fullName} profile`}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-8 h-8 md:w-10 md:h-10 text-neutral-400" />
          )}
        </div>
      }
      action={
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => router.push(`/contractors/${contractor.id}/edit`)}
          >
            Edit Contractor
          </Button>
        </div>
      }
    />
  );
}
