import { ForgotPasswordForm } from '@/src/features/auth/components/forgot-password-form';

export default function ForgotPasswordPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-full bg-white sm:bg-neutral-50/50">
      <ForgotPasswordForm />
    </div>
  );
}