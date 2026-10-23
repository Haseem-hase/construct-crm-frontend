'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/features/auth/context/use-auth';

export function SuperAdminGuard({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const isSuperAdmin = user?.systemRole === 'SUPER_ADMIN';

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) router.replace('/login');
    else if (!isSuperAdmin) router.replace('/dashboard');
  }, [isAuthenticated, isLoading, isSuperAdmin, router]);

  if (isLoading || !isAuthenticated || !isSuperAdmin) {
    return <div className="min-h-[50vh]" aria-busy="true" />;
  }

  return children;
}
