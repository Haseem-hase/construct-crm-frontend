export interface SummaryStats {
  customers: number;
  projects: number;
  contractors: number;
  labour: number;
}

export interface LabourAvailability {
  total: number;
  assigned: number;
  available: number;
  inactive: number;
}

export interface ProjectStatusData {
  total: number;
  planning: number;
  active: number;
  completed: number;
}

export interface ProjectProgressItem {
  id: string;
  name: string;
  progress: number;
}

export interface ContractorOverviewData {
  total: number;
  active: number;
  inactive: number;
  activeAssignments: number;
}

export interface AssignmentStatusData {
  active: number;
  startingSoon?: number;
  endingSoon?: number;
  pending?: number;
  onHold?: number;
  completed: number;
  cancelled?: number;
}

export interface UpcomingLabourAssignment {
  id: string;
  labourName: string;
  projectName: string;
  startDate: string;
  endDate: string;
  status: string;
}

export interface ActivityItem {
  id: string;
  description: string;
  timeAgo: string;
}

export interface AttentionItem {
  id: string;
  message: string;
  type: 'warning' | 'info' | 'critical';
}

export interface DashboardData {
  summary: SummaryStats;
  labourAvailability: LabourAvailability;
  projectStatus: ProjectStatusData;
  projectProgress: ProjectProgressItem[];
  contractorOverview: ContractorOverviewData;
  labourAssignments: AssignmentStatusData;
  contractorAssignments: AssignmentStatusData;
  upcomingLabourAssignments: UpcomingLabourAssignment[];
  recentActivity: ActivityItem[];
  attentionRequired: AttentionItem[];
}
