import { DashboardData } from '../types/dashboard.types';

export const mockDashboardData: DashboardData = {
  summary: {
    customers: 84,
    projects: 24,
    contractors: 18,
    labour: 126,
  },
  labourAvailability: {
    total: 126,
    assigned: 82,
    available: 44,
    inactive: 0,
  },
  projectStatus: {
    total: 24,
    planning: 5,
    active: 12,
    completed: 7,
  },
  projectProgress: [
    { id: 'p1', name: 'Kingdom Tower Construction', progress: 75 },
    { id: 'p2', name: 'Riyadh Commercial Complex', progress: 25 },
    { id: 'p3', name: 'Residential Villa Development', progress: 55 },
    { id: 'p4', name: 'Industrial Warehouse Project', progress: 40 },
  ],
  contractorOverview: {
    total: 18,
    active: 15,
    inactive: 3,
    activeAssignments: 14,
  },
  labourAssignments: {
    active: 82,
    startingSoon: 8,
    endingSoon: 6,
    completed: 42,
    cancelled: 4,
  },
  contractorAssignments: {
    active: 14,
    pending: 3,
    onHold: 2,
    completed: 9,
  },
  upcomingLabourAssignments: [
    {
      id: 'la1',
      labourName: 'Mohammed Hassan',
      projectName: 'Riyadh Commercial Complex',
      startDate: 'Oct 23, 2026',
      endDate: 'Oct 30, 2026',
      status: 'Active',
    },
    {
      id: 'la2',
      labourName: 'Ahmed Ali',
      projectName: 'Kingdom Tower Construction',
      startDate: 'Oct 25, 2026',
      endDate: 'Nov 10, 2026',
      status: 'Active',
    },
    {
      id: 'la3',
      labourName: 'Ibrahim Khan',
      projectName: 'Industrial Warehouse Project',
      startDate: 'Oct 28, 2026',
      endDate: 'Nov 15, 2026',
      status: 'Active',
    },
  ],
  recentActivity: [
    { id: 'a1', description: 'Labour Mohammed Hassan was assigned to Riyadh Commercial Complex.', timeAgo: '2 hours ago' },
    { id: 'a2', description: 'New contractor added to the organization.', timeAgo: '5 hours ago' },
    { id: 'a3', description: 'Kingdom Tower Construction project was updated.', timeAgo: 'Yesterday' },
    { id: 'a4', description: 'New customer created.', timeAgo: 'Yesterday' },
    { id: 'a5', description: 'Contractor Project Assignment status changed.', timeAgo: '2 days ago' },
  ],
  attentionRequired: [
    { id: 'at1', message: '3 contractor assignments ending soon', type: 'warning' },
    { id: 'at2', message: '5 labour assignments ending this week', type: 'warning' },
    { id: 'at3', message: '2 projects have passed their planned end date', type: 'critical' },
    { id: 'at4', message: '44 labourers are currently available', type: 'info' },
  ],
};
