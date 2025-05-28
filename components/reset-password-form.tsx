'use client';

import { cn } from '@/lib/utils';
import { GalleryVerticalEnd, Loader2 } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { getResetPasswordSchema, TResetPasswordSchema } from '@/lib/reset-password-form-schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';

export default function ResetPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const router = useRouter();
  const schema = getResetPasswordSchema();
  const form = useForm<TResetPasswordSchema>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  });

  const handleSubmit = async (formData: TResetPasswordSchema) => {
    const email = formData.email;
    try {
      await authClient.forgetPassword({
        email,
        redirectTo: '/auth/verify/reset-password',
        fetchOptions: {
          onRequest: () => {},
          onResponse: () => {},
          onError: ctx => {
            toast.error(ctx.error.message);
          },
          onSuccess: () => {
            toast.success('Password link sent');
            router.push('/auth/verify/success');
          },
        },
      });
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message);
      } else {
        toast.error('Something went wrong');
      }
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <a href="#" className="flex flex-col items-center gap-2 font-medium">
            <div className="flex h-8 w-8 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-6" />
            </div>
            <span className="sr-only">Acme Inc.</span>
          </a>
          <h1 className="text-xl font-bold">Reset password</h1>
          <div className="text-center text-sm">
            Remember your password?{' '}
            <Link href="/auth/login" className="underline underline-offset-4">
              Sign in
            </Link>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className="animate-spin" />}
              Send password reset link
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
