import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { ChevronDown } from './icons';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  fullWidth?: boolean;
  className?: string;
  'aria-label'?: string;
}

export function Select({
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  disabled = false,
  error = false,
  fullWidth = true,
  className = '',
  'aria-label': ariaLabel,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

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

  const handleOpen = () => {
    const idx = options.findIndex((opt) => opt.value === value);
    setFocusedIndex(idx >= 0 ? idx : 0);
    setIsOpen(true);
  };

  const handleToggle = () => {
    if (!disabled) {
      if (isOpen) {
        setIsOpen(false);
      } else {
        handleOpen();
      }
    }
  };

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
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
          handleOpen();
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          handleOpen();
        } else {
          setFocusedIndex((prev) => (prev < options.length - 1 ? prev + 1 : prev));
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) {
          handleOpen();
        } else {
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        }
        break;
      case 'Tab':
        if (isOpen) {
          setIsOpen(false);
        }
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
        aria-controls="select-listbox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        tabIndex={disabled ? -1 : 0}
        onClick={handleToggle}
        className={`flex h-10 items-center justify-between rounded-md border px-3 py-2 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-4 transition-all duration-200 ${errorStyles} ${disabledStyles}`}
      >
        <span className={`block truncate ${!selectedOption ? 'text-neutral-400' : ''}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`h-4 w-4 text-neutral-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-md border border-neutral-200/80 bg-white py-1 shadow-lg">
          <ul
            id="select-listbox"
            role="listbox"
            ref={listboxRef}
            className="max-h-60 overflow-auto outline-none"
          >
            {options.map((option, index) => (
              <li
                key={option.value}
                role="option"
                aria-selected={option.value === value}
                onClick={() => handleSelect(option.value)}
                onMouseEnter={() => setFocusedIndex(index)}
                className={`relative cursor-default select-none py-2 pl-3 pr-9 text-sm ${
                  focusedIndex === index ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-700'
                } ${option.value === value ? 'font-medium' : 'font-normal'}`}
              >
                <span className="block truncate">{option.label}</span>
                {option.value === value && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-900">
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
