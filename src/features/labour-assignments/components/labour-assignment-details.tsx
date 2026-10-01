'use client';

import React from 'react';
import { LabourAssignment } from '../types/labour-assignment.types';
import { LabourAssignmentDetailsHeader } from './labour-assignment-details-header';
import { LabourAssignmentRelationship } from './labour-assignment-relationship';
import { LabourAssignmentOverview } from './labour-assignment-overview';
import { LabourAssignmentPeriod } from './labour-assignment-period';
import { LabourAssignmentWorkDetails } from './labour-assignment-work-details';

export function LabourAssignmentDetailsClient({ assignment }: { assignment: LabourAssignment }) {
  return (
    <div className="flex flex-col max-w-5xl mx-auto pb-16 w-full">
      <LabourAssignmentDetailsHeader assignment={assignment} />
      <LabourAssignmentRelationship assignment={assignment} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-8">
          <LabourAssignmentOverview assignment={assignment} />
          <LabourAssignmentPeriod assignment={assignment} />
        </div>
        <div className="flex flex-col gap-8">
          <LabourAssignmentWorkDetails assignment={assignment} />
        </div>
      </div>
    </div>
  );
}
