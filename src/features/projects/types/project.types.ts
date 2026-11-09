export type ProjectStatus = 'Planning' | 'Active' | 'Completed' | 'On Hold' | 'Cancelled';

export interface ProjectImageDetails {
  kind?: 'DESIGN' | 'SITE';
  visitedAt?: string | null;
  siteStage?: 'BEFORE_WORK' | 'IN_PROGRESS' | 'COMPLETED' | null;
  areaSqFt?: number | null;
  notes?: string | null;
}

export interface ProjectImage extends ProjectImageDetails {
  id: string;
  url: string;
  alt?: string;
  isCover?: boolean;
  isPersisted?: boolean;
  file?: File;
}

export interface Project {
  id: string;
  projectCode: string;
  name: string;
  customerId: string;
  customerName: string;
  customerCode?: string;
  customerType?: string;
  organizationName?: string;
  projectCustomerRelationId?: string;
  projectCustomerRelations?: { id: string; customerId: string }[];
  status: ProjectStatus;
  progress: number;
  startDate: string;
  plannedEndDate: string;
  description?: string;
  budget?: number | null;
  areaSqFt?: number | null;
  images?: ProjectImage[];
  imageUrl?: string;
  createdAt: string;
}
