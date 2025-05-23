'use client';

import * as React from 'react';
import { GalleryVerticalEnd, Home, UserCog } from 'lucide-react';
import { NavUser } from '@/components/nav-user';
import { NavMain } from '@/components/admin/nav-main.admin';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { auth } from '@/lib/auth';
import { usePathname } from 'next/navigation';

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  session: typeof auth.$Infer.Session | null;
}

const data = {
  navMain: [
    {
      title: 'Home',
      url: '/admin/dashboard/home',
      icon: Home,
    },
    {
      title: 'Manage Users',
      url: '/admin/dashboard/manage-users',
      icon: UserCog,
    },
  ],
};

export function AppSidebar({ session, ...props }: AppSidebarProps) {
  const pathname = usePathname();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Acme Inc."
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <div>
                <GalleryVerticalEnd className="h-5 w-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} pathname={pathname} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: session?.user.name || null,
            email: session?.user.email || null,
            avatar: session?.user.image || null,
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
