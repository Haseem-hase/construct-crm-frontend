'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/features/auth/context/use-auth';

export default function HomePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    router.replace(user?.systemRole === 'SUPER_ADMIN' ? '/super-admin/dashboard' : '/dashboard');
  }, [isAuthenticated, isLoading, router, user?.systemRole]);

  return <div className="min-h-screen bg-neutral-50" aria-busy="true" />;
}
