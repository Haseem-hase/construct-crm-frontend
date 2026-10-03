import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center py-24 px-4 text-center">
      <h2 className="text-xl font-medium text-neutral-900 mb-2">{title}</h2>
      <p className="text-[15px] text-neutral-500 mb-6 max-w-md">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
