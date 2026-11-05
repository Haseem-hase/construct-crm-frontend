import React from 'react';
import { useRouter } from 'next/navigation';
import { ApiContractor, ApiContractorStatus } from '../types/contractor.types';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Card } from '@/src/components/ui/card';
import { Pagination } from '@/src/components/ui/pagination';
import { User } from '@/src/components/ui/icons';
import { projectImageUrl } from '@/src/features/projects/utils/project-image';

interface ContractorGridProps {
  contractors: ApiContractor[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  readOnly?: boolean;
}

function statusVariant(status: ApiContractorStatus): 'default' | 'success' | 'warning' | 'destructive' | 'info' | 'neutral' {
  if (status === 'ACTIVE') return 'success';
  if (status === 'PENDING') return 'warning';
  if (status === 'INACTIVE') return 'neutral';
  return 'destructive';
}

function formatDate(value?: string | null) {
  if (!value) return 'Not provided';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Not provided' : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function ContractorGrid({ contractors, currentPage, totalPages, onPageChange, readOnly = false }: ContractorGridProps) {
  const router = useRouter();
  if (!contractors.length) return <Card className="py-16 text-center text-sm text-neutral-500">No contractors found. Try adjusting your search or filters.</Card>;

  return (
    <div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {contractors.map((contractor) => {
          const image = projectImageUrl(contractor.profileImageUrl);
          return (
            <Card key={contractor.id} className="overflow-hidden border-neutral-200 transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between gap-4 bg-neutral-50 p-5">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-neutral-200 bg-white">
                    {image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={image} alt={`${contractor.fullName} profile`} className="h-full w-full object-cover" />
                    ) : <User className="h-6 w-6 text-neutral-400" />}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold text-neutral-900" title={contractor.fullName}>{contractor.fullName}</p>
                    <p className="mt-1 font-mono text-xs text-neutral-500">{contractor.contractorCode}</p>
                  </div>
                </div>
                <Badge variant={statusVariant(contractor.status)}>{contractor.status.replaceAll('_', ' ')}</Badge>
              </div>
              <div className="space-y-3 p-5 text-sm">
                <div className="flex justify-between gap-3"><span className="text-neutral-500">Phone</span><span className="text-right font-medium text-neutral-800">{contractor.phone}</span></div>
                <div className="flex justify-between gap-3"><span className="text-neutral-500">Email</span><span className="max-w-[65%] truncate text-right font-medium text-neutral-800" title={contractor.email || ''}>{contractor.email || 'Not provided'}</span></div>
                <div className="flex justify-between gap-3"><span className="text-neutral-500">Location</span><span className="text-right font-medium text-neutral-800">{[contractor.city, contractor.country].filter(Boolean).join(', ') || '—'}</span></div>
                <div className="flex justify-between gap-3 border-t border-neutral-100 pt-3"><span className="text-neutral-500">License expiry</span><span className="text-right font-medium text-neutral-800">{formatDate(contractor.licenseExpiryDate)}</span></div>
                {contractor.organization?.name && <p className="truncate border-t border-neutral-100 pt-3 text-xs text-neutral-500" title={contractor.organization.name}>{contractor.organization.name}</p>}
                <div className="flex justify-end gap-2 border-t border-neutral-100 pt-3">
                  <Button size="sm" variant="ghost" onClick={() => router.push(`/contractors/${contractor.id}`)}>View</Button>
                  {!readOnly && <Button size="sm" variant="outline" onClick={() => router.push(`/contractors/${contractor.id}/edit`)}>Edit</Button>}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      {totalPages > 1 && <div className="mt-6 flex justify-end"><Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} /></div>}
    </div>
  );
}
