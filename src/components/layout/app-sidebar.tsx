'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/src/features/auth/context/use-auth';
import { 
  LayoutDashboard, Users, FolderOpen, Hammer, 
  HardHat, ClipboardList, Shield, Settings, ChevronDown
} from '@/src/components/ui/icons';

type NavItem = {
  name: string;
  href?: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  subItems?: { name: string; href: string }[];
};

const sharedNavigation: NavItem[] = [
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Projects', href: '/projects', icon: FolderOpen },
  { name: 'Contractors', href: '/contractors', icon: Hammer },
  { name: 'Labour', href: '/labour', icon: HardHat },
  { 
    name: 'Assignments', 
    icon: ClipboardList,
    subItems: [
      { name: 'Contractor Assignments', href: '/assignments' },
      { name: 'Labour Assignments', href: '/labour-assignments' }
    ]
  },
];

const otherNavigation: NavItem[] = [
  { name: 'Roles & Permissions', href: '/roles', icon: Shield },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const isSuperAdmin = user?.systemRole === 'SUPER_ADMIN';
  const displayName = user?.fullName?.trim() || user?.email || 'Account';
  const displayRole = isSuperAdmin
    ? 'Super Admin'
    : user?.organizationRole?.role.name || 'Organization user';
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
  const navigation: NavItem[] = [
    {
      name: isSuperAdmin ? 'Platform Dashboard' : 'Dashboard',
      href: isSuperAdmin ? '/super-admin/dashboard' : '/dashboard',
      icon: LayoutDashboard,
    },
    ...(isSuperAdmin
      ? [{ name: 'Organizations', href: '/super-admin/organizations', icon: FolderOpen }]
      : []),
    ...sharedNavigation,
    ...otherNavigation,
  ];
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [lastPathname, setLastPathname] = useState<string | null>(null);

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    const newExpanded = { ...expandedItems };
    let changed = false;
    
    navigation.forEach(item => {
      if (item.subItems) {
        const hasActiveSub = item.subItems.some(sub => pathname?.startsWith(sub.href));
        if (hasActiveSub && !newExpanded[item.name]) {
          newExpanded[item.name] = true;
          changed = true;
        }
      }
    });

    if (changed) {
      setExpandedItems(newExpanded);
    }
  }

  const toggleExpand = (name: string) => {
    setExpandedItems(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const renderNavItems = (items: NavItem[]) => (
    <ul className="space-y-1">
      {items.map((item) => {
        const hasSubItems = !!item.subItems;
        const isParentActive = hasSubItems 
          ? item.subItems!.some(sub => pathname?.startsWith(sub.href)) 
          : (item.href ? pathname?.startsWith(item.href) : false);
        
        const isExpanded = expandedItems[item.name] || false;
        const Icon = item.icon;
        
        return (
          <li key={item.name}>
            {hasSubItems ? (
              <div>
                <button
                  onClick={() => toggleExpand(item.name)}
                  aria-expanded={isExpanded}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-[14px] font-medium transition-colors ${
                    isParentActive 
                      ? 'bg-neutral-100/80 text-neutral-900' 
                      : 'text-neutral-500 hover:bg-neutral-100/50 hover:text-neutral-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-[18px] h-[18px] ${isParentActive ? 'text-neutral-900' : 'text-neutral-400'}`} />
                    <span>{item.name}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
                {isExpanded && (
                  <ul className="mt-1 space-y-1 px-3">
                    {item.subItems!.map((sub) => {
                      const isSubActive = pathname?.startsWith(sub.href) || false;
                      return (
                        <li key={sub.name}>
                          <Link
                            href={sub.href}
                            className={`flex items-center pl-8 py-2 rounded-md text-[13px] font-medium transition-colors ${
                              isSubActive
                                ? 'text-neutral-900 bg-neutral-100/50'
                                : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100/50'
                            }`}
                          >
                            <span>{sub.name}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            ) : (
              <Link
                href={item.href!}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-md text-[14px] font-medium transition-colors ${
                  isParentActive 
                    ? 'bg-neutral-100/80 text-neutral-900' 
                    : 'text-neutral-500 hover:bg-neutral-100/50 hover:text-neutral-900'
                }`}
              >
                <Icon className={`w-[18px] h-[18px] ${isParentActive ? 'text-neutral-900' : 'text-neutral-400'}`} />
                <span>{item.name}</span>
              </Link>
            )}
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
        {renderNavItems(navigation.slice(0, navigation.length - otherNavigation.length))}
        <div className="my-5 border-t border-neutral-100" />
        <div className="px-3 mb-2">
          <h3 className="text-[11px] font-semibold tracking-[0.12em] text-neutral-400 uppercase">
            Other
          </h3>
        </div>
        {renderNavItems(otherNavigation)}
      </div>

      <div className="px-3 py-3 border-t border-neutral-200/60">
        <div className="flex items-center gap-3 rounded-lg border border-neutral-200/70 bg-neutral-50/70 px-3 py-3">
          <div className="w-9 h-9 shrink-0 bg-neutral-900 text-white flex items-center justify-center rounded-full text-xs font-semibold tracking-wide">
            {initials || 'U'}
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-[13px] font-semibold text-neutral-900 leading-tight" title={displayName}>{displayName}</span>
            <span className="truncate mt-1 text-[11px] font-medium text-neutral-500" title={displayRole}>{displayRole}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
