import { GalleryVerticalEnd } from 'lucide-react';
import Link from 'next/link';

export default async function PostResendEmailVerificationLinkPage() {
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
              <h1 className="text-xl font-bold">Success</h1>
              <div className="text-center text-sm">
                A verification link has been sent to your email again.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
