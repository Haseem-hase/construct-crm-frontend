import React from 'react';
import { Assignment } from '../types/assignment.types';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';

interface AssignmentResponsibilitiesProps {
  assignment: Assignment;
}

export function AssignmentResponsibilities({ assignment }: AssignmentResponsibilitiesProps) {
  const hasResponsibilities = assignment.responsibilityNames && assignment.responsibilityNames.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Responsibilities</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasResponsibilities ? (
          <div className="text-[15px] text-neutral-400 italic">
            Not specified
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {assignment.responsibilityNames.map((name, index) => (
              <Badge key={index} variant="default" className="bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border-transparent">
                {name}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
