import { LoginForm } from '@/src/features/auth/components/login-form';

export default function LoginPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-full bg-white sm:bg-neutral-50/50">
      <LoginForm />
    </div>
  );
}