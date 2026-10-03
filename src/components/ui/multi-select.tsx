import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { ChevronDown } from './icons';

export interface MultiSelectOption {
  value: string;
  label: string;
}

export interface MultiSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: MultiSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  fullWidth?: boolean;
  className?: string;
  'aria-label'?: string;
}

export function MultiSelect({
  value,
  onChange,
  options,
  placeholder = 'Select options',
  disabled = false,
  error = false,
  fullWidth = true,
  className = '',
  'aria-label': ariaLabel,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  const selectedLabels = value
    .map((val) => options.find((opt) => opt.value === val)?.label)
    .filter(Boolean);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && listboxRef.current) {
      const activeItem = listboxRef.current.children[focusedIndex] as HTMLElement;
      if (activeItem) {
        activeItem.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [focusedIndex, isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) setFocusedIndex(0);
    }
  };

  const handleSelect = (val: string) => {
    const newValue = value.includes(val)
      ? value.filter((v) => v !== val)
      : [...value, val];
    onChange(newValue);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (isOpen) {
          if (focusedIndex >= 0) handleSelect(options[focusedIndex].value);
        } else {
          setIsOpen(true);
          setFocusedIndex(0);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(0);
        } else {
          setFocusedIndex((prev) => (prev < options.length - 1 ? prev + 1 : prev));
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(options.length - 1);
        } else {
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        }
        break;
      case 'Tab':
        if (isOpen) setIsOpen(false);
        break;
    }
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const errorStyles = error
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
    : 'border-neutral-200/80 focus:border-neutral-900/20 focus:ring-neutral-900/5';
  const disabledStyles = disabled ? 'cursor-not-allowed opacity-50 bg-neutral-50' : 'cursor-default bg-neutral-50/50 hover:bg-neutral-50/80';

  return (
    <div 
      className={`relative ${widthClass} ${className}`} 
      ref={containerRef}
      onKeyDown={handleKeyDown}
    >
      <div
        role="combobox"
        aria-controls="multiselect-listbox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        tabIndex={disabled ? -1 : 0}
        onClick={handleToggle}
        className={`flex min-h-[40px] items-center justify-between rounded-md border px-3 py-2 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-4 transition-all duration-200 ${errorStyles} ${disabledStyles}`}
      >
        <span className={`block truncate ${value.length === 0 ? 'text-neutral-400' : ''}`}>
          {value.length > 0 ? selectedLabels.join(', ') : placeholder}
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 ml-2 text-neutral-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-md border border-neutral-200/80 bg-white py-1 shadow-lg">
          <ul
            id="multiselect-listbox"
            role="listbox"
            aria-multiselectable="true"
            ref={listboxRef}
            className="max-h-60 overflow-auto outline-none"
          >
            {options.map((option, index) => {
              const isSelected = value.includes(option.value);
              return (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(option.value);
                  }}
                  onMouseEnter={() => setFocusedIndex(index)}
                  className={`relative cursor-default select-none py-2 pl-3 pr-9 text-sm flex items-center gap-2 ${
                    focusedIndex === index ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-700'
                  } ${isSelected ? 'font-medium' : 'font-normal'}`}
                >
                  <div className={`w-4 h-4 border rounded flex items-center justify-center shrink-0 ${isSelected ? 'bg-neutral-900 border-neutral-900' : 'border-neutral-300'}`}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="block truncate">{option.label}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
