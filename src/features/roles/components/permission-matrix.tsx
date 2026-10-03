'use client';

import React, { useRef, useEffect } from 'react';
import { PermissionModule } from '../types/roles.types';

interface PermissionMatrixProps {
  modules: PermissionModule[];
  selectedPermissions: string[];
  mode: 'read-only' | 'edit';
  onChange?: (selectedPermissions: string[]) => void;
}

// Helper to calculate module selection state
function getModuleSelectionState(module: PermissionModule, selectedPermissions: string[]) {
  const moduleKeys = module.actions.map(a => `${module.id}:${a}`);
  const selectedCount = moduleKeys.filter(k => selectedPermissions.includes(k)).length;
  
  if (selectedCount === 0) return 'none';
  if (selectedCount === moduleKeys.length) return 'all';
  return 'some';
}

export function PermissionMatrix({
  modules,
  selectedPermissions,
  mode,
  onChange
}: PermissionMatrixProps) {
  const isReadOnly = mode === 'read-only';

  const handleTogglePermission = (permissionKey: string) => {
    if (isReadOnly || !onChange) return;
    
    if (selectedPermissions.includes(permissionKey)) {
      onChange(selectedPermissions.filter(k => k !== permissionKey));
    } else {
      onChange([...selectedPermissions, permissionKey]);
    }
  };

  const handleToggleModule = (module: PermissionModule) => {
    if (isReadOnly || !onChange) return;

    const moduleKeys = module.actions.map(a => `${module.id}:${a}`);
    const state = getModuleSelectionState(module, selectedPermissions);

    if (state === 'all') {
      // Deselect all
      onChange(selectedPermissions.filter(k => !moduleKeys.includes(k)));
    } else {
      // Select all (add missing)
      const missingKeys = moduleKeys.filter(k => !selectedPermissions.includes(k));
      onChange([...selectedPermissions, ...missingKeys]);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {modules.map(module => {
        const selectionState = getModuleSelectionState(module, selectedPermissions);
        
        return (
          <div key={module.id} className="border border-neutral-200/60 rounded-lg overflow-hidden bg-white">
            <div className="bg-neutral-50/50 px-4 py-3 border-b border-neutral-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-medium text-neutral-900">{module.name}</h4>
                {module.description && (
                  <p className="text-xs text-neutral-500 mt-0.5">{module.description}</p>
                )}
              </div>
              
              {!isReadOnly && (
                <label className="flex items-center gap-2 text-sm text-neutral-600 cursor-pointer hover:text-neutral-900 group shrink-0">
                  <span className="select-none">Select All</span>
                  <IndeterminateCheckbox 
                    checked={selectionState === 'all'} 
                    indeterminate={selectionState === 'some'}
                    onChange={() => handleToggleModule(module)}
                    aria-label={`Select all ${module.name} permissions`}
                  />
                </label>
              )}
            </div>
            
            <div className="p-4 grid grid-cols-1 min-[480px]:grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap gap-4">
              {module.actions.map(action => {
                const permissionKey = `${module.id}:${action}`;
                const isSelected = selectedPermissions.includes(permissionKey);
                
                if (isReadOnly) {
                  return (
                    <div 
                      key={action} 
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
                      <span className="capitalize">{action}</span>
                    </div>
                  );
                }

                return (
                  <label 
                    key={action} 
                    className={`
                      flex items-center gap-3 px-3 py-2 md:py-1.5 rounded-md border text-sm cursor-pointer transition-colors w-full md:w-auto
                      hover:bg-neutral-50
                      ${isSelected ? 'border-neutral-900 ring-1 ring-neutral-900 bg-neutral-50/50' : 'border-neutral-200'}
                    `}
                  >
                    <input 
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleTogglePermission(permissionKey)}
                      className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 cursor-pointer accent-neutral-900"
                    />
                    <span className="capitalize text-neutral-700 select-none">{action}</span>
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
