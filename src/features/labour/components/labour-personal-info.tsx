import React from 'react';
import { Labour } from '../types/labour.types';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { InlineEdit } from '@/src/components/ui/inline-edit';
import { LABOUR_PROFESSIONS } from '../data/labour-options';

interface LabourPersonalInfoProps {
  labour: Labour;
  onUpdate?: (updates: Partial<Labour>) => void;
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

export function LabourPersonalInfo({ labour, onUpdate }: LabourPersonalInfoProps) {
  const professionOptions = [
    { value: '', label: 'Select profession' },
    ...LABOUR_PROFESSIONS
  ];

  const handleSave = (field: keyof Labour, value: string, required: boolean = false) => {
    if (required && !value.trim()) return false;
    // For date of birth and joining date, validate not in future
    if (field === 'dateOfBirth' || field === 'joiningDate') {
      const today = new Date().toISOString().split('T')[0];
      if (value && value > today) {
        return false;
      }
    }
    onUpdate?.({ [field]: value });
    return true;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-neutral-500">Full Name</span>
            <div className="text-[15px] text-neutral-900">
              <InlineEdit
                value={labour.fullName}
                onSave={(v) => handleSave('fullName', v, true)}
                editor="text"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-neutral-500">Profession</span>
            <div className="text-[15px] text-neutral-900">
              <InlineEdit
                value={labour.professionId}
                displayValue={labour.professionName}
                onSave={(v) => handleSave('professionId', v, true)}
                editor="select"
                options={professionOptions}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-neutral-500">Date of Birth</span>
            <div className="text-[15px] text-neutral-900">
              <InlineEdit
                value={labour.dateOfBirth?.split('T')[0] || ''}
                displayValue={formatDate(labour.dateOfBirth)}
                onSave={(v) => handleSave('dateOfBirth', v ? new Date(v).toISOString() : '')}
                editor="date"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-neutral-500">Joining Date</span>
            <div className="text-[15px] text-neutral-900">
              <InlineEdit
                value={labour.joiningDate?.split('T')[0] || ''}
                displayValue={formatDate(labour.joiningDate)}
                onSave={(v) => handleSave('joiningDate', v ? new Date(v).toISOString() : '')}
                editor="date"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-neutral-500">Status</span>
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
