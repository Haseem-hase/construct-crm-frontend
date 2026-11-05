import React from 'react';
import { useRouter } from 'next/navigation';
import { Labour } from '../types/labour.types';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Card } from '@/src/components/ui/card';
import { Pagination } from '@/src/components/ui/pagination';
import { User } from '@/src/components/ui/icons';
import { projectImageUrl } from '@/src/features/projects/utils/project-image';

interface LabourGridProps {
  labourData: Labour[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  readOnly?: boolean;
}

function formatDate(value?: string) {
  if (!value) return 'Not provided';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Not provided' : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function LabourGrid({ labourData, currentPage, totalPages, onPageChange, readOnly = false }: LabourGridProps) {
  const router = useRouter();
  if (!labourData.length) return <Card className="py-16 text-center text-sm text-neutral-500">No labour records found. Try adjusting your search or filters.</Card>;

  return (
    <div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {labourData.map((labour) => {
          const image = projectImageUrl(labour.profileImageUrl);
          return (
            <Card key={labour.id} className="overflow-hidden border-neutral-200 transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between gap-4 bg-neutral-50 p-5">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-neutral-200 bg-white">
                    {image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={image} alt={`${labour.fullName} profile`} className="h-full w-full object-cover" />
                    ) : <User className="h-6 w-6 text-neutral-400" />}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold text-neutral-900" title={labour.fullName}>{labour.fullName}</p>
                    <p className="mt-1 truncate text-xs text-neutral-500" title={labour.professionName}>{labour.professionName}</p>
                  </div>
                </div>
                <Badge variant={labour.status === 'ACTIVE' ? 'success' : 'neutral'}>{labour.status === 'ACTIVE' ? 'Active' : 'Inactive'}</Badge>
              </div>
              <div className="space-y-3 p-5 text-sm">
                <div className="flex justify-between gap-3"><span className="text-neutral-500">Phone</span><span className="text-right font-medium text-neutral-800">{labour.phone}</span></div>
                <div className="flex justify-between gap-3"><span className="text-neutral-500">Email</span><span className="max-w-[65%] truncate text-right font-medium text-neutral-800" title={labour.email || ''}>{labour.email || 'Not provided'}</span></div>
                <div className="flex justify-between gap-3"><span className="text-neutral-500">Location</span><span className="text-right font-medium text-neutral-800">{[labour.city, labour.country].filter(Boolean).join(', ') || '—'}</span></div>
                <div className="flex justify-between gap-3 border-t border-neutral-100 pt-3"><span className="text-neutral-500">Joined</span><span className="text-right font-medium text-neutral-800">{formatDate(labour.joiningDate)}</span></div>
                {labour.organizationName && <p className="truncate border-t border-neutral-100 pt-3 text-xs text-neutral-500" title={labour.organizationName}>{labour.organizationName}</p>}
                <div className="flex justify-end gap-2 border-t border-neutral-100 pt-3">
                  <Button size="sm" variant="ghost" onClick={() => router.push(`/labour/${labour.id}`)}>View</Button>
                  {!readOnly && <Button size="sm" variant="outline" onClick={() => router.push(`/labour/${labour.id}/edit`)}>Edit</Button>}
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
