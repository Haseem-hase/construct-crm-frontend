'use client';

import React, { useEffect, useMemo } from 'react';
import { Card } from '@/src/components/ui/card';
import { OrganizationRole } from '../types/roles.types';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { fetchPermissions, selectPermissions, selectPermissionsStatus, selectPermissionsError } from '../store/permissionsSlice';
import { groupPermissionsByModule } from '../utils/roles.utils';
import { Button } from '@/src/components/ui/button';

interface RoleDetailsPermissionsProps {
  role: OrganizationRole;
}

export function RoleDetailsPermissions({ role: orgRole }: RoleDetailsPermissionsProps) {
  const dispatch = useAppDispatch();
  const permissions = useAppSelector(selectPermissions);
  const status = useAppSelector(selectPermissionsStatus);
  const permissionsError = useAppSelector(selectPermissionsError);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPermissions());
    }
  }, [status, dispatch]);

  const permissionGroups = useMemo(() => {
    return groupPermissionsByModule(permissions);
  }, [permissions]);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-neutral-900">Configured Permissions</h3>
      </div>
      
      {status === 'loading' || status === 'idle' ? (
        <div className="flex flex-col items-center justify-center py-12 text-neutral-500">
          <svg className="w-8 h-8 animate-spin mb-4 text-neutral-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p>Loading permissions...</p>
        </div>
      ) : status === 'failed' ? (
        <div className="p-4 rounded-md bg-red-50 text-red-700 border border-red-200">
          <h4 className="font-medium mb-1">Error Loading Permissions</h4>
          <p className="text-sm">{permissionsError}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-3 bg-white hover:bg-red-50 text-red-700 border-red-200 hover:border-red-300"
            onClick={() => dispatch(fetchPermissions())}
          >
            Retry
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {permissionGroups.map((group) => {
            return (
              <div key={group.module} className="border border-neutral-200/60 rounded-lg overflow-hidden">
                <div className="bg-neutral-50/50 px-4 py-3 border-b border-neutral-200/60">
                  <h4 className="text-sm font-medium text-neutral-900">{group.module}</h4>
                </div>
                
                <div className="p-4 bg-white flex flex-wrap gap-4">
                  {group.permissions.map((permission) => {
                    const isSelected = orgRole.rolePermissions?.some(rp => 
                      rp.permission.id === permission.id
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
      )}
    </Card>
  );
}

