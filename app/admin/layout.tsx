import { AppSidebar } from '@/components/admin/app-sidebar.admin';
import { SiteHeader } from '@/components/admin/site-header.admin';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { auth } from '@/lib/auth';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';
  const _headers = await headers();
  const session = await auth.api.getSession({
    headers: _headers,
  });

  if (!session || session.user.role !== 'ADMIN') {
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
