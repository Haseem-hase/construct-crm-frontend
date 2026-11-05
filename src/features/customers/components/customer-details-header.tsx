'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { PageHeader } from '@/src/components/ui/page-header';
import { User } from '@/src/components/ui/icons';
import { projectImageUrl } from '@/src/features/projects/utils/project-image';

interface CustomerDetailsHeaderProps {
  id?: string;
  name: string;
  code: string;
  status: 'Active' | 'Inactive';
  profileImageUrl?: string | null;
  onActivateToggle: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
}

export function CustomerDetailsHeader({ 
  id, 
  name, 
  code, 
  status, 
  profileImageUrl,
  onActivateToggle,
  onDelete,
  isDeleting = false,
}: CustomerDetailsHeaderProps) {
  const router = useRouter();

  return (
    <PageHeader 
      title={name}
      subtitle={code}
      badges={<Badge variant={status === 'Active' ? 'success' : 'neutral'}>{status}</Badge>}
      backLink={{ href: '/customers', label: 'Back to Customers' }}
      avatar={<div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-neutral-200 bg-neutral-100 md:h-24 md:w-24">{profileImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={projectImageUrl(profileImageUrl) || profileImageUrl} alt={`${name} profile`} className="h-full w-full object-cover" />
      ) : <User className="h-8 w-8 text-neutral-400" />}</div>}
      action={
        <div className="flex flex-col sm:flex-row gap-2">
          {onDelete && (
            <Button 
              onClick={onDelete} 
              variant="outline" 
              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-neutral-200"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Customer'}
            </Button>
          )}
          <Button onClick={() => router.push(`/customers/${id || code.toLowerCase()}/edit`)} variant="outline" disabled={isDeleting}>
            Edit Customer
          </Button>
          <Button 
            onClick={onActivateToggle} 
            variant={status === 'Active' ? 'destructive' : 'primary'}
            disabled={isDeleting}
          >
            {status === 'Active' ? 'Deactivate' : 'Activate'}
          </Button>
        </div>
      }
    />
  );
}
