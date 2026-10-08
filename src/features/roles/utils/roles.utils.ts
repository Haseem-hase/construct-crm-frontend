import { Permission, PermissionGroup } from '../types/roles.types';

export function groupPermissionsByModule(permissions: Permission[]): PermissionGroup[] {
  const groupsMap = new Map<string, Permission[]>();

  for (const permission of permissions) {
    if (!groupsMap.has(permission.module)) {
      groupsMap.set(permission.module, []);
    }
    groupsMap.get(permission.module)!.push(permission);
  }

  const groups: PermissionGroup[] = [];
  for (const [module, modulePermissions] of groupsMap.entries()) {
    groups.push({
      module: module as PermissionGroup['module'],
      permissions: modulePermissions,
    });
  }

  // Optional: sort groups alphabetically by module name
  return groups.sort((a, b) => a.module.localeCompare(b.module));
}
