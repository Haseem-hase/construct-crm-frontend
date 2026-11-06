import React from 'react';
import { Card } from '@/src/components/ui/card';
import { LabourAssignment } from '../types/labour-assignment.types';

interface LabourAssignmentRelationshipProps {
  assignment: LabourAssignment;
}

const nodeStyles = {
  labour: 'bg-emerald-50 text-emerald-700',
  contractor: 'bg-indigo-50 text-indigo-700',
  project: 'bg-sky-50 text-sky-700',
};

function RelationshipNode({ label, name, detail, code, kind }: { label: string; name: string; detail?: string; code: string; kind: keyof typeof nodeStyles }) {
  return (
    <div className="flex min-w-0 flex-1 items-start gap-4 rounded-xl border border-neutral-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:p-6">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${nodeStyles[kind]}`}>
        {kind === 'labour' ? (
          <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/></svg>
        ) : kind === 'contractor' ? (
          <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4"/><path d="M9 9v.01M9 12v.01M9 15v.01M16 13v.01M16 16v.01"/></svg>
        ) : (
          <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6M9 10h.01M15 10h.01"/></svg>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">{label}</p>
        <p className="mt-2 break-words text-base font-semibold leading-6 text-neutral-900 sm:text-lg">{name}</p>
        {detail && <p className="mt-1 text-sm text-neutral-600">{detail}</p>}
        <p className="mt-1.5 font-mono text-xs font-medium tracking-wide text-neutral-500">{code}</p>
      </div>
    </div>
  );
}

function RelationshipLink() {
  return (
    <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-400 shadow-sm">
      <svg aria-hidden="true" className="hidden h-4 w-4 md:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      <svg aria-hidden="true" className="h-4 w-4 md:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m18 9-6 6-6-6"/></svg>
    </div>
  );
}

export function LabourAssignmentRelationship({ assignment }: LabourAssignmentRelationshipProps) {
  return (
    <Card className="mb-8 overflow-hidden border-neutral-200 bg-gradient-to-br from-neutral-50 to-white p-5 shadow-sm sm:p-7">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-neutral-900">Assignment relationship</p>
          <p className="mt-1 text-xs text-neutral-500">How this worker is connected to the project</p>
        </div>
        <span className="hidden rounded-full border border-neutral-200 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-500 sm:inline-flex">Labour assignment</span>
      </div>
      <div className="flex flex-col items-stretch gap-2 md:flex-row md:items-center md:gap-3">
        <RelationshipNode label="Labour" name={assignment.labourName} detail={assignment.professionName} code={assignment.labourPhone} kind="labour" />
        <div className="relative flex h-9 items-center justify-center md:w-10"><div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-neutral-200 md:inset-x-0 md:inset-y-1/2 md:h-px md:w-full md:translate-x-0 md:-translate-y-1/2"/><RelationshipLink/></div>
        <RelationshipNode label="Contractor" name={assignment.contractorName} code={assignment.contractorCode} kind="contractor" />
        <div className="relative flex h-9 items-center justify-center md:w-10"><div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-neutral-200 md:inset-x-0 md:inset-y-1/2 md:h-px md:w-full md:translate-x-0 md:-translate-y-1/2"/><RelationshipLink/></div>
        <RelationshipNode label="Project" name={assignment.projectName} code={assignment.projectCode} kind="project" />
      </div>
    </Card>
  );
}
