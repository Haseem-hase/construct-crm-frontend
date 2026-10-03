'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { PageHeader } from '@/src/components/ui/page-header';

interface CustomerDetailsHeaderProps {
  name: string;
  code: string;
  status: 'Active' | 'Inactive';
  onActivateToggle: () => void;
}

export function CustomerDetailsHeader({ name, code, status, onActivateToggle }: CustomerDetailsHeaderProps) {
  const router = useRouter();

  return (
    <PageHeader 
      title={name}
      subtitle={code}
      badges={<Badge variant={status === 'Active' ? 'success' : 'neutral'}>{status}</Badge>}
      backLink={{ href: '/customers', label: 'Back to Customers' }}
      action={
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={() => router.push(`/customers/${code.toLowerCase()}/edit`)} variant="outline">
            Edit Customer
          </Button>
          <Button 
            onClick={onActivateToggle} 
            variant={status === 'Active' ? 'destructive' : 'primary'}
          >
            {status === 'Active' ? 'Deactivate' : 'Activate'}
          </Button>
        </div>
      }
    />
  );
}
