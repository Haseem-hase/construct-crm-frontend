import { OrganizationRole, Permission, Module, Action, PermissionGroup } from '../types/roles.types';

export const mockPermissions: Permission[] = [
  // CUSTOMER
  { id: 'perm-customer-view', module: 'CUSTOMER', action: 'VIEW', description: 'View customers' },
  { id: 'perm-customer-create', module: 'CUSTOMER', action: 'CREATE', description: 'Create customers' },
  { id: 'perm-customer-update', module: 'CUSTOMER', action: 'UPDATE', description: 'Update customers' },
  { id: 'perm-customer-delete', module: 'CUSTOMER', action: 'DELETE', description: 'Delete customers' },
  // PROJECT
  { id: 'perm-project-view', module: 'PROJECT', action: 'VIEW', description: 'View projects' },
  { id: 'perm-project-create', module: 'PROJECT', action: 'CREATE', description: 'Create projects' },
  { id: 'perm-project-update', module: 'PROJECT', action: 'UPDATE', description: 'Update projects' },
  { id: 'perm-project-delete', module: 'PROJECT', action: 'DELETE', description: 'Delete projects' },
  // CONTRACTOR
  { id: 'perm-contractor-view', module: 'CONTRACTOR', action: 'VIEW', description: 'View contractors' },
  { id: 'perm-contractor-create', module: 'CONTRACTOR', action: 'CREATE', description: 'Create contractors' },
  { id: 'perm-contractor-update', module: 'CONTRACTOR', action: 'UPDATE', description: 'Update contractors' },
  { id: 'perm-contractor-delete', module: 'CONTRACTOR', action: 'DELETE', description: 'Delete contractors' },
  // LABOUR
  { id: 'perm-labour-view', module: 'LABOUR', action: 'VIEW', description: 'View labour' },
  { id: 'perm-labour-create', module: 'LABOUR', action: 'CREATE', description: 'Create labour' },
  { id: 'perm-labour-update', module: 'LABOUR', action: 'UPDATE', description: 'Update labour' },
  { id: 'perm-labour-delete', module: 'LABOUR', action: 'DELETE', description: 'Delete labour' },
  // ROLE
  { id: 'perm-role-view', module: 'ROLE', action: 'VIEW', description: 'View roles' },
  { id: 'perm-role-create', module: 'ROLE', action: 'CREATE', description: 'Create roles' },
  { id: 'perm-role-update', module: 'ROLE', action: 'UPDATE', description: 'Update roles' },
  { id: 'perm-role-delete', module: 'ROLE', action: 'DELETE', description: 'Delete roles' },
];

export const mockPermissionGroups: PermissionGroup[] = [
  {
    module: 'CUSTOMER',
    permissions: mockPermissions.filter(p => p.module === 'CUSTOMER'),
  },
  {
    module: 'PROJECT',
    permissions: mockPermissions.filter(p => p.module === 'PROJECT'),
  },
  {
    module: 'CONTRACTOR',
    permissions: mockPermissions.filter(p => p.module === 'CONTRACTOR'),
  },
  {
    module: 'LABOUR',
    permissions: mockPermissions.filter(p => p.module === 'LABOUR'),
  },
  {
    module: 'ROLE',
    permissions: mockPermissions.filter(p => p.module === 'ROLE'),
  }
];

export const mockRoles: OrganizationRole[] = [
  {
    id: 'org_role_1',
    organizationId: 'org_1',
    roleId: 'role_1',
    role: {
      id: 'role_1',
      name: 'Organization Owner',
      description: 'Global role with full access to all modules and configurations.',
      isGlobal: true,
    },
    createdAt: new Date('2025-01-01').toISOString(),
    updatedAt: new Date('2025-01-01').toISOString(),
    rolePermissions: mockPermissions.map(permission => ({ permission }))
  },
  {
    id: 'org_role_2',
    organizationId: 'org_1',
    roleId: 'role_2',
    role: {
      id: 'role_2',
      name: 'Project Manager',
      description: 'Global role for managing construction projects and assignments.',
      isGlobal: true,
    },
    createdAt: new Date('2025-01-15').toISOString(),
    updatedAt: new Date('2025-02-10').toISOString(),
    rolePermissions: mockPermissions
      .filter(p => ['PROJECT', 'CUSTOMER', 'CONTRACTOR'].includes(p.module) && p.action !== 'DELETE')
      .map(permission => ({ permission }))
  },
  {
    id: 'org_role_3',
    organizationId: 'org_1',
    roleId: 'role_3',
    role: {
      id: 'role_3',
      name: 'Site Supervisor',
      description: 'Custom role for monitoring on-site activities and labour.',
      isGlobal: false,
    },
    createdAt: new Date('2025-02-01').toISOString(),
    updatedAt: new Date('2025-02-15').toISOString(),
    rolePermissions: mockPermissions
      .filter(p => ['PROJECT', 'LABOUR'].includes(p.module) && p.action === 'VIEW')
      .map(permission => ({ permission }))
  },
  {
    id: 'org_role_4',
    organizationId: 'org_1',
    roleId: 'role_4',
    role: {
      id: 'role_4',
      name: 'Finance Manager',
      description: 'Custom role for managing financial aspects and contracts.',
      isGlobal: false,
    },
    createdAt: new Date('2025-03-01').toISOString(),
    updatedAt: new Date('2025-03-05').toISOString(),
    rolePermissions: mockPermissions
      .filter(p => ['CUSTOMER', 'PROJECT', 'CONTRACTOR'].includes(p.module) && ['VIEW', 'UPDATE'].includes(p.action))
      .map(permission => ({ permission }))
  }
];
