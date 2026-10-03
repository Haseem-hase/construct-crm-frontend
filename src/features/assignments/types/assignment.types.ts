export type AssignmentStatus =
  | 'PENDING'
  | 'ACTIVE'
  | 'ON_HOLD'
  | 'COMPLETED'
  | 'TERMINATED'
  | 'CANCELLED';

export interface Assignment {
  id: string;
  projectId: string;
  projectCode: string;
  projectName: string;
  contractorId: string;
  contractorCode: string;
  contractorName: string;
  responsibilityIds: string[];
  responsibilityNames: string[];
  scope: string;
  startDate?: string;
  endDate?: string;
  status: AssignmentStatus;
  notes?: string;
  createdAt: string;
}
