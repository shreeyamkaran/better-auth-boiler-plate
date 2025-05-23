import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeSwitch } from '@/components/theme-switch';
import HeaderBreadcrumb from '@/components/header-breadcrumb';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import Link from 'next/link';
import { User } from 'lucide-react';

export async function SiteHeader() {
  const _headers = await headers();
  const session = await auth.api.getSession({
    headers: _headers,
  });

  const isAdmin = session?.user.role === 'ADMIN';

  return (
    <header className="bg-secondary group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full justify-between items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <div className="flex items-center">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
          <HeaderBreadcrumb />
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitch />
          {isAdmin && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="outline" asChild>
                  <Link href="/dashboard/profile">
                    <User />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="center">
                Profile
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </header>
  );
}
