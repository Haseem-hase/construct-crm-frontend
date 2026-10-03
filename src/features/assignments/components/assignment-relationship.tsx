import React from 'react';
import { Card, CardContent } from '@/src/components/ui/card';
import { Assignment } from '../types/assignment.types';

interface AssignmentRelationshipProps {
  assignment: Assignment;
}

export function AssignmentRelationship({ assignment }: AssignmentRelationshipProps) {
  return (
    <Card className="mb-8 border-neutral-200 shadow-sm overflow-hidden bg-neutral-50/50">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row items-center relative">
          
          {/* Contractor Side */}
          <div className="flex-1 p-8 w-full">
            <div className="flex flex-col gap-1">
              <span className="text-[13px] font-medium text-neutral-500 uppercase tracking-wide">Contractor</span>
              <div className="text-xl font-semibold text-neutral-900 mt-1">{assignment.contractorName}</div>
              <div className="font-mono text-[14px] text-neutral-600 mt-1">{assignment.contractorCode}</div>
            </div>
          </div>
          
          {/* Divider & Assigned To Badge */}
          <div className="relative flex items-center justify-center w-full md:w-auto self-stretch">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-[1px] md:w-[1px] md:h-full bg-neutral-200"></div>
            </div>
            <div className="relative bg-white px-4 py-1 rounded-full border border-neutral-200 text-xs font-medium text-neutral-500 uppercase tracking-wider shadow-sm z-10 whitespace-nowrap">
              Assigned to
            </div>
          </div>

          {/* Project Side */}
          <div className="flex-1 p-8 w-full">
            <div className="flex flex-col gap-1">
              <span className="text-[13px] font-medium text-neutral-500 uppercase tracking-wide">Project</span>
              <div className="text-xl font-semibold text-neutral-900 mt-1">{assignment.projectName}</div>
              <div className="font-mono text-[14px] text-neutral-600 mt-1">{assignment.projectCode}</div>
            </div>
          </div>
          
        </div>
      </CardContent>
    </Card>
  );
}
