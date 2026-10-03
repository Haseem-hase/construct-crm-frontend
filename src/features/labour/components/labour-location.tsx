import React from 'react';
import { Labour } from '../types/labour.types';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { InlineEdit } from '@/src/components/ui/inline-edit';
import { SAUDI_CITIES } from '../data/labour-options';

interface LabourLocationProps {
  labour: Labour;
  onUpdate?: (updates: Partial<Labour>) => void;
}

export function LabourLocation({ labour, onUpdate }: LabourLocationProps) {
  const cityOptions = [
    { value: '', label: 'Select city' },
    ...SAUDI_CITIES.map((c) => ({ value: c, label: c })),
  ];

  const handleSave = (field: keyof Labour, value: string, required: boolean = false) => {
    if (required && !value.trim()) return false;
    onUpdate?.({ [field]: value });
    return true;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Location</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-y-6">
          <div className="grid grid-cols-2 gap-x-8">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-neutral-500">Country</span>
              <div className="text-[15px] text-neutral-900 font-medium">
                <InlineEdit
                  value={labour.country}
                  onSave={(v) => handleSave('country', v, true)}
                  editor="text"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-neutral-500">City</span>
              <div className="text-[15px] text-neutral-900 font-medium">
                <InlineEdit
                  value={labour.city}
                  onSave={(v) => handleSave('city', v, true)}
                  editor="select"
                  options={cityOptions}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-neutral-500">Address</span>
            <div className="text-[15px] text-neutral-900 font-medium">
              <InlineEdit
                value={labour.address || ''}
                displayValue={
                  labour.address ? (
                    labour.address
                  ) : (
                    <span className="text-neutral-400 italic">Not provided</span>
                  )
                }
                onSave={(v) => handleSave('address', v)}
                editor="textarea"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
