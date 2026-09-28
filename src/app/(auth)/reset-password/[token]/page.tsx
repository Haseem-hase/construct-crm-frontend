import { ResetPasswordForm } from '@/src/features/auth/components/reset-password-form';

type Params = Promise<{ token: string }>;

export default async function ResetPasswordPage({ params }: { params: Params }) {
  const resolvedParams = await params;
  
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-full bg-white sm:bg-neutral-50/50">
      <ResetPasswordForm token={resolvedParams.token} />
    </div>
  );
}
