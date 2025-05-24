'use client';

import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import React from 'react';

export default function HeaderBreadcrumb() {
  const pathname = usePathname();

  const pathSegments = pathname.split('/').filter(Boolean); // remove empty strings

  const getBreadcrumbName = (segment: string) => {
    const nameMap: Record<string, string> = {
      dashboard: 'Dashboard',
      profile: 'Profile',
      settings: 'Settings',
      // 'userSettings': 'User Settings',
      // add more as needed
    };
    return nameMap[segment] || segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Breadcrumb className="ml-2">
      <BreadcrumbList>
        {pathSegments.map((segment, index) => {
          const href = '/' + pathSegments.slice(0, index + 1).join('/');
          const isLast = index === pathSegments.length - 1;
          return (
            <React.Fragment key={href}>
              <BreadcrumbItem>
                <span>{getBreadcrumbName(segment)}</span>
              </BreadcrumbItem>
              {!isLast && (
                <BreadcrumbSeparator>
                  <ChevronRight />
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
