import { Project } from '../types/project.types';

export const mockProjects: Project[] = [
  {
    id: 'proj-001',
    projectCode: 'PROJ-000001',
    name: 'Kingdom Tower Construction - Phase 1',
    customerId: 'cus-001',
    customerName: 'Al-Rajhi Construction',
    status: 'Active',
    progress: 75,
    budget: 15000000.00,
    startDate: '2025-01-15T00:00:00Z',
    plannedEndDate: '2026-12-31T00:00:00Z',
    description: 'First phase of the new Kingdom Tower structural works including foundation, core structure, and initial steel frame erection.',
    createdAt: '2024-11-01T10:00:00Z',
    images: [
      { id: 'img-001-c', url: 'https://picsum.photos/seed/proj1cover/1200/500', alt: 'Kingdom Tower Cover', isCover: true },
      { id: 'img-001-1', url: 'https://picsum.photos/seed/proj1g1/600/400', alt: 'Foundation pouring' },
      { id: 'img-001-2', url: 'https://picsum.photos/seed/proj1g2/600/400', alt: 'Steel framing' },
      { id: 'img-001-3', url: 'https://picsum.photos/seed/proj1g3/600/400', alt: 'Crane operation' },
      { id: 'img-001-4', url: 'https://picsum.photos/seed/proj1g4/600/400', alt: 'Site overview' }
    ]
  },
  {
    id: 'proj-002',
    projectCode: 'PROJ-000002',
    name: 'Riyadh Commercial Complex',
    customerId: 'cus-002',
    customerName: 'Binladin Group',
    status: 'Planning',
    progress: 0,
    budget: 5000000.00,
    startDate: '2026-06-01T00:00:00Z',
    plannedEndDate: '2028-06-01T00:00:00Z',
    createdAt: '2025-02-15T08:30:00Z',
    images: [
      { id: 'img-002-c', url: 'https://picsum.photos/seed/proj2cover/1200/500', alt: 'Commercial Complex Planning render', isCover: true },
      { id: 'img-002-1', url: 'https://picsum.photos/seed/proj2g1/600/400', alt: 'Architectural model' }
    ]
  },
  {
    id: 'proj-003',
    projectCode: 'PROJ-000003',
    name: 'Residential Villa Development',
    customerId: 'cus-003',
    customerName: 'Emaar Properties',
    status: 'Active',
    progress: 75,
    budget: 3200000.00,
    startDate: '2024-03-01T00:00:00Z',
    plannedEndDate: '2025-08-30T00:00:00Z',
    createdAt: '2024-01-20T09:15:00Z',
    images: [
      { id: 'img-003-c', url: 'https://picsum.photos/seed/proj3cover/1200/500', alt: 'Villa Development', isCover: true },
      { id: 'img-003-1', url: 'https://picsum.photos/seed/proj3g1/600/400', alt: 'Villa exterior' },
      { id: 'img-003-2', url: 'https://picsum.photos/seed/proj3g2/600/400', alt: 'Landscaping' }
    ]
  },
  {
    id: 'proj-004',
    projectCode: 'PROJ-000004',
    name: 'Industrial Warehouse Project',
    customerId: 'cus-001',
    customerName: 'Al-Rajhi Construction',
    status: 'Completed',
    progress: 100,
    budget: 1800000.00,
    startDate: '2023-01-10T00:00:00Z',
    plannedEndDate: '2024-05-15T00:00:00Z',
    createdAt: '2022-12-05T14:20:00Z',
    images: [
      { id: 'img-004-c', url: 'https://picsum.photos/seed/proj4cover/1200/500', alt: 'Warehouse Final', isCover: true }
    ]
  },
  {
    id: 'proj-005',
    projectCode: 'PROJ-000005',
    name: 'Jeddah Coastal Highway Extension',
    customerId: 'cus-004',
    customerName: 'Ministry of Transport',
    status: 'Active',
    progress: 25,
    budget: 85000000.00,
    startDate: '2025-05-01T00:00:00Z',
    plannedEndDate: '2027-11-30T00:00:00Z',
    createdAt: '2025-03-10T11:00:00Z',
    images: []
  },
  {
    id: 'proj-006',
    projectCode: 'PROJ-000006',
    name: 'Dammam Port Modernization',
    customerId: 'cus-005',
    customerName: 'Saudi Aramco',
    status: 'Planning',
    progress: 10,
    startDate: '2026-09-01T00:00:00Z',
    plannedEndDate: '2029-12-31T00:00:00Z',
    createdAt: '2025-07-22T09:45:00Z'
  },
  {
    id: 'proj-007',
    projectCode: 'PROJ-000007',
    name: 'Al-Ula Heritage Resort',
    customerId: 'cus-006',
    customerName: 'Royal Commission for Al-Ula',
    status: 'Active',
    progress: 55,
    budget: 45000000.00,
    startDate: '2024-08-15T00:00:00Z',
    plannedEndDate: '2026-04-30T00:00:00Z',
    createdAt: '2024-06-10T13:20:00Z'
  },
  {
    id: 'proj-008',
    projectCode: 'PROJ-000008',
    name: 'King Abdullah Financial District Metro Station',
    customerId: 'cus-007',
    customerName: 'Riyadh Development Authority',
    status: 'Completed',
    progress: 100,
    budget: 120000000.00,
    startDate: '2020-02-01T00:00:00Z',
    plannedEndDate: '2023-12-15T00:00:00Z',
    createdAt: '2019-11-20T10:30:00Z'
  },
  {
    id: 'proj-009',
    projectCode: 'PROJ-000009',
    name: 'Neom The Line Foundation Works',
    customerId: 'cus-008',
    customerName: 'Neom Company',
    status: 'Active',
    progress: 15,
    budget: 500000000.00,
    startDate: '2025-01-01T00:00:00Z',
    plannedEndDate: '2028-12-31T00:00:00Z',
    createdAt: '2024-10-05T08:00:00Z'
  },
  {
    id: 'proj-010',
    projectCode: 'PROJ-000010',
    name: 'Tabuk Solar Power Plant',
    customerId: 'cus-009',
    customerName: 'ACWA Power',
    status: 'On Hold',
    progress: 30,
    startDate: '2024-05-15T00:00:00Z',
    plannedEndDate: '2026-05-15T00:00:00Z',
    createdAt: '2024-03-01T14:45:00Z'
  },
  {
    id: 'proj-011',
    projectCode: 'PROJ-000011',
    name: 'Riyadh Airport Terminal 5 Expansion',
    customerId: 'cus-010',
    customerName: 'General Authority of Civil Aviation',
    status: 'Planning',
    progress: 0,
    startDate: '2027-01-10T00:00:00Z',
    plannedEndDate: '2030-01-10T00:00:00Z',
    createdAt: '2026-08-12T11:20:00Z'
  },
  {
    id: 'proj-012',
    projectCode: 'PROJ-000012',
    name: 'Jubail Industrial Plant Upgrade',
    customerId: 'cus-005',
    customerName: 'Saudi Aramco',
    status: 'Completed',
    progress: 100,
    startDate: '2021-09-01T00:00:00Z',
    plannedEndDate: '2023-08-30T00:00:00Z',
    createdAt: '2021-07-15T09:00:00Z'
  }
];
