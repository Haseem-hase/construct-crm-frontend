'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { labourApi } from '@/src/features/labour/api/labour.api';
import { Labour } from '@/src/features/labour/types/labour.types';
import { LabourForm } from '@/src/features/labour/components/labour-form';
import { Button } from '@/src/components/ui/button';
import { ChevronLeft } from '@/src/components/ui/icons';
import { PageHeader } from '@/src/components/ui/page-header';
import { EmptyState } from '@/src/components/ui/empty-state';
import Link from 'next/link';

export default function EditLabourPage() {
  const params = useParams();
  const labourId = params?.id as string;
  const [labour, setLabour] = useState<Labour>();
  const [loading, setLoading] = useState(true);
  useEffect(() => { labourApi.get(labourId).then((l) => setLabour({ ...l, professionName: l.profession.name, email: l.email ?? undefined, dateOfBirth: l.dateOfBirth ?? undefined, address: l.address ?? undefined, emergencyContactName: l.emergencyContactName ?? undefined, emergencyContactPhone: l.emergencyContactPhone ?? undefined, joiningDate: l.joiningDate ?? undefined, profileImageUrl: l.profileImageUrl ?? undefined, notes: l.notes ?? undefined })).catch(() => setLabour(undefined)).finally(() => setLoading(false)); }, [labourId]);
  if (loading) return <p className="py-12 text-center text-sm text-neutral-500">Loading labour record…</p>;

  if (!labour) {
    return (
      <div className="w-full mx-auto pb-12 min-w-0 max-w-5xl">
        <EmptyState 
          title="Labour Not Found"
          description="The labour you are looking for does not exist or has been removed."
          action={
            <Link href="/labour">
              <Button variant="outline">
                Back to Labour
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto pb-12 min-w-0 max-w-4xl">
      <PageHeader 
        title="Edit Labour" 
        description={`Update information for ${labour.fullName}.`}
        backLink={{ href: `/labour/${labour.id}`, label: 'Back to Labour Details' }}
      />
      <LabourForm mode="edit" initialData={labour} />
    </div>
  );
}
