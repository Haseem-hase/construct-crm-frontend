import React from 'react';
import { Labour } from '../types/labour.types';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';

interface LabourContactInfoProps {
  labour: Labour;
}

export function LabourContactInfo({ labour }: LabourContactInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
          <div>
            <p className="text-sm font-medium text-neutral-500 mb-1">Phone</p>
            <p className="text-[15px] text-neutral-900">{labour.phone}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500 mb-1">Email</p>
            <p className="text-[15px] text-neutral-900">
              {labour.email ? (
                <a href={`mailto:${labour.email}`} className="text-blue-600 hover:underline">
                  {labour.email}
                </a>
              ) : (
                <span className="text-neutral-400 italic">Not provided</span>
              )}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500 mb-1">Emergency Contact Name</p>
            <p className="text-[15px] text-neutral-900">
              {labour.emergencyContactName ? (
                labour.emergencyContactName
              ) : (
                <span className="text-neutral-400 italic">Not provided</span>
              )}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500 mb-1">Emergency Contact Phone</p>
            <p className="text-[15px] text-neutral-900">
              {labour.emergencyContactPhone ? (
                labour.emergencyContactPhone
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
