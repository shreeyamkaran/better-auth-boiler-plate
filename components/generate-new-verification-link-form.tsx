'use client';

import {
  getGenerateNewVerificationLinkSchema,
  TGenerateNewVerificationLinkSchema,
} from '@/lib/verification-link-form-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { Loader2 } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function GenerateNewVerificationLinkForm() {
  const router = useRouter();
  const schema = getGenerateNewVerificationLinkSchema();
  const form = useForm<TGenerateNewVerificationLinkSchema>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  });

  const handleSubmit = async (formData: TGenerateNewVerificationLinkSchema) => {
    const email = formData.email;
    try {
      await authClient.sendVerificationEmail({
        email,
        callbackURL: '/auth/verify',
        fetchOptions: {
          onRequest: () => {},
          onResponse: () => {},
          onError: ctx => {
            toast.error(ctx.error.message);
          },
          onSuccess: () => {
            toast.success('Verification link sent');
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
          Regenerate verification link
        </Button>
      </form>
    </Form>
  );
}
