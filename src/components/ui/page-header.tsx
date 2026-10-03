import React from 'react';
import Link from 'next/link';

interface PageHeaderProps {
  title: string;
  description?: string;
  subtitle?: React.ReactNode;
  badges?: React.ReactNode;
  avatar?: React.ReactNode;
  action?: React.ReactNode;
  backLink?: {
    href: string;
    label: string;
  };
}

export function PageHeader({ title, description, subtitle, badges, avatar, action, backLink }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
      <div className="min-w-0 flex flex-col gap-4">
        {backLink && (
          <Link href={backLink.href} className="inline-flex items-center text-[13px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors w-fit">
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            {backLink.label}
          </Link>
        )}
        <div className="flex items-start sm:items-center gap-4">
          {avatar && (
            <div className="shrink-0">
              {avatar}
            </div>
          )}
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 truncate">
                {title}
              </h1>
              {subtitle && (
                <span className="text-sm font-mono text-neutral-500 mt-1">{subtitle}</span>
              )}
              {badges && (
                <div className="mt-1 flex items-center gap-2">
                  {badges}
                </div>
              )}
            </div>
            {description && (
              <p className="text-[15px] text-neutral-500 truncate">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
      {action && (
        <div className="shrink-0 sm:mt-10 flex items-center">
          {action}
        </div>
      )}
    </div>
  );
}
