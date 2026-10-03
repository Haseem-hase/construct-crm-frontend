export type LabourAssignmentStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface LabourAssignment {
  id: string;
  labourId: string;
  labourName: string;
  labourPhone: string;
  professionId: string;
  professionName: string;
  contractorProjectAssignmentId: string;
  contractorId: string;
  contractorCode: string;
  contractorName: string;
  projectId: string;
  projectCode: string;
  projectName: string;
  startDate?: string;
  endDate?: string;
  status: LabourAssignmentStatus;
  notes?: string;
  createdAt: string;
}
