import React from 'react';

export function AppFooter() {
  return (
    <footer className="mt-auto border-t border-neutral-200/60 bg-white/50 px-6 py-4">
      <div className="flex flex-col sm:flex-row justify-between items-center text-[13px] text-neutral-500">
        <p>&copy; 2026 ConstructCRM</p>
        <p className="mt-1 sm:mt-0">All rights reserved.</p>
      </div>
    </footer>
  );
}
