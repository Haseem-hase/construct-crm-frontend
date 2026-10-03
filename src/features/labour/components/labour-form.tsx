'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import { Select } from '@/src/components/ui/select';
import { FormField } from '@/src/components/ui/form-field';
import { User } from '@/src/components/ui/icons';
import { ConfirmationDialog } from '@/src/components/ui/confirmation-dialog';
import { Labour } from '../types/labour.types';
import { SAUDI_CITIES, LABOUR_PROFESSIONS } from '../data/labour-options';

interface LabourFormProps {
  mode?: 'create' | 'edit';
  initialData?: Partial<Labour>;
}

export function LabourForm({ mode = 'create', initialData }: LabourFormProps) {
  const router = useRouter();

  // Card 1 — Labour Information
  const [fullName, setFullName] = useState(initialData?.fullName || '');
  const [professionId, setProfessionId] = useState(initialData?.professionId || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [dateOfBirth, setDateOfBirth] = useState(initialData?.dateOfBirth?.split('T')[0] || '');
  const [joiningDate, setJoiningDate] = useState(initialData?.joiningDate?.split('T')[0] || '');

  // Card 2 — Profile Image
  const [profileImageUrl, setProfileImageUrl] = useState(initialData?.profileImageUrl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);

  // Card 3 — Location
  const [country, setCountry] = useState(initialData?.country || 'Saudi Arabia');
  const [city, setCity] = useState(initialData?.city || '');
  const [address, setAddress] = useState(initialData?.address || '');

  // Card 4 — Emergency Contact
  const [emergencyContactName, setEmergencyContactName] = useState(initialData?.emergencyContactName || '');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState(initialData?.emergencyContactPhone || '');

  // Card 5 — Additional Information
  const [notes, setNotes] = useState(initialData?.notes || '');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cityOptions = [
    { value: '', label: 'Select city' },
    ...SAUDI_CITIES.map(c => ({ value: c, label: c }))
  ];

  const professionOptions = [
    { value: '', label: 'Select profession' },
    ...LABOUR_PROFESSIONS
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Invalid file type. Only JPEG, PNG, and WEBP are allowed.');
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setProfileImageUrl(imageUrl);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = () => {
    setProfileImageUrl('');
    setIsRemoveDialogOpen(false);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!professionId.trim()) newErrors.professionId = 'Profession is required.';
    if (!phone.trim()) newErrors.phone = 'Phone number is required.';
    if (!country.trim()) newErrors.country = 'Country is required.';
    if (!city.trim()) newErrors.city = 'City is required.';

    if (email.trim() && !/^\S+@\S+\.\S+$/.test(email.trim())) {
      newErrors.email = 'Enter a valid email address.';
    }

    const today = new Date().toISOString().split('T')[0];
    if (dateOfBirth && dateOfBirth > today) {
      newErrors.dateOfBirth = 'Date of birth cannot be in the future.';
    }
    if (joiningDate && joiningDate > today) {
      newErrors.joiningDate = 'Joining date cannot be in the future.';
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
      professionId,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      dateOfBirth: dateOfBirth || undefined,
      profileImageUrl: profileImageUrl || undefined,
      country: country.trim(),
      city: city.trim(),
      address: address.trim() || undefined,
      emergencyContactName: emergencyContactName.trim() || undefined,
      emergencyContactPhone: emergencyContactPhone.trim() || undefined,
      joiningDate: joiningDate ? new Date(joiningDate).toISOString() : undefined,
      notes: notes.trim() || undefined
    });

    if (mode === 'edit' && initialData?.id) {
      router.push(`/labour/${initialData.id}`);
    } else {
      router.push('/labour');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full min-w-0">
      
      {/* Card 1: Labour Information */}
      <Card>
        <CardHeader>
          <CardTitle>Labour Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Full Name" required error={errors.fullName}>
              <Input
                placeholder="Enter full name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
              />
            </FormField>

            <FormField label="Profession" required error={errors.professionId}>
              <Select
                options={professionOptions}
                value={professionId}
                onChange={val => setProfessionId(val)}
              />
            </FormField>

            <FormField label="Phone" required error={errors.phone}>
              <Input
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </FormField>

            <FormField label="Email" error={errors.email}>
              <Input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </FormField>

            <FormField label="Date of Birth" error={errors.dateOfBirth}>
              <Input
                type="date"
                value={dateOfBirth}
                onChange={e => setDateOfBirth(e.target.value)}
              />
            </FormField>

            <FormField label="Joining Date" error={errors.joiningDate}>
              <Input
                type="date"
                value={joiningDate}
                onChange={e => setJoiningDate(e.target.value)}
              />
            </FormField>
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-[72px] h-[72px] md:w-[96px] md:h-[96px] shrink-0 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center overflow-hidden">
              {profileImageUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img 
                  src={profileImageUrl} 
                  alt="Profile Preview" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 md:w-10 md:h-10 text-neutral-400" />
              )}
            </div>
            
            <div className="flex flex-col gap-1 items-start sm:items-center">
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/jpeg, image/png, image/webp" 
                onChange={handleFileChange} 
              />
              <Button 
                type="button"
                variant="ghost" 
                size="sm" 
                onClick={() => fileInputRef.current?.click()}
                className="text-xs h-7 px-2"
              >
                {profileImageUrl ? 'Change Photo' : 'Add Profile Photo'}
              </Button>
              {profileImageUrl && (
                <Button 
                  type="button"
                  variant="ghost" 
                  size="sm" 
                  className="text-xs h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => setIsRemoveDialogOpen(true)}
                >
                  Remove Photo
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card 3: Location */}
      <Card>
        <CardHeader>
          <CardTitle>Location</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Country" required error={errors.country}>
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

      {/* Card 4: Emergency Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Emergency Contact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Emergency Contact Name" error={errors.emergencyContactName}>
              <Input
                placeholder="Enter emergency contact name"
                value={emergencyContactName}
                onChange={e => setEmergencyContactName(e.target.value)}
              />
            </FormField>

            <FormField label="Emergency Contact Phone" error={errors.emergencyContactPhone}>
              <Input
                type="tel"
                placeholder="Enter emergency contact phone"
                value={emergencyContactPhone}
                onChange={e => setEmergencyContactPhone(e.target.value)}
              />
            </FormField>
          </div>
        </CardContent>
      </Card>

      {/* Card 5: Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1">
            <FormField label="Notes" error={errors.notes}>
              <Textarea
                placeholder="Add any additional notes..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={4}
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
          onClick={() => {
            if (mode === 'edit' && initialData?.id) {
              router.push(`/labour/${initialData.id}`);
            } else {
              router.push('/labour');
            }
          }}
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
          {mode === 'create' ? 'Create Labour' : 'Update Labour'}
        </Button>
      </div>

      <ConfirmationDialog
        open={isRemoveDialogOpen}
        onOpenChange={(open) => setIsRemoveDialogOpen(open)}
        onConfirm={handleRemovePhoto}
        title="Remove profile photo?"
        description="Are you sure you want to remove this profile photo?"
        confirmLabel="Remove Photo"
        cancelLabel="Cancel"
        variant="destructive"
      />
    </form>
  );
}
