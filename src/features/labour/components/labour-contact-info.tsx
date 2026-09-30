import React from 'react';
import { Labour } from '../types/labour.types';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { InlineEdit } from '@/src/components/ui/inline-edit';

interface LabourContactInfoProps {
  labour: Labour;
  onUpdate?: (updates: Partial<Labour>) => void;
}

export function LabourContactInfo({ labour, onUpdate }: LabourContactInfoProps) {
  const handleSave = (field: keyof Labour, value: string, required: boolean = false) => {
    if (required && !value.trim()) return false;
    if (field === 'email' && value.trim()) {
      if (!/^\S+@\S+\.\S+$/.test(value.trim())) return false;
    }
    onUpdate?.({ [field]: value });
    return true;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-neutral-500">Phone</span>
            <div className="text-[15px] text-neutral-900">
              <InlineEdit
                value={labour.phone}
                onSave={(v) => handleSave('phone', v, true)}
                editor="text"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-neutral-500">Email</span>
            <div className="text-[15px] text-neutral-900">
              <InlineEdit
                value={labour.email || ''}
                displayValue={
                  labour.email ? (
                    <a href={`mailto:${labour.email}`} className="text-blue-600 hover:underline">
                      {labour.email}
                    </a>
                  ) : (
                    <span className="text-neutral-400 italic">Not provided</span>
                  )
                }
                onSave={(v) => handleSave('email', v)}
                editor="text"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-neutral-500">Emergency Contact Name</span>
            <div className="text-[15px] text-neutral-900">
              <InlineEdit
                value={labour.emergencyContactName || ''}
                displayValue={
                  labour.emergencyContactName ? (
                    labour.emergencyContactName
                  ) : (
                    <span className="text-neutral-400 italic">Not provided</span>
                  )
                }
                onSave={(v) => handleSave('emergencyContactName', v)}
                editor="text"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-neutral-500">Emergency Contact Phone</span>
            <div className="text-[15px] text-neutral-900">
              <InlineEdit
                value={labour.emergencyContactPhone || ''}
                displayValue={
                  labour.emergencyContactPhone ? (
                    labour.emergencyContactPhone
                  ) : (
                    <span className="text-neutral-400 italic">Not provided</span>
                  )
                }
                onSave={(v) => handleSave('emergencyContactPhone', v)}
                editor="text"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
