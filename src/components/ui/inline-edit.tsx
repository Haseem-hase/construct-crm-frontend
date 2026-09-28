'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Input } from './input';
import { Textarea } from './textarea';
import { Select } from './select';
import { Button } from './button';

export interface InlineEditProps {
  value: string;
  onSave: (value: string) => void;
  editor?: 'text' | 'email' | 'phone' | 'textarea' | 'select';
  options?: { value: string; label: string }[];
  displayValue?: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
}

export function InlineEdit({
  value,
  onSave,
  editor = 'text',
  options = [],
  displayValue,
  placeholder = 'Not provided',
  disabled = false,
}: InlineEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || '');
  const containerRef = useRef<HTMLDivElement>(null);



  useEffect(() => {
    if (isEditing) {
      const el = containerRef.current?.querySelector('input, textarea, [role="combobox"]');
      if (el) {
        (el as HTMLElement).focus();
      }
    }
  }, [isEditing]);

  const handleSave = () => {
    if (disabled) return;
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value || '');
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'Enter' && editor !== 'textarea') {
      handleSave();
    }
  };

  if (isEditing) {
    return (
      <div ref={containerRef} className="flex flex-col gap-2 w-full max-w-sm" onKeyDown={handleKeyDown}>
        {editor === 'textarea' ? (
          <Textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            rows={3}
            disabled={disabled}
            className="w-full"
          />
        ) : editor === 'select' ? (
          <Select
            value={editValue}
            onChange={setEditValue}
            options={options}
            disabled={disabled}
          />
        ) : (
          <Input
            type={editor === 'phone' ? 'tel' : editor}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            disabled={disabled}
            className="w-full"
          />
        )}
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={handleCancel}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={handleSave}>Save</Button>
        </div>
      </div>
    );
  }

  const renderedValue = displayValue !== undefined ? displayValue : (value || <span className="text-neutral-400 font-normal">{placeholder}</span>);

  return (
    <div className="group relative inline-flex items-center">
      <button
        type="button"
        className="text-left hover:bg-neutral-50 px-2 -mx-2 py-1 rounded-md border border-transparent hover:border-neutral-200 transition-colors"
        onClick={() => {
          if (!disabled) {
            setEditValue(value || '');
            setIsEditing(true);
          }
        }}
        disabled={disabled}
        aria-label="Edit value"
      >
        <span>{renderedValue}</span>
        {!disabled && (
          <svg className="w-3.5 h-3.5 ml-2 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity inline-block align-middle" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        )}
      </button>
    </div>
  );
}
