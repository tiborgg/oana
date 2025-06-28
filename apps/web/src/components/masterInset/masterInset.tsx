import { ReactNode } from 'react';
import { observer } from 'mobx-react-lite';
import { Outlet, useMatches } from 'react-router-dom';
import { Separator } from '../ui/separator';
import { SidebarInset, SidebarTrigger } from '../ui/sidebar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../ui/breadcrumb';

export const MasterInset = observer(() => {

  const matches = useMatches();

  const breadcrumb = (matches[matches.length - 1]?.data as any)?.breadcrumb ?? [];

  const breadcrumbElements = breadcrumb
    .reduce((acc: any, item: any, index: number) => {

      if (index >= breadcrumb.length - 1) {
        acc.push(
          <BreadcrumbItem key={item} className="hidden md:block">
            <BreadcrumbPage>{item}</BreadcrumbPage>
          </BreadcrumbItem>
        );
      } else {

        acc.push(
          <BreadcrumbItem key={item} className="hidden md:block">
            <BreadcrumbLink href="#">{item}</BreadcrumbLink>
          </BreadcrumbItem>
        );

        acc.push(
          <BreadcrumbSeparator key={`separator-${index}`} className="hidden md:block" />
        );
      }

      return acc;
    }, [] as ReactNode);

  return (
    <SidebarInset>
      <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbElements}
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <Outlet />

    </SidebarInset>
  );
});