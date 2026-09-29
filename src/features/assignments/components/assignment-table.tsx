import React from 'react';
import Link from 'next/link';
import { Assignment, AssignmentStatus } from '../types/assignment.types';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/src/components/ui/table';

interface AssignmentTableProps {
  assignments: Assignment[];
  currentPage: number;
  itemsPerPage: number;
}

export function AssignmentTable({ assignments, currentPage, itemsPerPage }: AssignmentTableProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return <span className="text-neutral-400">Not provided</span>;
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusVariant = (status: AssignmentStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'PENDING':
      case 'ON_HOLD':
        return 'warning';
      case 'TERMINATED':
      case 'CANCELLED':
        return 'destructive';
      case 'COMPLETED':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  const getStatusLabel = (status: AssignmentStatus) => {
    switch (status) {
      case 'ON_HOLD': return 'On Hold';
      default: return status.charAt(0) + status.slice(1).toLowerCase();
    }
  };

  if (assignments.length === 0) {
    return (
      <div className="border border-neutral-200 rounded-lg p-12 flex flex-col items-center justify-center text-center bg-white">
        <p className="text-neutral-500 mb-2">No assignments found</p>
        <p className="text-sm text-neutral-400">Try adjusting your filters or search term</p>
      </div>
    );
  }

  return (
    <div className="border border-neutral-200 rounded-lg overflow-x-auto bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">S.No</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Contractor</TableHead>
            <TableHead>Responsibilities</TableHead>
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
                    <span className="font-medium text-neutral-900">{assignment.projectName}</span>
                    <span className="text-xs text-neutral-500">{assignment.projectCode}</span>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-neutral-900">{assignment.contractorName}</span>
                    <span className="text-xs text-neutral-500">{assignment.contractorCode}</span>
                  </div>
                </TableCell>
                
                <TableCell>
                  <span className="text-sm text-neutral-600 line-clamp-2">
                    {assignment.responsibilityNames.join(', ')}
                  </span>
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
                    <Link href={`/assignments/${assignment.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                    <Link href={`/assignments/${assignment.id}/edit`}>
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
