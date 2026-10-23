'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AppShell } from '@/src/components/layout/app-shell';
import { useAuth } from '@/src/features/auth/context/use-auth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isSuperAdmin = user?.systemRole === 'SUPER_ADMIN';
  const isSuperAdminRoute = pathname === '/super-admin' || pathname.startsWith('/super-admin/');
  const shouldRedirectSuperAdmin = !isLoading && isAuthenticated && pathname === '/dashboard' && isSuperAdmin;
  const shouldDenySuperAdminRoute = !isLoading && isAuthenticated && isSuperAdminRoute && !isSuperAdmin;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace('/login');
    else if (shouldRedirectSuperAdmin) router.replace('/super-admin/dashboard');
    else if (shouldDenySuperAdminRoute) router.replace('/dashboard');
  }, [isAuthenticated, isLoading, router, shouldDenySuperAdminRoute, shouldRedirectSuperAdmin]);

  if (isLoading || !isAuthenticated || shouldRedirectSuperAdmin || shouldDenySuperAdminRoute) {
    return <div className="min-h-screen bg-neutral-50" aria-busy="true" />;
  }

  return <AppShell>{children}</AppShell>;
}
