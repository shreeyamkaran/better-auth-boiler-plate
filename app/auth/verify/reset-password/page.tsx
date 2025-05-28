import SetNewPasswordForm from '@/components/set-new-password-form';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function SetNewPassword({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>;
}) {
  const { token } = await searchParams;
  if (!token) {
    redirect('/auth/login');
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SetNewPasswordForm token={token} />
      </div>
    </div>
  );
}
