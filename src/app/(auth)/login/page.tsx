'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/src/features/auth/components/login-form';
import { useAuth } from '@/src/features/auth/context/use-auth';

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace('/dashboard');
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || isAuthenticated) {
    return <div className="min-h-screen bg-neutral-50" aria-busy="true" />;
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-full bg-white sm:bg-neutral-50/50">
      <LoginForm />
    </div>
  );
}
