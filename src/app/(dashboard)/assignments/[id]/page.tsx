'use client';

import React, { use, useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import Link from 'next/link';
import { Button } from '@/src/components/ui/button';
import { EmptyState } from '@/src/components/ui/empty-state';
import { assignmentsApi } from '@/src/features/assignments/api/assignments.api';
import type { Assignment } from '@/src/features/assignments/types/assignment.types';
import { AssignmentDetailsClient } from '@/src/features/assignments/components/assignment-details-client';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AssignmentDetailsPage({ params }: PageProps) {
  const { id } = use(params);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    assignmentsApi.get(id)
      .then((row) => {
        if (!active) return;
        setAssignment({
          id: row.id,
          projectId: row.projectId,
          projectCode: row.project.projectCode,
          projectName: row.project.name,
          organizationName: row.project.organization?.name || row.contractor.organization?.name,
          contractorId: row.contractorId,
          contractorCode: row.contractor.contractorCode,
          contractorName: row.contractor.fullName,
          responsibilityIds: row.responsibilities.map((responsibility) => responsibility.responsibilityId),
          responsibilityNames: row.responsibilities.map((responsibility) => responsibility.responsibility.name),
          scope: row.scopeDescription || '',
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
        if (active) setError(message || 'Unable to load this contractor assignment.');
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  if (loading) return <p className="py-12 text-center text-sm text-neutral-500">Loading contractor assignment…</p>;
  if (!assignment) {
    return <div className="w-full mx-auto pb-12 min-w-0 max-w-5xl">
      <EmptyState
        title={error ? 'Unable to Load Assignment' : 'Assignment Not Found'}
        description={error || 'The contractor assignment you are looking for does not exist or has been removed.'}
        action={<div className="flex gap-2">
          {error && <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>}
          <Link href="/assignments"><Button variant="outline">Back to Assignments</Button></Link>
        </div>}
      />
    </div>;
  }
  return <AssignmentDetailsClient initialAssignment={assignment} />;
}
