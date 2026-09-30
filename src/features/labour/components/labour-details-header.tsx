import React from 'react';
import { useRouter } from 'next/navigation';
import { Labour } from '../types/labour.types';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { User, ChevronLeft } from '@/src/components/ui/icons';

interface LabourDetailsHeaderProps {
  labour: Labour;
}

export function LabourDetailsHeader({ labour }: LabourDetailsHeaderProps) {
  const router = useRouter();

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'INACTIVE': return 'neutral';
      default: return 'default';
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        {/* Profile Image Section */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-[72px] h-[72px] md:w-[96px] md:h-[96px] shrink-0 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center overflow-hidden">
            {labour.profileImageUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img 
                src={labour.profileImageUrl} 
                alt={`${labour.fullName} profile`} 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 md:w-10 md:h-10 text-neutral-400" />
            )}
          </div>
        </div>

        {/* Identity Details */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl md:text-3xl font-semibold text-neutral-900 leading-tight">
            {labour.fullName}
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-md">
              {labour.professionName}
            </span>
            <Badge variant={getStatusVariant(labour.status)}>
              {labour.status === 'ACTIVE' ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
        <Button 
          variant="outline" 
          className="w-full sm:w-auto"
          onClick={() => router.push('/labour')}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button 
          variant="outline"
          className="w-full sm:w-auto"
          onClick={() => router.push(`/labour/${labour.id}/edit`)}
        >
          Edit Labour
        </Button>
      </div>
    </div>
  );
}
