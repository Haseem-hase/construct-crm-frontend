'use client';

import React, { useState } from 'react';
import { Assignment } from '../types/assignment.types';
import { AssignmentDetailsHeader } from './assignment-details-header';
import { AssignmentRelationship } from './assignment-relationship';
import { AssignmentOverview } from './assignment-overview';
import { AssignmentResponsibilities } from './assignment-responsibilities';
import { AssignmentWorkDetails } from './assignment-work-details';

export function AssignmentDetailsClient({ initialAssignment }: { initialAssignment: Assignment }) {
  const [assignment, setAssignment] = useState<Assignment>(initialAssignment);

  const handleUpdate = (updates: Partial<Assignment>) => {
    setAssignment(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="flex flex-col max-w-6xl mx-auto pb-16">
      <AssignmentDetailsHeader assignment={assignment} />
      <AssignmentRelationship assignment={assignment} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <AssignmentOverview assignment={assignment} onUpdate={handleUpdate} />
          <AssignmentWorkDetails assignment={assignment} onUpdate={handleUpdate} />
        </div>
        <div className="lg:col-span-1 flex flex-col gap-8">
          <AssignmentResponsibilities assignment={assignment} onUpdate={handleUpdate} />
        </div>
      </div>
    </div>
  );
}
