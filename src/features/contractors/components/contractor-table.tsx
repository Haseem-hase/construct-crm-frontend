import React from 'react';
import { useRouter } from 'next/navigation';
import { Contractor } from '../types/contractor.types';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/src/components/ui/table';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Card } from '@/src/components/ui/card';
import { Pagination } from '@/src/components/ui/pagination';

interface ContractorTableProps {
  contractors: Contractor[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

function formatDate(isoString?: string) {
  if (!isoString) return <span className="text-neutral-400 italic">Not provided</span>;
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function getStatusVariant(status: string): 'default' | 'success' | 'warning' | 'destructive' | 'info' | 'neutral' {
  switch (status) {
    case 'Active': return 'success';
    case 'Inactive': return 'neutral'; // using neutral for inactive based on requirements
    default: return 'default';
  }
}

export function ContractorTable({ 
  contractors, 
  currentPage, 
  totalPages, 
  itemsPerPage,
  onPageChange 
}: ContractorTableProps) {
  const router = useRouter();

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
              <TableHead className="min-w-[200px]">Company</TableHead>
              <TableHead className="min-w-[150px]">Contact Person</TableHead>
              <TableHead className="min-w-[140px]">Phone</TableHead>
              <TableHead className="min-w-[120px]">City</TableHead>
              <TableHead className="min-w-[140px]">License Number</TableHead>
              <TableHead className="min-w-[130px]">License Expiry</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
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
                    <div className="font-medium text-neutral-900 truncate max-w-[200px]" title={contractor.companyName}>
                      {contractor.companyName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-neutral-700">{contractor.contactPerson}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-neutral-600 tabular-nums">{contractor.phone}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-neutral-700">{contractor.city}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-neutral-600 text-[13px]">{contractor.licenseNumber}</span>
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
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-16"
                        onClick={() => router.push(`/contractors/${contractor.id}/edit`)}
                      >
                        Edit
                      </Button>
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
