export type ProjectStatus = 'Planning' | 'Active' | 'Completed' | 'On Hold' | 'Cancelled';

export interface ProjectImage {
  id: string;
  url: string;
  alt?: string;
  isCover?: boolean;
}

export interface Project {
  id: string;
  projectCode: string;
  name: string;
  customerId: string;
  customerName: string;
  customerCode?: string;
  customerType?: string;
  projectCustomerRelationId?: string;
  projectCustomerRelations?: { id: string; customerId: string }[];
  status: ProjectStatus;
  progress: number;
  startDate: string;
  plannedEndDate: string;
  description?: string;
  budget?: number | null;
  images?: ProjectImage[];
  imageUrl?: string;
  createdAt: string;
}
