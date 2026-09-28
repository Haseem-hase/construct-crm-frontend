'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import { Select } from '@/src/components/ui/select';
import { FormField } from '@/src/components/ui/form-field';
import { Contractor } from '../types/contractor.types';
import { SAUDI_CITIES } from '../data/contractor-options';

interface ContractorFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<Contractor>;
}

export function ContractorForm({ mode, initialData }: ContractorFormProps) {
  const router = useRouter();

  // Contractor Information
  const [companyName, setCompanyName] = useState(initialData?.companyName || '');
  const [contactPerson, setContactPerson] = useState(initialData?.contactPerson || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [alternativePhone, setAlternativePhone] = useState(initialData?.alternativePhone || '');

  // Location
  const [country, setCountry] = useState(initialData?.country || 'Saudi Arabia');
  const [city, setCity] = useState(initialData?.city || '');
  const [address, setAddress] = useState(initialData?.address || '');

  // Legal & License Information
  const [nationalId, setNationalId] = useState(initialData?.nationalId || '');
  const [licenseNumber, setLicenseNumber] = useState(initialData?.licenseNumber || '');
  const [licenseExpiryDate, setLicenseExpiryDate] = useState(initialData?.licenseExpiryDate?.split('T')[0] || '');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cityOptions = [
    { value: '', label: 'Select city' },
    ...SAUDI_CITIES.map(c => ({ value: c, label: c }))
  ];

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!companyName.trim()) newErrors.companyName = 'Company name is required.';
    if (!contactPerson.trim()) newErrors.contactPerson = 'Contact person is required.';
    if (!phone.trim()) newErrors.phone = 'Phone is required.';
    if (!city.trim()) newErrors.city = 'City is required.';
    if (!licenseNumber.trim()) newErrors.licenseNumber = 'License number is required.';

    if (email.trim() && !/^\S+@\S+\.\S+$/.test(email.trim())) {
      newErrors.email = 'Enter a valid email address.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Mock API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    console.log('Submitted Mock Payload:', {
      companyName: companyName.trim(),
      contactPerson: contactPerson.trim(),
      email: email.trim(),
      phone: phone.trim(),
      alternativePhone: alternativePhone.trim(),
      country: country.trim(),
      city: city.trim(),
      address: address.trim(),
      nationalId: nationalId.trim(),
      licenseNumber: licenseNumber.trim(),
      licenseExpiryDate: licenseExpiryDate ? new Date(licenseExpiryDate).toISOString() : undefined
    });

    if (mode === 'edit' && initialData?.id) {
      router.push(`/contractors/${initialData.id}`);
    } else {
      router.push('/contractors');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full min-w-0">
      
      {mode === 'create' && (
        <div className="bg-neutral-50 border border-neutral-200 rounded-md p-3 text-[14px] text-neutral-600">
          <strong>Note:</strong> Contractor code will be generated automatically.
        </div>
      )}

      {/* Card 1: Contractor Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contractor Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Company Name" required error={errors.companyName}>
              <Input
                placeholder="Enter company name"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
              />
            </FormField>

            <FormField label="Contact Person" required error={errors.contactPerson}>
              <Input
                placeholder="Enter contact person's name"
                value={contactPerson}
                onChange={e => setContactPerson(e.target.value)}
              />
            </FormField>

            <FormField label="Email" error={errors.email}>
              <Input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </FormField>

            <FormField label="Phone" required error={errors.phone}>
              <Input
                type="tel"
                placeholder="+966 50 000 0000"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </FormField>

            <FormField label="Alternative Phone" error={errors.alternativePhone}>
              <Input
                type="tel"
                placeholder="Optional secondary number"
                value={alternativePhone}
                onChange={e => setAlternativePhone(e.target.value)}
              />
            </FormField>
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Location */}
      <Card>
        <CardHeader>
          <CardTitle>Location</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Country" error={errors.country}>
              <Input
                placeholder="Enter country"
                value={country}
                onChange={e => setCountry(e.target.value)}
              />
            </FormField>

            <FormField label="City" required error={errors.city}>
              <Select
                options={cityOptions}
                value={city}
                onChange={val => setCity(val)}
              />
            </FormField>

            <div className="md:col-span-2">
              <FormField label="Address" error={errors.address}>
                <Textarea
                  placeholder="Enter full address"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  rows={3}
                />
              </FormField>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card 3: Legal & License Information */}
      <Card>
        <CardHeader>
          <CardTitle>Legal & License Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="National ID" error={errors.nationalId}>
              <Input
                type="text"
                placeholder="e.g. 10xxxxxxxx"
                value={nationalId}
                onChange={e => setNationalId(e.target.value)}
              />
            </FormField>

            <FormField label="License Number" required error={errors.licenseNumber}>
              <Input
                placeholder="Enter commercial license number"
                value={licenseNumber}
                onChange={e => setLicenseNumber(e.target.value)}
              />
            </FormField>

            <FormField label="License Expiry Date" error={errors.licenseExpiryDate}>
              <Input
                type="date"
                value={licenseExpiryDate}
                onChange={e => setLicenseExpiryDate(e.target.value)}
              />
            </FormField>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mb-10">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/contractors')}
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          className="w-full sm:w-auto"
        >
          {mode === 'create' ? 'Create Contractor' : 'Save Changes'}
        </Button>
      </div>

    </form>
  );
}
