'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Users, FolderOpen, Hammer, 
  HardHat, ClipboardList, Shield, Settings 
} from '@/src/components/ui/icons';

const mainNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Projects', href: '/projects', icon: FolderOpen },
  { name: 'Contractors', href: '/contractors', icon: Hammer },
  { name: 'Labour', href: '/labour', icon: HardHat },
  { name: 'Assignments', href: '/assignments', icon: ClipboardList },
];

const adminNavigation = [
  { name: 'Roles & Permissions', href: '/roles', icon: Shield },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const platformNavigation = [
  { name: 'Platform Dashboard', href: '/super-admin', icon: LayoutDashboard },
  { name: 'Organizations', href: '/super-admin/organizations', icon: FolderOpen },
  { name: 'Users', href: '/super-admin/users', icon: Users },
  { name: 'System Settings', href: '/super-admin/settings', icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  const renderNavItems = (items: { name: string, href: string, icon: React.FC<React.SVGProps<SVGSVGElement>> }[]) => (
    <ul className="space-y-1">
      {items.map((item) => {
        // Simple active check. Can be more sophisticated if needed.
        const isActive = pathname?.startsWith(item.href) || false;
        const Icon = item.icon;
        
        return (
          <li key={item.name}>
            <Link
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-md text-[14px] font-medium transition-colors ${
                isActive 
                  ? 'bg-neutral-100/80 text-neutral-900' 
                  : 'text-neutral-500 hover:bg-neutral-100/50 hover:text-neutral-900'
              }`}
            >
              <Icon className={`w-[18px] h-[18px] ${isActive ? 'text-neutral-900' : 'text-neutral-400'}`} />
              <span>{item.name}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-6 py-5 flex items-center h-16 border-b border-transparent">
        <span className="text-xl font-semibold tracking-tight text-neutral-900">
          ConstructCRM
        </span>
      </div>

      <div className="flex-1 px-3 py-4 overflow-y-auto">
        {renderNavItems(mainNavigation)}
        
        <div className="my-6 border-t border-neutral-100" />
        
        <div className="px-3 mb-3">
          <h3 className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
            Administration
          </h3>
        </div>
        {renderNavItems(adminNavigation)}

        <div className="my-6 border-t border-neutral-100" />

        <div className="px-3 mb-3">
          <h3 className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
            Platform (Super Admin)
          </h3>
        </div>
        {renderNavItems(platformNavigation)}
      </div>

      <div className="p-4 border-t border-neutral-200/60">
        <div className="flex items-center space-x-3 hover:bg-neutral-50 p-2 rounded-md transition-colors cursor-pointer group">
          <div className="w-10 h-10 bg-neutral-900 text-white flex items-center justify-center rounded-full text-sm font-medium">
            AA
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-neutral-900 leading-tight group-hover:text-black transition-colors">Ahmed Ali</span>
            <span className="text-[12px] text-neutral-500">Organization Owner</span>
          </div>
        </div>
      </div>
    </div>
  );
}
