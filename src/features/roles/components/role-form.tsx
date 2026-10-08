'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { FormField } from '@/src/components/ui/form-field';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import { Button } from '@/src/components/ui/button';
import { PermissionMatrix } from './permission-matrix';
import { OrganizationRole } from '../types/roles.types';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { fetchPermissions, selectPermissions, selectPermissionsStatus, selectPermissionsError } from '../store/permissionsSlice';
import { groupPermissionsByModule } from '../utils/roles.utils';

import { SuccessAlert } from '@/src/components/ui/success-alert';
import { 
  createRole, 
  selectCreateRoleStatus, 
  selectCreateRoleError, 
  resetCreateState 
} from '../store/rolesSlice';

export interface RoleFormProps {
  mode: 'create' | 'edit';
  initialData?: OrganizationRole;
}

export function RoleForm({ mode, initialData }: RoleFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isEdit = mode === 'edit';
  const isGlobal = isEdit && initialData?.role.isGlobal;
  
  const [formData, setFormData] = useState({
    name: initialData?.role.name || '',
    description: initialData?.role.description || '',
    permissionIds: initialData?.rolePermissions?.map(rp => rp.permission.id) || [],
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  
  const permissions = useAppSelector(selectPermissions);
  const status = useAppSelector(selectPermissionsStatus);
  const permissionsError = useAppSelector(selectPermissionsError);

  const createStatus = useAppSelector(selectCreateRoleStatus);
  const createError = useAppSelector(selectCreateRoleError);

  const isSubmitting = createStatus === 'loading';

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPermissions());
    }
  }, [status, dispatch]);

  useEffect(() => {
    // Reset create state when form mounts so it doesn't show old errors
    if (!isEdit) {
      dispatch(resetCreateState());
    }
  }, [dispatch, isEdit]);

  const permissionGroups = useMemo(() => {
    return groupPermissionsByModule(permissions);
  }, [permissions]);

  const handleChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { [key: string]: string } = {};
    const trimmedName = formData.name.trim();
    
    if (!isGlobal) {
      if (!trimmedName) {
        newErrors.name = 'Role name is required';
      } else if (trimmedName.length < 2) {
        newErrors.name = 'Role name must be at least 2 characters';
      } else if (trimmedName.length > 50) {
        newErrors.name = 'Role name must not exceed 50 characters';
      }

      if (formData.description && formData.description.length > 255) {
        newErrors.description = 'Description must not exceed 255 characters';
      }
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (isEdit) {
      // Edit logic will be implemented in a future phase
      console.log('Edit mode not fully implemented yet');
      // Simulate 800ms API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      router.push(`/roles/${initialData?.id}`);
      return;
    }

    // Create mode
    try {
      const payload = {
        name: trimmedName,
        description: formData.description.trim() || undefined,
        permissionIds: formData.permissionIds
      };
      
      const resultAction = await dispatch(createRole(payload));
      
      if (createRole.fulfilled.match(resultAction)) {
        // Success
        setShowSuccessAlert(true);
        setTimeout(() => {
          router.push('/roles');
        }, 1500);
      } else {
        // Reject is handled by Redux state, will show error message UI below
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Failed to create role:', error);
    }
  };

  const handleCancel = () => {
    if (isEdit && initialData?.id) {
      router.push(`/roles/${initialData.id}`);
    } else {
      router.push('/roles');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full min-w-0">
      <SuccessAlert 
        title="Role created successfully" 
        description="Your custom role has been created successfully." 
        show={showSuccessAlert} 
      />
      
      {createStatus === 'failed' && createError && (
        <div className="p-4 rounded-md bg-red-50 text-red-700 border border-red-200">
          <h4 className="font-medium mb-1">Failed to Create Role</h4>
          <p className="text-sm">{createError}</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Role Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 max-w-2xl">
            {isGlobal && (
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-md">
                <p className="text-sm text-neutral-600">
                  <span className="font-medium text-neutral-900">Note:</span> This is a global system role. The role name and description are managed by the system. You can configure the permissions for your organization.
                </p>
              </div>
            )}

            <FormField label="Role Name" required={!isGlobal} error={errors.name}>
              <Input 
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter role name"
                error={!!errors.name}
                disabled={isSubmitting || !!isGlobal}
                readOnly={!!isGlobal}
              />
            </FormField>

            <FormField label="Description" error={errors.description}>
              <Textarea 
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Briefly describe what this role does"
                rows={3}
                disabled={isSubmitting || !!isGlobal}
                readOnly={!!isGlobal}
              />
            </FormField>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Permissions</CardTitle>
        </CardHeader>
        <CardContent>
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
            <PermissionMatrix 
              modules={permissionGroups}
              selectedPermissionIds={formData.permissionIds}
              mode="edit"
              onChange={(newPermissions) => handleChange('permissionIds', newPermissions)}
            />
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
        <Button 
          variant="outline" 
          type="button" 
          className="w-full sm:w-auto"
          disabled={isSubmitting}
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button 
          variant="primary" 
          type="submit" 
          className="w-full sm:w-auto"
          disabled={isSubmitting || status === 'loading' || status === 'failed'}
        >
          {isSubmitting ? 'Saving...' : (isEdit ? (isGlobal ? 'Save Permissions' : 'Save Changes') : 'Create Role')}
        </Button>
      </div>
    </form>
  );
}

