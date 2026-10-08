import React from 'react';
import { Card } from '@/src/components/ui/card';
import { OrganizationRole } from '../types/roles.types';
import { mockPermissionGroups } from '../data/roles.mock';

interface RoleDetailsPermissionsProps {
  role: OrganizationRole;
}

export function RoleDetailsPermissions({ role: orgRole }: RoleDetailsPermissionsProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-neutral-900">Configured Permissions</h3>
      </div>
      
      <div className="flex flex-col gap-6">
        {mockPermissionGroups.map((group) => {
          return (
            <div key={group.module} className="border border-neutral-200/60 rounded-lg overflow-hidden">
              <div className="bg-neutral-50/50 px-4 py-3 border-b border-neutral-200/60">
                <h4 className="text-sm font-medium text-neutral-900">{group.module}</h4>
              </div>
              
              <div className="p-4 bg-white flex flex-wrap gap-4">
                {group.permissions.map((permission) => {
                  const isSelected = orgRole.rolePermissions?.some(rp => 
                    rp.permission.module === permission.module && rp.permission.action === permission.action
                  );
                  
                  return (
                    <div 
                      key={permission.id} 
                      className={`
                        flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm
                        ${isSelected 
                          ? 'bg-neutral-900 text-white border-neutral-900' 
                          : 'bg-white text-neutral-400 border-neutral-200'
                        }
                      `}
                    >
                      {isSelected ? (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <div className="w-3 h-3 rounded-full border border-neutral-300" />
                      )}
                      <span className="capitalize">{permission.action.toLowerCase()}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

