import React from 'react';
import { useRouter } from 'next/navigation';
import { Labour } from '../types/labour.types';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/src/components/ui/table';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Card } from '@/src/components/ui/card';
import { Pagination } from '@/src/components/ui/pagination';

interface LabourTableProps {
  labourData: Labour[];
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
    case 'ACTIVE': return 'success';
    case 'INACTIVE': return 'neutral';
    default: return 'default';
  }
}

export function LabourTable({ 
  labourData, 
  currentPage, 
  totalPages, 
  itemsPerPage,
  onPageChange 
}: LabourTableProps) {
  const router = useRouter();

  if (labourData.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <h3 className="text-base font-medium text-neutral-900 mb-1">No labour records found</h3>
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
              <TableHead className="min-w-[250px]">Labour</TableHead>
              <TableHead className="min-w-[150px]">Profession</TableHead>
              <TableHead className="min-w-[140px]">Phone</TableHead>
              <TableHead className="min-w-[120px]">City</TableHead>
              <TableHead className="min-w-[130px]">Joining Date</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[160px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {labourData.map((labour, index) => {
              const serialNumber = (currentPage - 1) * itemsPerPage + index + 1;
              
              return (
                <TableRow key={labour.id}>
                  <TableCell className="text-center text-neutral-500 font-medium">
                    {serialNumber}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {labour.profileImageUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img 
                          src={labour.profileImageUrl} 
                          alt={labour.fullName} 
                          className="w-10 h-10 rounded-full object-cover shrink-0 bg-neutral-100"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                          <svg className="w-5 h-5 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                          </svg>
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-neutral-900 truncate max-w-[180px]">
                          {labour.fullName}
                        </div>
                        <div className="text-xs text-neutral-500 truncate max-w-[180px]">
                          {labour.email || labour.phone}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-neutral-700">{labour.professionName}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-neutral-600 tabular-nums">{labour.phone}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-neutral-700">{labour.city}</span>
                  </TableCell>
                  <TableCell>
                    {formatDate(labour.joiningDate)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(labour.status)}>
                      {labour.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-16"
                        onClick={() => router.push(`/labour/${labour.id}`)}
                      >
                        View
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-16"
                        onClick={() => router.push(`/labour/${labour.id}/edit`)}
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
