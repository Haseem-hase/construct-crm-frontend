'use client';

import React, { use, useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import Link from 'next/link';
import { Button } from '@/src/components/ui/button';
import { EmptyState } from '@/src/components/ui/empty-state';
import { labourAssignmentsApi } from '@/src/features/labour-assignments/api/labour-assignments.api';
import { labourApi } from '@/src/features/labour/api/labour.api';
import type { LabourAssignment } from '@/src/features/labour-assignments/types/labour-assignment.types';
import { LabourAssignmentDetailsClient } from '@/src/features/labour-assignments/components/labour-assignment-details';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function LabourAssignmentDetailsPage({ params }: PageProps) {
  const { id } = use(params);
  const [assignment, setAssignment] = useState<LabourAssignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([labourAssignmentsApi.get(id), labourApi.list()])
      .then(([row, labours]) => {
        if (!active) return;
        const labour = labours.find((item) => item.id === row.labourId);
        setAssignment({
          id: row.id,
          labourId: row.labourId,
          labourName: row.labour.fullName,
          labourPhone: row.labour.phone,
          professionId: labour?.professionId || row.labour.professionId,
          professionName: labour?.profession.name || '—',
          contractorProjectAssignmentId: row.contractorProjectAssignmentId,
          contractorId: row.assignment.contractor.id,
          contractorCode: row.assignment.contractor.contractorCode,
          contractorName: row.assignment.contractor.fullName,
          projectId: row.assignment.project.id,
          projectCode: row.assignment.project.projectCode,
          projectName: row.assignment.project.name,
          organizationName: row.assignment.project.organization?.name || row.labour.organization?.name || row.assignment.contractor.organization?.name,
          startDate: row.startDate || undefined,
          endDate: row.endDate || undefined,
          status: row.status,
          notes: row.notes || undefined,
          createdAt: row.createdAt,
        });
      })
      .catch((fetchError: unknown) => {
        const message = fetchError instanceof AxiosError
          ? fetchError.response?.data?.message
          : undefined;
        if (active) setError(message || 'Unable to load this labour assignment.');
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  if (loading) return <p className="py-12 text-center text-sm text-neutral-500">Loading labour assignment…</p>;
  if (!assignment) {
    return <div className="w-full mx-auto pb-12 min-w-0 max-w-5xl">
      <EmptyState
        title={error ? 'Unable to Load Labour Assignment' : 'Labour Assignment Not Found'}
        description={error || 'The labour assignment you are looking for does not exist or has been removed.'}
        action={<div className="flex gap-2">
          {error && <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>}
          <Link href="/labour-assignments"><Button variant="outline">Back to Labour Assignments</Button></Link>
        </div>}
      />
    </div>;
  }
  return <LabourAssignmentDetailsClient assignment={assignment} />;
}
