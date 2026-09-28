'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';

interface CustomerDetailsHeaderProps {
  name: string;
  code: string;
  status: 'Active' | 'Inactive';
  onActivateToggle: () => void;
}

export function CustomerDetailsHeader({ name, code, status, onActivateToggle }: CustomerDetailsHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
      <div className="min-w-0 flex flex-col gap-4">
        <div>
          <Button variant="ghost" onClick={() => router.push('/customers')} className="-ml-4 text-neutral-500">
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Customers
          </Button>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 truncate">{name}</h1>
          <span className="text-sm font-mono text-neutral-500 mt-1">{code}</span>
          <div className="mt-1">
            <Badge variant={status === 'Active' ? 'success' : 'neutral'}>{status}</Badge>
          </div>
        </div>
      </div>
      <div className="shrink-0 sm:mt-10 flex flex-col sm:flex-row gap-2">
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
    </div>
  );
}
