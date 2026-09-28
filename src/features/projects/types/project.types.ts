export type ProjectStatus = 'Planning' | 'Active' | 'Completed' | 'On Hold';

export interface Project {
  id: string;
  projectCode: string;
  name: string;
  customerId: string;
  customerName: string;
  status: ProjectStatus;
  progress: number;
  startDate: string;
  plannedEndDate: string;
  description?: string;
  createdAt: string;
}
