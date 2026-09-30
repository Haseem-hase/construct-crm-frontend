import React from 'react';
import { Labour } from '../types/labour.types';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';

interface LabourAdditionalInfoProps {
  labour: Labour;
}

export function LabourAdditionalInfo({ labour }: LabourAdditionalInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <p className="text-sm font-medium text-neutral-500 mb-1">Notes</p>
          <div className="text-[15px] text-neutral-900 whitespace-pre-wrap">
            {labour.notes ? (
              labour.notes
            ) : (
              <span className="text-neutral-400 italic">Not provided</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
