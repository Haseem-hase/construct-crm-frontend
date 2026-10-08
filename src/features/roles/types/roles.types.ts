export type Module =
  | 'PROJECT'
  | 'LABOUR'
  | 'COMPANY'
  | 'CUSTOMER'
  | 'ATTENDANCE'
  | 'PAYROLL'
  | 'INVENTORY'
  | 'SUPPLIER'
  | 'REPORT'
  | 'ROLE'
  | 'USER'
  | 'CONTRACTOR';

export type Action =
  | 'CREATE'
  | 'VIEW'
  | 'UPDATE'
  | 'DELETE'
  | 'APPROVE'
  | 'EXPORT'
  | 'ASSIGN';

export interface Permission {
  id: string;
  module: Module;
  action: Action;
  description: string | null;
}

export interface RolePermission {
  permission: Permission;
}

export interface BaseRole {
  id: string;
  name: string;
  description: string | null;
  isGlobal: boolean;
}

export interface OrganizationRole {
  id: string;
  organizationId: string;
  roleId: string;
  role: BaseRole;
  createdAt: string;
  updatedAt: string;
  rolePermissions?: RolePermission[];
}

export interface GetRolesResponse {
  success: boolean;
  data: {
    roles: OrganizationRole[];
  };
}

export interface GetRoleResponse {
  success: boolean;
  data: {
    role: OrganizationRole;
  };
}

export interface GetPermissionsResponse {
  success: boolean;
  data: {
    permissions: Permission[];
  };
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
  permissionIds: string[];
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string | null;
  permissionIds?: string[];
}

// UI specific helper type for grouping permissions by module in PermissionMatrix
export interface PermissionGroup {
  module: Module;
  permissions: Permission[];
}
