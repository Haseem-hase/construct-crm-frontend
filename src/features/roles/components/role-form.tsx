'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { FormField } from '@/src/components/ui/form-field';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import { Button } from '@/src/components/ui/button';
import { PermissionMatrix } from './permission-matrix';
import { mockPermissionGroups } from '../data/roles.mock';
import { OrganizationRole } from '../types/roles.types';

export interface RoleFormProps {
  mode: 'create' | 'edit';
  initialData?: OrganizationRole;
}

export function RoleForm({ mode, initialData }: RoleFormProps) {
  const router = useRouter();
  const isEdit = mode === 'edit';
  const isGlobal = isEdit && initialData?.role.isGlobal;
  
  const [formData, setFormData] = useState({
    name: initialData?.role.name || '',
    description: initialData?.role.description || '',
    permissionIds: initialData?.rolePermissions?.map(rp => rp.permission.id) || [],
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    setIsSubmitting(true);

    try {
      // Simulate 800ms API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      if (isGlobal) {
        const payload = {
          id: initialData?.id,
          permissionIds: formData.permissionIds
        };
        console.log('Global Role permissions configured:', payload);
      } else {
        const payload = {
          ...(isEdit ? { id: initialData?.id } : {}),
          name: trimmedName,
          description: formData.description.trim(),
          permissionIds: formData.permissionIds
        };
        console.log(isEdit ? 'Custom Role updated:' : 'Custom Role created:', payload);
      }
      
      if (isEdit && initialData?.id) {
        router.push(`/roles/${initialData.id}`);
      } else {
        router.push('/roles');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
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
          <PermissionMatrix 
            modules={mockPermissionGroups}
            selectedPermissionIds={formData.permissionIds}
            mode="edit"
            onChange={(newPermissions) => handleChange('permissionIds', newPermissions)}
          />
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
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : (isEdit ? (isGlobal ? 'Save Permissions' : 'Save Changes') : 'Create Role')}
        </Button>
      </div>
    </form>
  );
}

