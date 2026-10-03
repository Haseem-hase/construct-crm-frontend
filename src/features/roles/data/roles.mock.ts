import { PermissionModule, Role } from '../types/roles.types';

export const mockPermissionModules: PermissionModule[] = [
  {
    id: 'customers',
    name: 'Customers',
    actions: ['view', 'create', 'update', 'delete'],
  },
  {
    id: 'projects',
    name: 'Projects',
    actions: ['view', 'create', 'update', 'delete'],
  },
  {
    id: 'contractors',
    name: 'Contractors',
    actions: ['view', 'create', 'update', 'delete'],
  },
  {
    id: 'labour',
    name: 'Labour',
    actions: ['view', 'create', 'update', 'delete'],
  },
  {
    id: 'assignments',
    name: 'Contractor Assignments',
    actions: ['view', 'create', 'update', 'delete'],
  },
  {
    id: 'labour-assignments',
    name: 'Labour Assignments',
    actions: ['view', 'create', 'update', 'delete'],
  },
  {
    id: 'roles',
    name: 'Roles & Permissions',
    actions: ['view', 'create', 'update', 'delete'],
  },
];

export const mockRoles: Role[] = [
  {
    id: 'role_1',
    name: 'Organization Owner',
    description: 'Global role with full access to all modules and configurations.',
    type: 'GLOBAL',
    permissions: [
      'customers:view', 'customers:create', 'customers:update', 'customers:delete',
      'projects:view', 'projects:create', 'projects:update', 'projects:delete',
      'contractors:view', 'contractors:create', 'contractors:update', 'contractors:delete',
      'labour:view', 'labour:create', 'labour:update', 'labour:delete',
      'assignments:view', 'assignments:create', 'assignments:update', 'assignments:delete',
      'labour-assignments:view', 'labour-assignments:create', 'labour-assignments:update', 'labour-assignments:delete',
      'roles:view', 'roles:create', 'roles:update', 'roles:delete'
    ],
    usersAssigned: 1,
    createdAt: new Date('2025-01-01').toISOString(),
    updatedAt: new Date('2025-01-01').toISOString(),
  },
  {
    id: 'role_2',
    name: 'Project Manager',
    description: 'Global role for managing construction projects and assignments.',
    type: 'GLOBAL',
    permissions: [
      'customers:view',
      'projects:view', 'projects:create', 'projects:update',
      'contractors:view',
      'assignments:view', 'assignments:create', 'assignments:update',
      'labour-assignments:view', 'labour-assignments:create', 'labour-assignments:update'
    ],
    usersAssigned: 4,
    createdAt: new Date('2025-01-15').toISOString(),
    updatedAt: new Date('2025-02-10').toISOString(),
  },
  {
    id: 'role_3',
    name: 'Site Supervisor',
    description: 'Custom role for monitoring on-site activities and labour.',
    type: 'CUSTOM',
    permissions: [
      'projects:view',
      'labour:view',
      'labour-assignments:view'
    ],
    usersAssigned: 12,
    createdAt: new Date('2025-02-01').toISOString(),
    updatedAt: new Date('2025-02-15').toISOString(),
  },
  {
    id: 'role_4',
    name: 'Finance Manager',
    description: 'Custom role for managing financial aspects and contracts.',
    type: 'CUSTOM',
    permissions: [
      'customers:view', 'customers:update',
      'projects:view',
      'contractors:view', 'contractors:update'
    ],
    usersAssigned: 2,
    createdAt: new Date('2025-03-01').toISOString(),
    updatedAt: new Date('2025-03-05').toISOString(),
  }
];
