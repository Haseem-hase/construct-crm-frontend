import React from 'react';
import { Labour } from '../types/labour.types';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';

interface LabourPersonalInfoProps {
  labour: Labour;
}

function formatDate(isoString?: string) {
  if (!isoString) return <span className="text-neutral-400 italic">Not provided</span>;
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function getStatusVariant(status: string): 'default' | 'success' | 'warning' | 'destructive' | 'info' | 'neutral' {
  switch (status) {
    case 'ACTIVE': return 'success';
    case 'INACTIVE': return 'neutral';
    default: return 'default';
  }
}

export function LabourPersonalInfo({ labour }: LabourPersonalInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
          <div>
            <p className="text-sm font-medium text-neutral-500 mb-1">Full Name</p>
            <p className="text-[15px] text-neutral-900">{labour.fullName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500 mb-1">Profession</p>
            <p className="text-[15px] text-neutral-900">{labour.professionName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500 mb-1">Date of Birth</p>
            <p className="text-[15px] text-neutral-900">
              {formatDate(labour.dateOfBirth)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500 mb-1">Joining Date</p>
            <p className="text-[15px] text-neutral-900">
              {formatDate(labour.joiningDate)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500 mb-1">Status</p>
            <div className="mt-1">
              <Badge variant={getStatusVariant(labour.status)}>
                {labour.status === 'ACTIVE' ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
