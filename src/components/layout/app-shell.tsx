'use client';

import React, { useState } from 'react';
import { AppSidebar } from './app-sidebar';
import { AppHeader } from './app-header';
import { AppFooter } from './app-footer';
import { MobileSidebar } from './mobile-sidebar';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-neutral-50/50">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 border-r border-neutral-200/60 bg-white fixed inset-y-0 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.01)]">
        <AppSidebar />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)}>
        <AppSidebar />
      </MobileSidebar>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 min-h-screen min-w-0">
        <AppHeader onMenuClick={() => setIsMobileOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
        <AppFooter />
      </div>
    </div>
  );
}
