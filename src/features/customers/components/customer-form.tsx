'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { FormField } from '@/src/components/ui/form-field';
import { Input } from '@/src/components/ui/input';
import { Select } from '@/src/components/ui/select';
import { Textarea } from '@/src/components/ui/textarea';
import { Button } from '@/src/components/ui/button';
import { SuccessAlert } from '@/src/components/ui/success-alert';
import { Customer, CustomerType, UpdateCustomerRequest } from '../types/customer.types';
import { 
  createCustomer, 
  updateCustomer,
  selectCreateCustomerStatus, 
  selectCreateCustomerError, 
  resetCreateState,
  selectUpdateCustomerStatus,
  selectUpdateCustomerError,
  resetUpdateState,
  selectCustomers,
  fetchCustomers
} from '../store/customersSlice';

export interface CustomerFormProps {
  mode?: 'create' | 'edit';
  initialData?: Customer;
}

export function CustomerForm({ mode, initialData }: CustomerFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isEdit = mode === 'edit' || !!initialData;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const allCustomers = useAppSelector(selectCustomers);
  const createStatus = useAppSelector(selectCreateCustomerStatus);
  const createError = useAppSelector(selectCreateCustomerError);
  const updateStatus = useAppSelector(selectUpdateCustomerStatus);
  const updateError = useAppSelector(selectUpdateCustomerError);

  const status = isEdit ? updateStatus : createStatus;
  const error = isEdit ? updateError : createError;
  const isSubmitting = status === 'loading';

  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (allCustomers.length === 0) {
      dispatch(fetchCustomers());
    }
    if (isEdit) {
      dispatch(resetUpdateState());
    } else {
      dispatch(resetCreateState());
    }
    return () => { 
      if (isEdit) {
        dispatch(resetUpdateState());
      } else {
        dispatch(resetCreateState());
      }
    };
  }, [dispatch, isEdit, allCustomers.length]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const [formData, setFormData] = useState({
    type: initialData?.type || ('' as CustomerType | ''),
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    alternativePhone: initialData?.alternativePhone || '',
    country: initialData?.country || 'Saudi Arabia',
    city: initialData?.city || '',
    parentCustomerId: initialData?.parentCustomerId || 'no-parent',
    address: initialData?.address || '',
    isActive: initialData?.isActive ?? true
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        type: initialData.type || ('' as CustomerType | ''),
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        alternativePhone: initialData.alternativePhone || '',
        country: initialData.country || 'Saudi Arabia',
        city: initialData.city || '',
        parentCustomerId: initialData.parentCustomerId || 'no-parent',
        address: initialData.address || '',
        isActive: initialData.isActive ?? true
      });
      setErrors({});
    }
  }, [initialData]);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const customerTypeOptions = [
    { value: 'COMPANY', label: 'Company' },
    { value: 'GOVERNMENT', label: 'Government' },
    { value: 'INDIVIDUAL', label: 'Individual' },
    { value: 'OTHER', label: 'Other' },
  ];

  const countryOptions = [
    { value: 'Saudi Arabia', label: 'Saudi Arabia' },
    { value: 'United Arab Emirates', label: 'United Arab Emirates' },
    { value: 'Qatar', label: 'Qatar' },
    { value: 'Bahrain', label: 'Bahrain' },
    { value: 'Kuwait', label: 'Kuwait' },
    { value: 'Oman', label: 'Oman' },
  ];

  const parentOptions = [
    { value: 'no-parent', label: 'No Parent' },
    ...allCustomers
      .filter(c => (c.type === 'COMPANY' || c.type === 'GOVERNMENT') && c.id !== initialData?.id)
      .map(c => ({
        value: c.id,
        label: c.name
      }))
  ];

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    const newErrors: { [key: string]: string } = {};
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      newErrors.name = 'Customer name is required';
    } else if (trimmedName.length < 2) {
      newErrors.name = 'Customer name must be at least 2 characters';
    } else if (trimmedName.length > 150) {
      newErrors.name = 'Customer name must not exceed 150 characters';
    }

    if (!formData.type) newErrors.type = 'Customer type is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (isEdit) {
      if (!initialData?.id) return;

      const payload: UpdateCustomerRequest = {
        name: trimmedName,
        type: formData.type as CustomerType,
        country: formData.country.trim(),
        city: formData.city.trim(),
        address: formData.address.trim() || undefined,
        parentCustomerId: formData.parentCustomerId === 'no-parent' ? undefined : formData.parentCustomerId,
        isActive: formData.isActive,
      };

      const action = await dispatch(updateCustomer({ id: initialData.id, payload }));

      if (updateCustomer.fulfilled.match(action)) {
        setSuccessMessage(action.payload.message || 'Customer updated successfully.');
        setShowSuccess(true);
        timeoutRef.current = setTimeout(() => {
          router.push(`/customers/${initialData.id}`);
        }, 1500);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    const payload = {
      name: trimmedName,
      type: formData.type as CustomerType,
      country: formData.country.trim(),
      city: formData.city.trim(),
      address: formData.address.trim() || undefined,
      parentCustomerId: formData.parentCustomerId === 'no-parent' ? undefined : formData.parentCustomerId,
    };

    const action = await dispatch(createCustomer(payload));

    if (createCustomer.fulfilled.match(action)) {
      setSuccessMessage(action.payload.message || "The customer was successfully created.");
      setShowSuccess(true);
      timeoutRef.current = setTimeout(() => {
        router.push('/customers');
      }, 1500);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <SuccessAlert 
        show={showSuccess} 
        title={isEdit ? "Customer Updated" : "Customer Created"} 
        description={successMessage} 
      />
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full min-w-0">
        
        {status === 'failed' && error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <h3 className="font-medium">{isEdit ? 'Failed to update customer' : 'Failed to create customer'}</h3>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Customer Type" required error={errors.type}>
                <Select 
                  value={formData.type} 
                  onChange={(val) => handleChange('type', val)} 
                  options={customerTypeOptions}
                  placeholder="Select a type"
                  error={!!errors.type}
                  disabled={isSubmitting}
                />
              </FormField>

              <FormField label="Customer Name" required error={errors.name}>
                <Input 
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Enter customer name"
                  error={!!errors.name}
                  disabled={isSubmitting}
                />
              </FormField>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact & Address</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg text-blue-800 text-sm">
              Note: Contact management (Email, Phone) is not integrated in this phase. The fields below are visually retained but their values will not be saved.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Email">
                <Input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="Enter email address"
                  disabled
                />
              </FormField>

              <FormField label="Phone">
                <Input 
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                  disabled
                />
              </FormField>

              <FormField label="Alternative Phone">
                <Input 
                  type="tel"
                  value={formData.alternativePhone}
                  onChange={(e) => handleChange('alternativePhone', e.target.value)}
                  placeholder="Enter alternative phone"
                  disabled
                />
              </FormField>

              <FormField label="Country" required error={errors.country}>
                <Select 
                  value={formData.country} 
                  onChange={(val) => handleChange('country', val)} 
                  options={countryOptions}
                  error={!!errors.country}
                  disabled={isSubmitting}
                />
              </FormField>

              <FormField label="City" required error={errors.city}>
                <Input 
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="Enter city"
                  error={!!errors.city}
                  disabled={isSubmitting}
                />
              </FormField>

              <FormField label="Parent Customer">
                <Select 
                  value={formData.parentCustomerId} 
                  onChange={(val) => handleChange('parentCustomerId', val)} 
                  options={parentOptions}
                  disabled={isSubmitting}
                />
              </FormField>

              <div className="col-span-1 md:col-span-2">
                <FormField label="Address">
                  <Textarea 
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="Enter customer address"
                    rows={3}
                    disabled={isSubmitting}
                  />
                </FormField>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <Button 
            variant="outline" 
            type="button" 
            className="w-full sm:w-auto"
            onClick={() => {
              if (isEdit && initialData) {
                router.push(`/customers/${initialData.id}`);
              } else {
                router.push('/customers');
              }
            }}
            disabled={isSubmitting || showSuccess}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            className="w-full sm:w-auto"
            disabled={isSubmitting || showSuccess}
          >
            {isSubmitting ? 'Saving...' : (isEdit ? 'Save Changes' : 'Create Customer')}
          </Button>
        </div>
      </form>
    </>
  );
}
