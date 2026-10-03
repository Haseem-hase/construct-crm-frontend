export type RoleType = 'GLOBAL' | 'CUSTOM';

export type PermissionAction = 'view' | 'create' | 'update' | 'delete' | 'manage';

export interface Permission {
  id: string;
  module: string;
  action: PermissionAction;
  description?: string;
}

export interface PermissionModule {
  id: string;
  name: string;
  description?: string;
  actions: PermissionAction[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  type: RoleType;
  permissions: string[]; // e.g. "customers:view", "projects:create"
  usersAssigned: number;
  createdAt: string;
  updatedAt: string;
}
