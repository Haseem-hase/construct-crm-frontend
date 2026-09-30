import React from 'react';
import { Labour } from '../types/labour.types';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';

interface LabourLocationProps {
  labour: Labour;
}

export function LabourLocation({ labour }: LabourLocationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Location</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-y-6">
          <div className="grid grid-cols-2 gap-x-8">
            <div>
              <p className="text-sm font-medium text-neutral-500 mb-1">Country</p>
              <p className="text-[15px] text-neutral-900">{labour.country}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500 mb-1">City</p>
              <p className="text-[15px] text-neutral-900">{labour.city}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500 mb-1">Address</p>
            <p className="text-[15px] text-neutral-900">
              {labour.address ? (
                labour.address
              ) : (
                <span className="text-neutral-400 italic">Not provided</span>
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
