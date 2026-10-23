'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { FormField } from '@/src/components/ui/form-field';
import { Input } from '@/src/components/ui/input';
import { PageHeader } from '@/src/components/ui/page-header';
import { Textarea } from '@/src/components/ui/textarea';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { organizationsApi } from '../api/organizations.api';
import {
  organizationCreateFailed,
  organizationCreateStarted,
  organizationCreateSucceeded,
  resetOrganizationCreate,
  selectOrganizationCreateStatus,
} from '../store/organizationsSlice';
import type { CreateOrganizationRequest } from '../types/organizations.types';

type OrganizationFormValues = CreateOrganizationRequest;
type OrganizationFormErrors = Partial<Record<keyof OrganizationFormValues, string>>;

const initialValues: OrganizationFormValues = {
  organizationName: '',
  description: '',
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
};

function validate(values: OrganizationFormValues): OrganizationFormErrors {
  const errors: OrganizationFormErrors = {};
  const organizationName = values.organizationName.trim();
  const fullName = values.fullName.trim();
  const email = values.email.trim();
  const phone = values.phone.trim();

  if (organizationName.length < 2) errors.organizationName = 'Organization name must be at least 2 characters.';
  else if (organizationName.length > 150) errors.organizationName = 'Organization name must not exceed 150 characters.';
  if (fullName.length < 3) errors.fullName = 'Full name must be at least 3 characters.';
  else if (fullName.length > 100) errors.fullName = 'Full name must not exceed 100 characters.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email address.';
  if (phone.length < 8) errors.phone = 'Phone number must be at least 8 characters.';
  else if (phone.length > 20) errors.phone = 'Phone number must not exceed 20 characters.';
  if (values.password.length < 8) errors.password = 'Password must be at least 8 characters.';
  if (values.password !== values.confirmPassword) errors.confirmPassword = 'Passwords do not match.';

  return errors;
}

function apiMessage(error: unknown): string {
  const data = (error as { response?: { data?: { message?: string; errors?: Array<{ message?: string }> } } })?.response?.data;
  return data?.message || data?.errors?.find((item) => item.message)?.message || 'Unable to create the organization. Please try again.';
}

function serverFieldError(message: string): keyof OrganizationFormValues | null {
  const normalized = message.toLowerCase();
  if (normalized.includes('organization name')) return 'organizationName';
  if (normalized.includes('full name')) return 'fullName';
  if (normalized.includes('email')) return 'email';
  if (normalized.includes('phone')) return 'phone';
  if (normalized.includes('password')) return normalized.includes('match') ? 'confirmPassword' : 'password';
  return null;
}

export function OrganizationCreateForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const createStatus = useAppSelector(selectOrganizationCreateStatus);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<OrganizationFormErrors>({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(resetOrganizationCreate());
  }, [dispatch]);

  const updateField = (field: keyof OrganizationFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setFormError('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    setFormError('');
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const payload: CreateOrganizationRequest = {
      organizationName: values.organizationName.trim(),
      ...(values.description?.trim() ? { description: values.description.trim() } : {}),
      fullName: values.fullName.trim(),
      email: values.email.trim().toLowerCase(),
      phone: values.phone.trim(),
      password: values.password,
      confirmPassword: values.confirmPassword,
    };

    setIsSubmitting(true);
    dispatch(organizationCreateStarted());
    try {
      const result = await organizationsApi.create(payload);
      dispatch(organizationCreateSucceeded());
      setValues(initialValues);
      router.replace(`/super-admin/organizations?search=${encodeURIComponent(result.organization.name)}&created=1`);
    } catch (error) {
      const message = apiMessage(error);
      const field = serverFieldError(message);
      if (field) setErrors((current) => ({ ...current, [field]: message }));
      else setFormError(message);
      dispatch(organizationCreateFailed(message));
    } finally {
      // Passwords stay in the form only until the submission has completed.
      setValues((current) => ({ ...current, password: '', confirmPassword: '' }));
      setIsSubmitting(false);
    }
  };

  const submitting = isSubmitting || createStatus === 'loading';

  return (
    <div className="mx-auto w-full max-w-4xl pb-12">
      <PageHeader
        title="Create organization"
        description="Set up a new organization and its initial owner account."
        backLink={{ href: '/super-admin/organizations', label: 'Organizations' }}
      />

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {formError && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</div>}

        <Card>
          <CardHeader>
            <CardTitle>Organization</CardTitle>
            <CardDescription>Core details visible to the platform team.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField label="Organization name" htmlFor="organizationName" required error={errors.organizationName}>
              <Input id="organizationName" autoComplete="organization" maxLength={150} value={values.organizationName} onChange={(event) => updateField('organizationName', event.target.value)} error={Boolean(errors.organizationName)} disabled={submitting} />
            </FormField>
            <div className="sm:col-span-2">
              <FormField label="Description" htmlFor="description" helperText="Optional. Add a short note to identify this organization.">
                <Textarea id="description" rows={4} value={values.description} onChange={(event) => updateField('description', event.target.value)} disabled={submitting} />
              </FormField>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Initial owner account</CardTitle>
            <CardDescription>The owner will receive organization-level administration access.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField label="Full name" htmlFor="fullName" required error={errors.fullName}>
              <Input id="fullName" autoComplete="name" maxLength={100} value={values.fullName} onChange={(event) => updateField('fullName', event.target.value)} error={Boolean(errors.fullName)} disabled={submitting} />
            </FormField>
            <FormField label="Email" htmlFor="email" required error={errors.email}>
              <Input id="email" type="email" autoComplete="email" value={values.email} onChange={(event) => updateField('email', event.target.value)} error={Boolean(errors.email)} disabled={submitting} />
            </FormField>
            <FormField label="Phone" htmlFor="phone" required error={errors.phone}>
              <Input id="phone" type="tel" autoComplete="tel" maxLength={20} value={values.phone} onChange={(event) => updateField('phone', event.target.value)} error={Boolean(errors.phone)} disabled={submitting} />
            </FormField>
            <div aria-hidden="true" className="hidden sm:block" />
            <FormField label="Password" htmlFor="password" required error={errors.password} helperText="Use at least 8 characters.">
              <Input id="password" type="password" autoComplete="new-password" value={values.password} onChange={(event) => updateField('password', event.target.value)} error={Boolean(errors.password)} disabled={submitting} />
            </FormField>
            <FormField label="Confirm password" htmlFor="confirmPassword" required error={errors.confirmPassword}>
              <Input id="confirmPassword" type="password" autoComplete="new-password" value={values.confirmPassword} onChange={(event) => updateField('confirmPassword', event.target.value)} error={Boolean(errors.confirmPassword)} disabled={submitting} />
            </FormField>
          </CardContent>
        </Card>

        <div className="flex flex-col-reverse gap-3 border-t border-neutral-200/70 pt-5 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={() => router.push('/super-admin/organizations')} disabled={submitting}>Cancel</Button>
          <Button type="submit" disabled={submitting} isLoading={submitting}>{submitting ? 'Creating organization…' : 'Create organization'}</Button>
        </div>
      </form>
    </div>
  );
}
