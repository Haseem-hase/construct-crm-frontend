'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import { Select } from '@/src/components/ui/select';
import { FormField } from '@/src/components/ui/form-field';
import { Progress } from '@/src/components/ui/progress';
import { Project, ProjectStatus } from '../types/project.types';
import { mockCustomers } from '@/src/features/customers/data/customers.mock';

interface ProjectFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<Project>;
}

export function ProjectForm({ mode, initialData }: ProjectFormProps) {
  const router = useRouter();
  
  const [name, setName] = useState(initialData?.name || '');
  const [customerId, setCustomerId] = useState(initialData?.customerId || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [status, setStatus] = useState<ProjectStatus>(initialData?.status || 'Planning');
  const [startDate, setStartDate] = useState(initialData?.startDate?.split('T')[0] || '');
  const [plannedEndDate, setPlannedEndDate] = useState(initialData?.plannedEndDate?.split('T')[0] || '');
  const [budget, setBudget] = useState<string>('');
  const [progress, setProgress] = useState<number>(initialData?.progress || 0);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // We add an empty default option for customer so it forces selection
  const customerOptions = [
    { value: '', label: 'Select a customer' },
    ...mockCustomers.map(c => ({
      value: c.id,
      label: c.name
    }))
  ];

  const statusOptions = [
    { value: 'Planning', label: 'Planning' },
    { value: 'Active', label: 'Active' },
    { value: 'Completed', label: 'Completed' },
    { value: 'On Hold', label: 'On Hold' },
  ];

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Project name is required.';
    if (!customerId) newErrors.customerId = 'Customer is required.';
    if (budget && Number(budget) < 0) newErrors.budget = 'Budget cannot be negative.';
    if (progress < 0 || progress > 100) newErrors.progress = 'Progress must be between 0 and 100.';
    
    if (startDate && plannedEndDate) {
      if (new Date(plannedEndDate) < new Date(startDate)) {
        newErrors.plannedEndDate = 'Planned End Date must be greater than or equal to Start Date.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    
    // Mock submission delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    console.log('Submitted Mock Payload:', {
      name,
      customerId,
      description,
      status,
      startDate,
      plannedEndDate,
      budget: budget ? Number(budget) : undefined,
      progress
    });

    if (mode === 'edit' && initialData?.id) {
      router.push(`/projects/${initialData.id}`);
    } else {
      router.push('/projects');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full min-w-0">
      
      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Project Name" required error={errors.name}>
              <Input 
                placeholder="Enter project name" 
                value={name} 
                onChange={e => setName(e.target.value)} 
              />
            </FormField>

            <FormField label="Customer" required error={errors.customerId}>
              <Select 
                options={customerOptions}
                value={customerId}
                onChange={val => setCustomerId(val)}
              />
            </FormField>

            <div className="md:col-span-2">
              <FormField label="Description" error={errors.description}>
                <Textarea 
                  placeholder="Enter project description" 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  rows={4}
                />
              </FormField>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Project Planning</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Status" error={errors.status}>
              <Select 
                options={statusOptions}
                value={status}
                onChange={val => setStatus(val as ProjectStatus)}
              />
            </FormField>
            
            <div className="hidden md:block"></div>

            <FormField label="Start Date" error={errors.startDate}>
              <Input 
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
              />
            </FormField>

            <FormField label="Planned End Date" error={errors.plannedEndDate}>
              <Input 
                type="date"
                value={plannedEndDate}
                onChange={e => setPlannedEndDate(e.target.value)}
              />
            </FormField>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Financial & Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Budget" error={errors.budget}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-neutral-500 sm:text-sm">$</span>
                </div>
                <Input 
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="pl-7"
                  value={budget}
                  onChange={e => setBudget(e.target.value)}
                />
              </div>
            </FormField>

            <FormField label="Progress" error={errors.progress}>
              <div className="flex flex-col gap-3">
                <Input 
                  type="number"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={e => setProgress(Number(e.target.value))}
                />
                <Progress value={progress} />
              </div>
            </FormField>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mb-10">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => router.push('/projects')}
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
          {mode === 'create' ? 'Create Project' : 'Save Changes'}
        </Button>
      </div>

    </form>
  );
}
