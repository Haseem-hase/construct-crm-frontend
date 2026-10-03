import React from 'react';
import { Card, CardContent } from '@/src/components/ui/card';
import { LabourAssignment } from '../types/labour-assignment.types';

interface LabourAssignmentRelationshipProps {
  assignment: LabourAssignment;
}

export function LabourAssignmentRelationship({ assignment }: LabourAssignmentRelationshipProps) {
  return (
    <Card className="mb-8 border-neutral-200 shadow-sm overflow-hidden bg-neutral-50/50">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row items-stretch relative">
          
          {/* Labour Side */}
          <div className="flex-1 p-8 w-full flex flex-col justify-center">
            <div className="flex flex-col gap-1">
              <span className="text-[13px] font-medium text-neutral-500 uppercase tracking-wide">Labour</span>
              <div className="text-xl font-semibold text-neutral-900 mt-1">{assignment.labourName}</div>
              <div className="text-[15px] text-neutral-700">{assignment.professionName}</div>
              <div className="font-mono text-[14px] text-neutral-500 mt-1">{assignment.labourPhone}</div>
            </div>
          </div>

          {/* Divider Arrow 1 */}
          <div className="relative flex items-center justify-center w-full md:w-auto self-stretch">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-[1px] md:w-[1px] md:h-full bg-neutral-200"></div>
            </div>
            <div className="relative bg-white px-3 py-1 rounded-full border border-neutral-200 text-neutral-400 shadow-sm z-10 hidden md:block">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div className="relative bg-white px-3 py-1 rounded-full border border-neutral-200 text-neutral-400 shadow-sm z-10 md:hidden">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Contractor Side */}
          <div className="flex-1 p-8 w-full flex flex-col justify-center">
            <div className="flex flex-col gap-1">
              <span className="text-[13px] font-medium text-neutral-500 uppercase tracking-wide">Contractor</span>
              <div className="text-xl font-semibold text-neutral-900 mt-1">{assignment.contractorName}</div>
              <div className="font-mono text-[14px] text-neutral-600 mt-1">{assignment.contractorCode}</div>
            </div>
          </div>
          
          {/* Divider Arrow 2 */}
          <div className="relative flex items-center justify-center w-full md:w-auto self-stretch">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-[1px] md:w-[1px] md:h-full bg-neutral-200"></div>
            </div>
            <div className="relative bg-white px-3 py-1 rounded-full border border-neutral-200 text-neutral-400 shadow-sm z-10 hidden md:block">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div className="relative bg-white px-3 py-1 rounded-full border border-neutral-200 text-neutral-400 shadow-sm z-10 md:hidden">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Project Side */}
          <div className="flex-1 p-8 w-full flex flex-col justify-center">
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
