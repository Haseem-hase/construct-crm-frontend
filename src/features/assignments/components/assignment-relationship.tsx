import React from 'react';
import { Card } from '@/src/components/ui/card';
import { Assignment } from '../types/assignment.types';

interface AssignmentRelationshipProps {
  assignment: Assignment;
}

function LinkMark() {
  return (
    <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 shadow-sm">
      <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.07 0l3-3A5 5 0 0 0 13 2.93l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.07 0l-3 3A5 5 0 0 0 11 21.07l1.71-1.72" />
      </svg>
    </div>
  );
}

function RelationshipNode({ label, name, code, kind }: { label: string; name: string; code: string; kind: 'contractor' | 'project' }) {
  return (
    <div className="flex min-w-0 flex-1 items-start gap-4 rounded-xl border border-neutral-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:p-6">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${kind === 'contractor' ? 'bg-indigo-50 text-indigo-700' : 'bg-sky-50 text-sky-700'}`}>
        {kind === 'contractor' ? (
          <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" /><path d="M9 9v.01M9 12v.01M9 15v.01M9 18v.01M16 13v.01M16 16v.01M16 19v.01" />
          </svg>
        ) : (
          <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6M9 10h.01M15 10h.01" />
          </svg>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">{label}</p>
        <p className="mt-2 break-words text-base font-semibold leading-6 text-neutral-900 sm:text-lg">{name}</p>
        <p className="mt-1.5 font-mono text-xs font-medium tracking-wide text-neutral-500">{code}</p>
      </div>
    </div>
  );
}

export function AssignmentRelationship({ assignment }: AssignmentRelationshipProps) {
  return (
    <Card className="mb-8 overflow-hidden border-neutral-200 bg-gradient-to-br from-neutral-50 to-white p-5 shadow-sm sm:p-7">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-neutral-900">Assignment relationship</p>
          <p className="mt-1 text-xs text-neutral-500">Contractor responsible for this project</p>
        </div>
        <span className="hidden rounded-full border border-neutral-200 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-500 sm:inline-flex">Project assignment</span>
      </div>
      <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center md:gap-4">
        <RelationshipNode label="Contractor" name={assignment.contractorName} code={assignment.contractorCode} kind="contractor" />
        <div className="relative flex h-10 items-center justify-center md:w-14">
          <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-neutral-200 md:inset-x-0 md:inset-y-1/2 md:h-px md:w-full md:translate-x-0 md:-translate-y-1/2" />
          <LinkMark />
        </div>
        <RelationshipNode label="Project" name={assignment.projectName} code={assignment.projectCode} kind="project" />
      </div>
    </Card>
  );
}
