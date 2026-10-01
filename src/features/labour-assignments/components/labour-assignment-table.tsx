import React from 'react';
import Link from 'next/link';
import { LabourAssignment, LabourAssignmentStatus } from '../types/labour-assignment.types';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/src/components/ui/table';

interface LabourAssignmentTableProps {
  assignments: LabourAssignment[];
  currentPage: number;
  itemsPerPage: number;
}

export function LabourAssignmentTable({ assignments, currentPage, itemsPerPage }: LabourAssignmentTableProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return <span className="text-neutral-400">Not provided</span>;
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusVariant = (status: LabourAssignmentStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'CANCELLED':
        return 'destructive';
      case 'COMPLETED':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  const getStatusLabel = (status: LabourAssignmentStatus) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  if (assignments.length === 0) {
    return (
      <div className="border border-neutral-200 rounded-lg p-12 flex flex-col items-center justify-center text-center bg-white">
        <p className="text-neutral-500 mb-2">No labour assignments found</p>
        <p className="text-sm text-neutral-400">Try adjusting your filters or search term</p>
      </div>
    );
  }

  return (
    <div className="border border-neutral-200 rounded-lg overflow-x-auto bg-white">
      <Table className="min-w-[900px]">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">S.No</TableHead>
            <TableHead>Labour</TableHead>
            <TableHead>Profession</TableHead>
            <TableHead>Contractor</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assignments.map((assignment, index) => {
            const sNo = (currentPage - 1) * itemsPerPage + index + 1;
            
            return (
              <TableRow key={assignment.id}>
                <TableCell className="text-neutral-500">{sNo}</TableCell>
                
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-neutral-900">{assignment.labourName}</span>
                    <span className="text-xs text-neutral-500">{assignment.labourPhone}</span>
                  </div>
                </TableCell>
                
                <TableCell>
                  <span className="text-sm text-neutral-600">
                    {assignment.professionName}
                  </span>
                </TableCell>

                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-neutral-900">{assignment.contractorName}</span>
                    <span className="text-xs text-neutral-500">{assignment.contractorCode}</span>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-neutral-900">{assignment.projectName}</span>
                    <span className="text-xs text-neutral-500">{assignment.projectCode}</span>
                  </div>
                </TableCell>

                <TableCell className="text-sm whitespace-nowrap">
                  {formatDate(assignment.startDate)}
                </TableCell>
                
                <TableCell className="text-sm whitespace-nowrap">
                  {formatDate(assignment.endDate)}
                </TableCell>

                <TableCell>
                  <Badge variant={getStatusVariant(assignment.status)}>
                    {getStatusLabel(assignment.status)}
                  </Badge>
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/labour-assignments/${assignment.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                    <Link href={`/labour-assignments/${assignment.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
