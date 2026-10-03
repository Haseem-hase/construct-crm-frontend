import React from 'react';
import Link from 'next/link';
import { PageHeader } from '@/src/components/ui/page-header';
import { Button } from '@/src/components/ui/button';
import { RolesTable } from '@/src/features/roles/components/roles-table';
import { mockRoles } from '@/src/features/roles/data/roles.mock';

export default function RolesPage() {
  return (
    <div className="w-full mx-auto pb-12 min-w-0">
      <PageHeader 
        title="Roles & Permissions"
        description="Manage global system roles and custom organization roles."
        action={
          <Link href="/roles/create">
            <Button variant="primary">
              Create Custom Role
            </Button>
          </Link>
        }
      />
      
      <RolesTable roles={mockRoles} />
    </div>
  );
}
