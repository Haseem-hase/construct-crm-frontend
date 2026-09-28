export interface PlatformSummaryStats {
  totalOrganizations: number;
  activeOrganizations: number;
  totalUsers: number;
  activeUsers: number;
  orgsGrowth: string;
  activeOrgsPercent: string;
  usersGrowth: string;
  activeUsersPercent: string;
}

export interface OrganizationOverviewItem {
  id: string;
  name: string;
  users: number;
  projects: number;
  labour: number;
  status: 'Active' | 'Suspended';
  created: string;
}

export interface GrowthDataPoint {
  month: string;
  value: number;
}

export interface UserOverviewStats {
  total: number;
  active: number;
  inactive: number;
  recentlyRegistered: number;
}

export interface UserOverviewItem {
  id: string;
  name: string;
  email: string;
  organization: string;
  role: string;
  joined: string;
  status: 'Active' | 'Inactive';
}

export interface PlatformActivityItem {
  id: string;
  title: string;
  description: string;
  timeAgo: string;
}

export interface GlobalRolesStats {
  totalRoles: number;
  totalPermissions: number;
}

export interface GlobalRoleItem {
  id: string;
  name: string;
  organizationsUsing: number;
  status: 'Active' | 'Inactive';
}

export interface SystemHealthItem {
  id: string;
  service: string;
  status: 'Operational' | 'Degraded' | 'Down';
  lastChecked: string;
}

export interface PlatformAttentionItem {
  id: string;
  message: string;
  type: 'warning' | 'info' | 'critical';
}

export interface SuperAdminDashboardData {
  summary: PlatformSummaryStats;
  organizations: OrganizationOverviewItem[];
  growth: GrowthDataPoint[];
  userStats: UserOverviewStats;
  recentUsers: UserOverviewItem[];
  activity: PlatformActivityItem[];
  rolesStats: GlobalRolesStats;
  roles: GlobalRoleItem[];
  systemHealth: SystemHealthItem[];
  attentionRequired: PlatformAttentionItem[];
}
