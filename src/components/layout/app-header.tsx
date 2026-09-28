'use client';

import React, { useState } from 'react';
import { Menu, Search, Bell, ChevronDown } from '@/src/components/ui/icons';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function AppHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();
  
  const pathSegments = pathname?.split('/').filter(Boolean) || [];
  const currentPage = pathSegments.length > 0 
    ? pathSegments[0].charAt(0).toUpperCase() + pathSegments[0].slice(1) 
    : 'Dashboard';

  return (
    <header className="h-16 border-b border-neutral-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-20 px-4 lg:px-8 flex items-center justify-between">
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="mr-4 p-2 -ml-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-md md:hidden focus:outline-none transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:flex items-center text-sm">
          <span className="font-medium text-neutral-900 tracking-tight">{currentPage}</span>
        </div>
      </div>

      <div className="flex items-center space-x-1 sm:space-x-2">
        <div className="relative hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-neutral-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="w-48 lg:w-64 pl-9 pr-4 py-2 bg-neutral-50/50 border border-neutral-200/80 rounded-md text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-neutral-900/5 focus:border-neutral-900/20 transition-all duration-200"
          />
        </div>
        
        <button className="sm:hidden p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors">
          <Search className="w-5 h-5" />
        </button>

        <button className="relative p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full border-2 border-white box-content"></span>
        </button>

        <div className="relative ml-2">
          <button 
            className="flex items-center space-x-2 p-1.5 hover:bg-neutral-100 rounded-md transition-colors focus:outline-none"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <div className="w-8 h-8 bg-neutral-900 text-white flex items-center justify-center rounded-full text-xs font-medium">
              AA
            </div>
            <ChevronDown className="w-4 h-4 text-neutral-500 hidden sm:block" />
          </button>
          
          {isProfileOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setIsProfileOpen(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white border border-neutral-200/80 rounded-md shadow-[0_8px_30px_rgb(0,0,0,0.08)] py-1 z-40">
                <Link href="/settings" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900">Profile</Link>
                <Link href="/settings" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900">Settings</Link>
                <div className="border-t border-neutral-100 my-1"></div>
                <Link href="/login" className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50">Logout</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
