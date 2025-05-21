import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { cookies, headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { SiteHeader } from '@/components/site-header';
import { redirect } from 'next/navigation';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';
  const _headers = await headers();
  const session = await auth.api.getSession({
    headers: _headers,
  });

  // we can also use useSession() hook to get the session.
  // but that should only be used in a client component.

  if (!session) {
    redirect('/auth/login');
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar session={session} />
      <SidebarInset>
        <SiteHeader />
        <main className="relative w-full min-h-screen p-4 lg:gap-2 lg:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
