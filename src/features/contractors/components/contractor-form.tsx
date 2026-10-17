'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import { Select } from '@/src/components/ui/select';
import { FormField } from '@/src/components/ui/form-field';
import { SuccessAlert } from '@/src/components/ui/success-alert';
import {
  Contractor,
  ApiContractor,
  ApiContractorStatus,
  CreateContractorRequest,
  UpdateContractorRequest,
} from '../types/contractor.types';
import { SAUDI_CITIES } from '../data/contractor-options';
import {
  createContractor,
  updateContractor,
  selectCreateContractorStatus,
  selectCreateContractorError,
  selectUpdateContractorStatus,
  selectUpdateContractorError,
  resetCreateState,
  resetUpdateState,
} from '../store/contractorsSlice';

interface ContractorFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<Contractor | ApiContractor>;
}

export function ContractorForm({ mode, initialData }: ContractorFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const createStatus = useAppSelector(selectCreateContractorStatus);
  const createError = useAppSelector(selectCreateContractorError);
  const updateStatus = useAppSelector(selectUpdateContractorStatus);
  const updateError = useAppSelector(selectUpdateContractorError);

  const isSubmitting = mode === 'create' ? createStatus === 'loading' : updateStatus === 'loading';

  // Determine initial full name (from ApiContractor.fullName or legacy companyName)
  const initialFullName =
    ('fullName' in (initialData || {}) ? (initialData as ApiContractor).fullName : '') ||
    ('companyName' in (initialData || {}) ? (initialData as Contractor).companyName : '') ||
    '';

  // Contractor Information
  const [fullName, setFullName] = useState(initialFullName);
  const [email, setEmail] = useState(initialData?.email || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [alternativePhone, setAlternativePhone] = useState(initialData?.alternativePhone || '');
  const [status, setStatus] = useState<ApiContractorStatus>(
    (initialData?.status as ApiContractorStatus) || 'PENDING'
  );

  // Location
  const [country, setCountry] = useState(initialData?.country || 'Saudi Arabia');
  const [city, setCity] = useState(initialData?.city || '');
  const [address, setAddress] = useState(initialData?.address || '');

  // Legal & License Information
  const [nationalId, setNationalId] = useState(initialData?.nationalId || '');
  const [licenseNumber, setLicenseNumber] = useState(initialData?.licenseNumber || '');
  const [licenseExpiryDate, setLicenseExpiryDate] = useState(
    initialData?.licenseExpiryDate?.split('T')[0] || ''
  );

  // Additional Information
  const [notes, setNotes] = useState(
    'notes' in (initialData || {}) ? (initialData as ApiContractor).notes || '' : ''
  );

  // Synchronize state when initialData changes (e.g. if switching IDs or initialData arrives)
  useEffect(() => {
    if (initialData) {
      const name =
        ('fullName' in initialData ? (initialData as ApiContractor).fullName : '') ||
        ('companyName' in initialData ? (initialData as Contractor).companyName : '') ||
        '';
      setFullName(name);
      setEmail(initialData.email || '');
      setPhone(initialData.phone || '');
      setAlternativePhone(initialData.alternativePhone || '');
      setStatus((initialData.status as ApiContractorStatus) || 'PENDING');
      setCountry(initialData.country || 'Saudi Arabia');
      setCity(initialData.city || '');
      setAddress(initialData.address || '');
      setNationalId(initialData.nationalId || '');
      setLicenseNumber(initialData.licenseNumber || '');
      setLicenseExpiryDate(initialData.licenseExpiryDate?.split('T')[0] || '');
      setNotes('notes' in initialData ? (initialData as ApiContractor).notes || '' : '');
    }
  }, [initialData]);

  // Feedback State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (mode === 'create') {
      dispatch(resetCreateState());
    } else {
      dispatch(resetUpdateState());
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [mode, dispatch]);

  const cityOptions = [
    { value: '', label: 'Select city' },
    ...SAUDI_CITIES.map((c) => ({ value: c, label: c })),
  ];

  const statusOptions = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'SUSPENDED', label: 'Suspended' },
    { value: 'INACTIVE', label: 'Inactive' },
    { value: 'TERMINATED', label: 'Terminated' },
  ];

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const trimmedName = fullName.trim();
    const trimmedPhone = phone.trim();
    const trimmedCountry = country.trim();
    const trimmedCity = city.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      newErrors.fullName = 'Full name is required.';
    } else if (trimmedName.length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters.';
    } else if (trimmedName.length > 150) {
      newErrors.fullName = 'Full name must not exceed 150 characters.';
    }

    if (!trimmedPhone) {
      newErrors.phone = 'Phone number is required.';
    } else if (trimmedPhone.length < 5) {
      newErrors.phone = 'Phone number is too short.';
    } else if (trimmedPhone.length > 50) {
      newErrors.phone = 'Phone number must not exceed 50 characters.';
    }

    if (!trimmedCountry) {
      newErrors.country = 'Country is required.';
    } else if (trimmedCountry.length < 2) {
      newErrors.country = 'Country must be at least 2 characters.';
    } else if (trimmedCountry.length > 100) {
      newErrors.country = 'Country must not exceed 100 characters.';
    }

    if (!trimmedCity) {
      newErrors.city = 'City is required.';
    } else if (trimmedCity.length > 100) {
      newErrors.city = 'City must not exceed 100 characters.';
    }

    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      newErrors.email = 'Enter a valid email address.';
    }

    if (alternativePhone.trim() && alternativePhone.trim().length > 50) {
      newErrors.alternativePhone = 'Alternative phone must not exceed 50 characters.';
    }

    if (address.trim() && address.trim().length > 255) {
      newErrors.address = 'Address must not exceed 255 characters.';
    }

    if (nationalId.trim() && nationalId.trim().length > 100) {
      newErrors.nationalId = 'National ID must not exceed 100 characters.';
    }

    if (licenseNumber.trim() && licenseNumber.trim().length > 100) {
      newErrors.licenseNumber = 'License number must not exceed 100 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (isSubmitting) return;

      if (mode === 'create') {
        const payload: CreateContractorRequest = {
          fullName: fullName.trim(),
          phone: phone.trim(),
          country: country.trim(),
          city: city.trim(),
          ...(email.trim() ? { email: email.trim() } : {}),
          ...(alternativePhone.trim() ? { alternativePhone: alternativePhone.trim() } : {}),
          ...(address.trim() ? { address: address.trim() } : {}),
          ...(nationalId.trim() ? { nationalId: nationalId.trim() } : {}),
          ...(licenseNumber.trim() ? { licenseNumber: licenseNumber.trim() } : {}),
          ...(licenseExpiryDate ? { licenseExpiryDate: new Date(licenseExpiryDate).toISOString() } : {}),
          ...(status ? { status } : {}),
          ...(notes.trim() ? { notes: notes.trim() } : {}),
        };

        const resultAction = await dispatch(createContractor(payload));

        if (createContractor.fulfilled.match(resultAction)) {
          const createdContractor = resultAction.payload.contractor;
          setSuccessMessage(resultAction.payload.message || 'Contractor created successfully.');
          setShowSuccess(true);

          timeoutRef.current = setTimeout(() => {
            if (createdContractor?.id) {
              router.push(`/contractors/${createdContractor.id}`);
            } else {
              router.push('/contractors');
            }
          }, 1200);
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        if (!initialData?.id) return;

        const payload: UpdateContractorRequest = {
          fullName: fullName.trim(),
          phone: phone.trim(),
          country: country.trim(),
          city: city.trim(),
          email: email.trim(),
          alternativePhone: alternativePhone.trim(),
          address: address.trim(),
          nationalId: nationalId.trim(),
          licenseNumber: licenseNumber.trim(),
          licenseExpiryDate: licenseExpiryDate ? new Date(licenseExpiryDate).toISOString() : undefined,
          status,
          notes: notes.trim(),
        };

        const resultAction = await dispatch(
          updateContractor({ id: initialData.id, payload })
        );

        if (updateContractor.fulfilled.match(resultAction)) {
          const updated = resultAction.payload.contractor;
          setSuccessMessage(resultAction.payload.message || 'Contractor updated successfully.');
          setShowSuccess(true);

          timeoutRef.current = setTimeout(() => {
            if (updated?.id) {
              router.push(`/contractors/${updated.id}`);
            } else {
              router.push(`/contractors/${initialData.id}`);
            }
          }, 1200);
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    };

    return (
      <>
        <SuccessAlert
          show={showSuccess}
          title={mode === 'create' ? 'Contractor Created' : 'Contractor Updated'}
          description={successMessage}
        />

        <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full min-w-0">
          {mode === 'create' && (
            <div className="bg-neutral-50 border border-neutral-200 rounded-md p-3 text-[14px] text-neutral-600">
              <strong>Note:</strong> Contractor code will be generated automatically.
            </div>
          )}

          {mode === 'create' && createStatus === 'failed' && createError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <h3 className="font-medium text-sm">Failed to create contractor</h3>
              <p className="text-sm mt-1">{createError}</p>
            </div>
          )}

          {mode === 'edit' && updateStatus === 'failed' && updateError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <h3 className="font-medium text-sm">Failed to update contractor</h3>
              <p className="text-sm mt-1">{updateError}</p>
            </div>
          )}

        {/* Card 1: Contractor Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contractor Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Full Name" required error={errors.fullName}>
                <Input
                  placeholder="e.g. Ahmed Al-Mansoor"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.fullName) {
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.fullName;
                        return next;
                      });
                    }
                  }}
                  disabled={isSubmitting}
                />
              </FormField>

              <FormField label="Phone" required error={errors.phone}>
                <Input
                  type="tel"
                  placeholder="+966 50 000 0000"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) {
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.phone;
                        return next;
                      });
                    }
                  }}
                  disabled={isSubmitting}
                />
              </FormField>

              <FormField label="Email Address" error={errors.email}>
                <Input
                  type="email"
                  placeholder="contractor@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) {
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.email;
                        return next;
                      });
                    }
                  }}
                  disabled={isSubmitting}
                />
              </FormField>

              <FormField label="Alternative Phone" error={errors.alternativePhone}>
                <Input
                  type="tel"
                  placeholder="Optional secondary phone"
                  value={alternativePhone}
                  onChange={(e) => {
                    setAlternativePhone(e.target.value);
                    if (errors.alternativePhone) {
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.alternativePhone;
                        return next;
                      });
                    }
                  }}
                  disabled={isSubmitting}
                />
              </FormField>

              <FormField label="Status" error={errors.status}>
                <Select
                  options={statusOptions}
                  value={status}
                  onChange={(val) => setStatus(val as ApiContractorStatus)}
                  disabled={isSubmitting}
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
              <FormField label="Country" required error={errors.country}>
                <Input
                  placeholder="Enter country"
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value);
                    if (errors.country) {
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.country;
                        return next;
                      });
                    }
                  }}
                  disabled={isSubmitting}
                />
              </FormField>

              <FormField label="City" required error={errors.city}>
                <Select
                  options={cityOptions}
                  value={city}
                  onChange={(val) => {
                    setCity(val);
                    if (errors.city) {
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.city;
                        return next;
                      });
                    }
                  }}
                  disabled={isSubmitting}
                />
              </FormField>

              <div className="md:col-span-2">
                <FormField label="Address" error={errors.address}>
                  <Textarea
                    placeholder="Enter full address"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (errors.address) {
                        setErrors((prev) => {
                          const next = { ...prev };
                          delete next.address;
                          return next;
                        });
                      }
                    }}
                    rows={3}
                    disabled={isSubmitting}
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
                  onChange={(e) => {
                    setNationalId(e.target.value);
                    if (errors.nationalId) {
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.nationalId;
                        return next;
                      });
                    }
                  }}
                  disabled={isSubmitting}
                />
              </FormField>

              <FormField label="License Number" error={errors.licenseNumber}>
                <Input
                  placeholder="Enter commercial license number"
                  value={licenseNumber}
                  onChange={(e) => {
                    setLicenseNumber(e.target.value);
                    if (errors.licenseNumber) {
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.licenseNumber;
                        return next;
                      });
                    }
                  }}
                  disabled={isSubmitting}
                />
              </FormField>

              <FormField label="License Expiry Date" error={errors.licenseExpiryDate}>
                <Input
                  type="date"
                  value={licenseExpiryDate}
                  onChange={(e) => {
                    setLicenseExpiryDate(e.target.value);
                    if (errors.licenseExpiryDate) {
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.licenseExpiryDate;
                        return next;
                      });
                    }
                  }}
                  disabled={isSubmitting}
                />
              </FormField>

              <div className="md:col-span-2">
                <FormField label="Notes (Optional)" error={errors.notes}>
                  <Textarea
                    placeholder="Enter any additional notes about this contractor..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    disabled={isSubmitting}
                  />
                </FormField>
              </div>
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
                router.push(`/contractors/${initialData.id}`);
              } else {
                router.push('/contractors');
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
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {mode === 'create' ? 'Create Contractor' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </>
  );
}
