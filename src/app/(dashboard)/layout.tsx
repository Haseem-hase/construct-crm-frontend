'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/src/components/layout/app-shell';
import { useAuth } from '@/src/features/auth/context/use-auth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace('/login');
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return <div className="min-h-screen bg-neutral-50" aria-busy="true" />;
  }

  return <AppShell>{children}</AppShell>;
}
