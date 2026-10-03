import React, { use } from 'react';
import Link from 'next/link';
import { mockRoles } from '@/src/features/roles/data/roles.mock';
import { RoleDetailsClient } from '@/src/features/roles/components/role-details-client';
import { EmptyState } from '@/src/components/ui/empty-state';
import { Button } from '@/src/components/ui/button';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function RoleDetailsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  
  const role = mockRoles.find((r) => r.id === id);

  if (!role) {
    return (
      <div className="w-full mx-auto pb-12 min-w-0 max-w-5xl">
        <EmptyState 
          title="Role Not Found"
          description="The role you are looking for does not exist or has been removed."
          action={
            <Link href="/roles">
              <Button variant="outline">
                Back to Roles
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return <RoleDetailsClient role={role} />;
}
