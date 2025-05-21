import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeSwitch } from '@/components/theme-switch';
import HeaderBreadcrumb from '@/components/header-breadcrumb';

export function SiteHeader() {
  return (
    <header className="bg-secondary group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full justify-between items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <div className="flex items-center">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
          <HeaderBreadcrumb />
        </div>
        <ThemeSwitch />
      </div>
    </header>
  );
}
