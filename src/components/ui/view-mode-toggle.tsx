import React from 'react';
import { Button } from './button';
import { ClipboardList, LayoutDashboard } from './icons';

export type ViewMode = 'list' | 'grid';

export function ViewModeToggle({ value, onChange }: { value: ViewMode; onChange: (mode: ViewMode) => void }) {
  return (
    <div className="ml-auto flex items-center gap-1 rounded-lg border border-neutral-200 bg-neutral-100 p-1" role="group" aria-label="View mode">
      <Button type="button" size="sm" variant={value === 'list' ? 'outline' : 'ghost'} aria-pressed={value === 'list'} onClick={() => onChange('list')} className={value === 'list' ? 'bg-white' : ''}>
        <ClipboardList className="mr-2 h-4 w-4" />List
      </Button>
      <Button type="button" size="sm" variant={value === 'grid' ? 'outline' : 'ghost'} aria-pressed={value === 'grid'} onClick={() => onChange('grid')} className={value === 'grid' ? 'bg-white' : ''}>
        <LayoutDashboard className="mr-2 h-4 w-4" />Grid
      </Button>
    </div>
  );
}
