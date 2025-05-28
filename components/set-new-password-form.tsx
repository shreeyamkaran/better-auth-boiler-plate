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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import { getSetNewPasswordSchema, TSetNewPasswordSchema } from '@/lib/set-new-password-form-schema';

export default function SetNewPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const schema = getSetNewPasswordSchema();
  const form = useForm<TSetNewPasswordSchema>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      password: '',
    },
  });

  const handleSubmit = async (formData: TSetNewPasswordSchema) => {
    const newPassword = formData.password;
    try {
      await authClient.resetPassword({
        newPassword,
        token,
        fetchOptions: {
          onRequest: () => {},
          onResponse: () => {},
          onError: ctx => {
            toast.error(ctx.error.message);
          },
          onSuccess: () => {
            toast.success('Password has been successfully reset');
            router.push('/auth/login');
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <a href="#" className="flex flex-col items-center gap-2 font-medium">
            <div className="flex h-8 w-8 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-6" />
            </div>
            <span className="sr-only">Acme Inc.</span>
          </a>
          <h1 className="text-xl font-bold">Create a new password</h1>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="******" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className="animate-spin" />}
              Set new password
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
