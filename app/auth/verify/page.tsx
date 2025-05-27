import GenerateNewVerificationLinkForm from '@/components/generate-new-verification-link-form';
import { GalleryVerticalEnd } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function PostEmailVerificationPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const { error } = await searchParams;
  if (!error) {
    notFound();
  }
  let message = 'Something went wrong.';
  switch (error) {
    case 'invalid_token':
      message = 'The link is either invalid or has been expired. Please generate a new one';
      break;
    case 'token_expired':
      message = 'The link is either invalid or has been expired. Please generate a new one';
      break;
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={'flex flex-col gap-6'}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2">
              <Link href="/" className="flex flex-col items-center gap-2 font-medium">
                <div className="flex h-8 w-8 items-center justify-center rounded-md">
                  <GalleryVerticalEnd className="size-6" />
                </div>
                <span className="sr-only">Acme Inc.</span>
              </Link>
              <h1 className="text-xl font-bold">Error</h1>
              <div className="text-center text-sm">{message}</div>
            </div>
            <GenerateNewVerificationLinkForm />
          </div>
        </div>
      </div>
    </div>
  );
}
