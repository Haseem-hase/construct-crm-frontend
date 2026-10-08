'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { OrganizationRole } from '../types/roles.types';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/src/components/ui/table';
import { Button } from '@/src/components/ui/button';
import { Card } from '@/src/components/ui/card';
import { RoleTypeBadge } from './role-type-badge';

interface RolesTableProps {
  roles: OrganizationRole[];
}

export function RolesTable({ roles }: RolesTableProps) {
  const router = useRouter();

  if (roles.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <h3 className="text-base font-medium text-neutral-900 mb-1">No roles found</h3>
        <p className="text-sm text-neutral-500 mb-4">Try adjusting your filters.</p>
      </Card>
    );
  }

  return (
    <Card className="w-full min-w-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px]">Role Name</TableHead>
            <TableHead className="w-[150px]">Type</TableHead>
            <TableHead className="min-w-[250px]">Description</TableHead>
            <TableHead className="w-[180px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((orgRole) => (
            <TableRow key={orgRole.id}>
              <TableCell>
                <div className="font-medium text-neutral-900 truncate max-w-[200px]" title={orgRole.role.name}>
                  {orgRole.role.name}
                </div>
              </TableCell>
              <TableCell>
                <RoleTypeBadge isGlobal={orgRole.role.isGlobal} />
              </TableCell>
              <TableCell>
                <div className="text-neutral-500 text-[14px] truncate max-w-[300px]" title={orgRole.role.description || ''}>
                  {orgRole.role.description || ''}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-16"
                    onClick={() => router.push(`/roles/${orgRole.id}`)}
                  >
                    View
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-[84px]"
                    onClick={() => router.push(`/roles/${orgRole.id}/edit?from=list`)}
                  >
                    {orgRole.role.isGlobal ? 'Configure' : 'Edit'}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
