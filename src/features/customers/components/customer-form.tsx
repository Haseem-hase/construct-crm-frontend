'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { FormField } from '@/src/components/ui/form-field';
import { Input } from '@/src/components/ui/input';
import { Select } from '@/src/components/ui/select';
import { Textarea } from '@/src/components/ui/textarea';
import { Button } from '@/src/components/ui/button';
import { SuccessAlert } from '@/src/components/ui/success-alert';
import { Customer, CustomerType } from '../types/customer.types';
import { 
  createCustomer, 
  selectCreateCustomerStatus, 
  selectCreateCustomerError, 
  resetCreateState,
  selectCustomers,
  fetchCustomers
} from '../store/customersSlice';

export interface CustomerFormProps {
  initialData?: Customer;
}

export function CustomerForm({ initialData }: CustomerFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isEdit = !!initialData;
  
  const allCustomers = useAppSelector(selectCustomers);
  const status = useAppSelector(selectCreateCustomerStatus);
  const error = useAppSelector(selectCreateCustomerError);

  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (allCustomers.length === 0) {
      dispatch(fetchCustomers());
    }
    dispatch(resetCreateState());
    return () => { dispatch(resetCreateState()); };
  }, [dispatch, allCustomers.length]);

  const [formData, setFormData] = useState({
    type: initialData?.type || ('' as CustomerType | ''),
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    alternativePhone: initialData?.alternativePhone || '',
    country: initialData?.country || 'Saudi Arabia',
    city: initialData?.city || '',
    parentCustomerId: initialData?.parentCustomerId || 'no-parent',
    address: initialData?.address || ''
  });

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
    if (status === 'loading') return;
    
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Customer name is required';
    if (!formData.type) newErrors.type = 'Customer type is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (isEdit) {
      console.log('Edit mode not supported in this phase.');
      return;
    }

    const payload = {
      name: formData.name,
      type: formData.type as CustomerType,
      country: formData.country,
      city: formData.city,
      address: formData.address || undefined,
      parentCustomerId: formData.parentCustomerId === 'no-parent' ? undefined : formData.parentCustomerId,
    };

    const action = await dispatch(createCustomer(payload));

    if (createCustomer.fulfilled.match(action)) {
      setSuccessMessage(action.payload.message || "The customer was successfully created.");
      setShowSuccess(true);
      setTimeout(() => {
        router.push('/customers');
      }, 1500);
    }
  };

  return (
    <>
      <SuccessAlert 
        show={showSuccess} 
        title="Customer Created" 
        description={successMessage} 
      />
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full min-w-0">
        
        {status === 'failed' && error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <h3 className="font-medium">Failed to create customer</h3>
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
                />
              </FormField>

              <FormField label="Customer Name" required error={errors.name}>
                <Input 
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Enter customer name"
                  error={!!errors.name}
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
                />
              </FormField>

              <FormField label="City" required error={errors.city}>
                <Input 
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="Enter city"
                  error={!!errors.city}
                />
              </FormField>

              <FormField label="Parent Customer">
                <Select 
                  value={formData.parentCustomerId} 
                  onChange={(val) => handleChange('parentCustomerId', val)} 
                  options={parentOptions}
                />
              </FormField>

              <div className="col-span-1 md:col-span-2">
                <FormField label="Address">
                  <Textarea 
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="Enter customer address"
                    rows={3}
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
            disabled={status === 'loading' || showSuccess}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            className="w-full sm:w-auto"
            disabled={status === 'loading' || showSuccess}
          >
            {status === 'loading' ? 'Saving...' : (isEdit ? 'Save Changes' : 'Create Customer')}
          </Button>
        </div>
      </form>
    </>
  );
}
