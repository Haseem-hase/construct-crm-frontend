'use client';

import React, { useState } from 'react';
import { Labour } from '../types/labour.types';
import { LabourDetailsHeader } from './labour-details-header';
import { LabourPersonalInfo } from './labour-personal-info';
import { LabourContactInfo } from './labour-contact-info';
import { LabourLocation } from './labour-location';
import { LabourAdditionalInfo } from './labour-additional-info';

interface LabourDetailsClientProps {
  initialLabour: Labour;
}

export function LabourDetailsClient({ initialLabour }: LabourDetailsClientProps) {
  const [labour, setLabour] = useState<Labour>(initialLabour);

  const handleUpdate = (updates: Partial<Labour>) => {
    setLabour((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="flex flex-col max-w-6xl mx-auto pb-16 min-w-0">
      <LabourDetailsHeader labour={labour} onUpdate={handleUpdate} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8 min-w-0">
          <LabourPersonalInfo labour={labour} onUpdate={handleUpdate} />
          <LabourContactInfo labour={labour} onUpdate={handleUpdate} />
        </div>
        
        <div className="lg:col-span-1 flex flex-col gap-8 min-w-0">
          <LabourLocation labour={labour} onUpdate={handleUpdate} />
          <LabourAdditionalInfo labour={labour} onUpdate={handleUpdate} />
        </div>
      </div>
    </div>
  );
}
