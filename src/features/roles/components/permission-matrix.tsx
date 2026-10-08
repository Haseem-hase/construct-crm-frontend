'use client';

import React, { useRef, useEffect } from 'react';
import { PermissionGroup } from '../types/roles.types';

interface PermissionMatrixProps {
  modules: PermissionGroup[];
  selectedPermissionIds: string[];
  mode: 'read-only' | 'edit';
  onChange?: (selectedPermissionIds: string[]) => void;
}

// Helper to calculate module selection state
function getModuleSelectionState(group: PermissionGroup, selectedPermissionIds: string[]) {
  const moduleIds = group.permissions.map(p => p.id);
  if (moduleIds.length === 0) return 'none';
  
  const selectedCount = moduleIds.filter(id => selectedPermissionIds.includes(id)).length;
  
  if (selectedCount === 0) return 'none';
  if (selectedCount === moduleIds.length) return 'all';
  return 'some';
}

export function PermissionMatrix({
  modules,
  selectedPermissionIds,
  mode,
  onChange
}: PermissionMatrixProps) {
  const isReadOnly = mode === 'read-only';

  const handleTogglePermission = (permissionId: string) => {
    if (isReadOnly || !onChange) return;
    
    if (selectedPermissionIds.includes(permissionId)) {
      onChange(selectedPermissionIds.filter(id => id !== permissionId));
    } else {
      onChange([...selectedPermissionIds, permissionId]);
    }
  };

  const handleToggleModule = (group: PermissionGroup) => {
    if (isReadOnly || !onChange) return;

    const moduleIds = group.permissions.map(p => p.id);
    const state = getModuleSelectionState(group, selectedPermissionIds);

    if (state === 'all') {
      // Deselect all
      onChange(selectedPermissionIds.filter(id => !moduleIds.includes(id)));
    } else {
      // Select all (add missing)
      const missingIds = moduleIds.filter(id => !selectedPermissionIds.includes(id));
      onChange([...selectedPermissionIds, ...missingIds]);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {modules.map(group => {
        const selectionState = getModuleSelectionState(group, selectedPermissionIds);
        
        return (
          <div key={group.module} className="border border-neutral-200/60 rounded-lg overflow-hidden bg-white">
            <div className="bg-neutral-50/50 px-4 py-3 border-b border-neutral-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-medium text-neutral-900">{group.module}</h4>
              </div>
              
              {!isReadOnly && (
                <label className="flex items-center gap-2 text-sm text-neutral-600 cursor-pointer hover:text-neutral-900 label-shrink-0 group">
                  <span className="select-none">Select All</span>
                  <IndeterminateCheckbox 
                    checked={selectionState === 'all'} 
                    indeterminate={selectionState === 'some'}
                    onChange={() => handleToggleModule(group)}
                    aria-label={`Select all ${group.module} permissions`}
                  />
                </label>
              )}
            </div>
            
            <div className="p-4 grid grid-cols-1 min-[480px]:grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap gap-4">
              {group.permissions.map(permission => {
                const isSelected = selectedPermissionIds.includes(permission.id);
                
                if (isReadOnly) {
                  return (
                    <div 
                      key={permission.id} 
                      className={`
                        flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm w-full md:w-auto
                        ${isSelected 
                          ? 'bg-neutral-900 text-white border-neutral-900' 
                          : 'bg-white text-neutral-400 border-neutral-200'
                        }
                      `}
                    >
                      {isSelected ? (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                          <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <div className="w-3 h-3 rounded-full border border-neutral-300" aria-hidden="true" />
                      )}
                      <span className="capitalize">{permission.action.toLowerCase()}</span>
                    </div>
                  );
                }

                return (
                  <label 
                    key={permission.id} 
                    className={`
                      flex items-center gap-3 px-3 py-2 md:py-1.5 rounded-md border text-sm cursor-pointer transition-colors w-full md:w-auto
                      hover:bg-neutral-50
                      ${isSelected ? 'border-neutral-900 ring-1 ring-neutral-900 bg-neutral-50/50' : 'border-neutral-200'}
                    `}
                  >
                    <input 
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleTogglePermission(permission.id)}
                      className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 cursor-pointer accent-neutral-900"
                    />
                    <span className="capitalize text-neutral-700 select-none">{permission.action.toLowerCase()}</span>
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// A simple wrapper around a native checkbox to support the indeterminate visual state
function IndeterminateCheckbox({ 
  checked, 
  indeterminate, 
  onChange,
  ...rest 
}: { 
  checked: boolean, 
  indeterminate: boolean, 
  onChange: () => void 
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <input 
      type="checkbox" 
      ref={ref} 
      checked={checked} 
      onChange={onChange}
      className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 cursor-pointer accent-neutral-900"
      {...rest}
    />
  );
}
