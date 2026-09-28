import React from 'react';
import { Project } from '../types/project.types';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { InlineEdit } from '@/src/components/ui/inline-edit';

interface ProjectFinancialsProps {
  project: Project;
  onUpdate?: (updates: Partial<Project>) => void;
}

function formatCurrency(amount?: number) {
  if (amount === undefined || amount === null) return null;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

function DetailItem({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[13px] font-medium text-neutral-500 uppercase tracking-wide">{label}</span>
      <div className="text-[15px] text-neutral-900">{children}</div>
    </div>
  );
}

export function ProjectFinancials({ project, onUpdate }: ProjectFinancialsProps) {
  const formattedBudget = formatCurrency(project.budget);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-y-6">
          <DetailItem label="Budget">
            <InlineEdit
              editor="number"
              value={project.budget?.toString() || ''}
              onSave={(val) => {
                const num = parseFloat(val);
                if (isNaN(num) || num < 0) return false;
                if (onUpdate) onUpdate({ budget: num });
              }}
              displayValue={
                formattedBudget ? formattedBudget : <span className="text-neutral-400 italic">Not provided</span>
              }
            />
          </DetailItem>
        </div>
      </CardContent>
    </Card>
  );
}
