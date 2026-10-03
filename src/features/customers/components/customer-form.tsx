'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/src/components/ui/card';
import { FormField } from '@/src/components/ui/form-field';
import { Input } from '@/src/components/ui/input';
import { Select } from '@/src/components/ui/select';
import { Textarea } from '@/src/components/ui/textarea';
import { Button } from '@/src/components/ui/button';
import { mockCustomers } from '../data/customers.mock';
import { Customer, CustomerType } from '../types/customer.types';

export interface CustomerFormProps {
  initialData?: Customer;
}

export function CustomerForm({ initialData }: CustomerFormProps) {
  const router = useRouter();
  const isEdit = !!initialData;
  
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
    ...mockCustomers
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Customer name is required';
    if (!formData.type) newErrors.type = 'Customer type is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log(isEdit ? 'Customer updated:' : 'Customer created:', formData);
    if (isEdit && initialData) {
      router.push(`/customers/${initialData.customerCode.toLowerCase()}`);
    } else {
      router.push('/customers');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full min-w-0">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Email">
              <Input 
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="Enter email address"
              />
            </FormField>

            <FormField label="Phone">
              <Input 
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="Enter phone number"
              />
            </FormField>

            <FormField label="Alternative Phone">
              <Input 
                type="tel"
                value={formData.alternativePhone}
                onChange={(e) => handleChange('alternativePhone', e.target.value)}
                placeholder="Enter alternative phone"
              />
            </FormField>

            <FormField label="Country">
              <Select 
                value={formData.country} 
                onChange={(val) => handleChange('country', val)} 
                options={countryOptions}
              />
            </FormField>

            <FormField label="City">
              <Input 
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="Enter city"
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
              router.push(`/customers/${initialData.customerCode.toLowerCase()}`);
            } else {
              router.push('/customers');
            }
          }}
        >
          Cancel
        </Button>
        <Button variant="primary" type="submit" className="w-full sm:w-auto">
          {isEdit ? 'Save Changes' : 'Create Customer'}
        </Button>
      </div>
    </form>
  );
}
