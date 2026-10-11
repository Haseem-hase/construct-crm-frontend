'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Input } from './input';
import { Textarea } from './textarea';
import { Select } from './select';
import { Button } from './button';

export interface InlineEditProps {
  value: string;
  onSave: (value: string) => boolean | void | Promise<boolean | void>;
  editor?: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'date' | 'number';
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
  const [isLoading, setIsLoading] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditing) {
      const el = containerRef.current?.querySelector('input, textarea, [role="combobox"]');
      if (el) {
        (el as HTMLElement).focus();
      }
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (disabled || isLoading) return;
    try {
      setIsLoading(true);
      setInlineError(null);
      const result = await onSave(editValue);
      if (result === false) {
        return;
      }
      setIsEditing(false);
    } catch (err: any) {
      setInlineError(err?.message || 'Failed to save changes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (isLoading) return;
    setEditValue(value || '');
    setInlineError(null);
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
            onChange={(e) => {
              setEditValue(e.target.value);
              if (inlineError) setInlineError(null);
            }}
            rows={3}
            disabled={disabled || isLoading}
            className="w-full"
          />
        ) : editor === 'select' ? (
          <Select
            value={editValue}
            onChange={(val) => {
              setEditValue(val);
              if (inlineError) setInlineError(null);
            }}
            options={options}
            disabled={disabled || isLoading}
          />
        ) : (
          <Input
            type={editor === 'phone' ? 'tel' : editor}
            value={editValue}
            onChange={(e) => {
              setEditValue(e.target.value);
              if (inlineError) setInlineError(null);
            }}
            disabled={disabled || isLoading}
            className="w-full"
          />
        )}
        {inlineError && (
          <p className="text-xs text-red-600 mt-0.5">{inlineError}</p>
        )}
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={handleCancel} disabled={disabled || isLoading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave} disabled={disabled || isLoading}>
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
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
          if (!disabled && !isLoading) {
            setEditValue(value || '');
            setInlineError(null);
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
