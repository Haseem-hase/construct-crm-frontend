import React from 'react';
import { useRouter } from 'next/navigation';
import { ApiContractor, ApiContractorStatus } from '../types/contractor.types';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/src/components/ui/table';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Card } from '@/src/components/ui/card';
import { Pagination } from '@/src/components/ui/pagination';
import { User } from '@/src/components/ui/icons';

interface ContractorTableProps {
  contractors: ApiContractor[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  readOnly?: boolean;
}

function formatDate(isoString?: string | null) {
  if (!isoString) return <span className="text-neutral-400 italic">Not provided</span>;
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return <span className="text-neutral-400 italic">Not provided</span>;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getStatusVariant(status: ApiContractorStatus): 'default' | 'success' | 'warning' | 'destructive' | 'info' | 'neutral' {
  switch (status) {
    case 'ACTIVE':
      return 'success';
    case 'PENDING':
      return 'warning';
    case 'SUSPENDED':
      return 'destructive';
    case 'INACTIVE':
      return 'neutral';
    case 'TERMINATED':
      return 'destructive';
    default:
      return 'default';
  }
}

export function ContractorTable({
  contractors,
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  readOnly = false,
}: ContractorTableProps) {
  const router = useRouter();
  const hasOrganizationColumn = contractors.some((contractor) => contractor.organization?.name);

  if (contractors.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <h3 className="text-base font-medium text-neutral-900 mb-1">No contractors found</h3>
        <p className="text-sm text-neutral-500 mb-4">Try adjusting your search or filters.</p>
      </Card>
    );
  }

  return (
    <div className="flex flex-col w-full min-w-0">
      <Card className="w-full min-w-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px] text-center">S.No</TableHead>
              <TableHead className="min-w-[120px]">Code</TableHead>
              <TableHead className="min-w-[200px]">Contractor Name</TableHead>
              {hasOrganizationColumn && <TableHead>Organization</TableHead>}
              <TableHead className="min-w-[140px]">Phone</TableHead>
              <TableHead className="min-w-[160px]">Email</TableHead>
              <TableHead className="min-w-[120px]">City</TableHead>
              <TableHead className="min-w-[140px]">License Number</TableHead>
              <TableHead className="min-w-[130px]">License Expiry</TableHead>
              <TableHead className="w-[110px]">Status</TableHead>
              <TableHead className="w-[160px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contractors.map((contractor, index) => {
              const serialNumber = (currentPage - 1) * itemsPerPage + index + 1;

              return (
                <TableRow key={contractor.id}>
                  <TableCell className="text-center text-neutral-500 font-medium">
                    {serialNumber}
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-neutral-600 text-[13px]">{contractor.contractorCode}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center overflow-hidden shrink-0">
                        {contractor.profileImageUrl ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={contractor.profileImageUrl}
                            alt={`${contractor.fullName} avatar`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-4 h-4 text-neutral-400" />
                        )}
                      </div>
                      <div className="font-medium text-neutral-900 truncate max-w-[180px]" title={contractor.fullName}>
                        {contractor.fullName}
                      </div>
                    </div>
                  </TableCell>
                  {hasOrganizationColumn && <TableCell className="text-neutral-600">{contractor.organization?.name || '—'}</TableCell>}
                  <TableCell>
                    <span className="text-neutral-600 tabular-nums">{contractor.phone}</span>
                  </TableCell>
                  <TableCell>
                    {contractor.email ? (
                      <span className="text-neutral-600 text-[13px] truncate block max-w-[160px]" title={contractor.email}>
                        {contractor.email}
                      </span>
                    ) : (
                      <span className="text-neutral-400 italic">Not provided</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-neutral-700">{contractor.city}</span>
                  </TableCell>
                  <TableCell>
                    {contractor.licenseNumber ? (
                      <span className="font-mono text-neutral-600 text-[13px]">{contractor.licenseNumber}</span>
                    ) : (
                      <span className="text-neutral-400 italic">Not provided</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {formatDate(contractor.licenseExpiryDate)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(contractor.status)}>
                      {contractor.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-16"
                        onClick={() => router.push(`/contractors/${contractor.id}`)}
                      >
                        View
                      </Button>
                      {!readOnly && <Button
                        variant="ghost"
                        size="sm"
                        className="w-16"
                        onClick={() => router.push(`/contractors/${contractor.id}/edit`)}
                      >
                        Edit
                      </Button>}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-end">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
