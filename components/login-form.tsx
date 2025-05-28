'use client';

import { GalleryVerticalEnd, Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getSignInSchema, TSignInSchema } from '@/lib/signin-schema';
import { signinEmailAction } from '@/actions/signin-email.action';
import ContinueWithGithubButton from '@/components/github-button';
import ContinueWithGoogleButton from '@/components/google-button';

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const router = useRouter();
  const signInSchema = getSignInSchema();
  const form = useForm<TSignInSchema>({
    resolver: zodResolver(signInSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const handleSubmit = async (formData: TSignInSchema) => {
    // client-side way of signing in
    /**
    await authClient.signIn.email(
      {
        email: formData.email,
        password: formData.password,
      },
      {
        onRequest: ctx => {
          //show loading
        },
        onSuccess: ctx => {
          //redirect to the dashboard or sign in page
          toast.success('Login successful. Welcome.');
          router.push('/dashboard/profile');
        },
        onError: ctx => {
          // display the error message
          toast.error(ctx.error.message);
        },
      }
    );
    */

    // server-side way of signing in
    const { error } = await signinEmailAction(formData);
    if (error == null) {
      toast.success('Login succesful');
      router.push('/dashboard/profile');
    } else {
      toast.error(error);
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
          <h1 className="text-xl font-bold">Sign in</h1>
          <div className="text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="underline underline-offset-4">
              Sign up
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between">
                    <div>Password</div>
                    <div className="text-muted-foreground">
                      <Link href="/auth/reset-password">Forgot password?</Link>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="******" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className="animate-spin" />}
              Sign in
            </Button>
          </form>
        </Form>
        {/* seperator */}
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">Or</span>
        </div>
        {/* social sign in */}
        <div className="grid gap-4 sm:grid-cols-2">
          <ContinueWithGoogleButton />
          <ContinueWithGithubButton />
        </div>
      </div>
      {/* tnc */}
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary  ">
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and{' '}
        <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
