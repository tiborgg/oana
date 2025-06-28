import { observer } from 'mobx-react-lite';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem, SidebarRail, useSidebar } from '../ui/sidebar';
import { Calendar, ChevronsUpDown, GalleryVerticalEnd, PackageSearch, TableProperties } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Link } from 'react-router-dom';
import { MasterSidebarState } from './masterSidebarState';
import { useEffect, useState } from 'react';

const years = [
  2024,
  2025
]

const months = [
  "Ianuarie",
  "Februarie",
  "Martie",
  "Aprilie",
  "Mai",
  "Iunie",
  "Iulie",
  "August",
  "Septembrie",
  "Octombrie",
  "Noiembrie",
  "Decembrie"
]

export const MasterSidebar = observer(() => {

  const [model] = useState(() => new MasterSidebarState());
  const { isMobile } = useSidebar();

  useEffect(() => {
    model.mounted();
    return () => 
      model.unmounted();
  }, [model]);

  return (
    <Sidebar>
      <SidebarHeader>

        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <GalleryVerticalEnd className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-medium">Grup Agri SRL</span>
                  </div>
                  <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width)"
                align="start">
                <DropdownMenuItem>
                  <span className="font-medium">Grup Agri SRL</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Rapoarte</SidebarGroupLabel>
          <SidebarGroupContent>

            <SidebarMenu>

              <SidebarMenuItem>
                <Collapsible defaultOpen={false} className="group/collapsible">

                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton asChild>
                      <a href="#">
                        <span><TableProperties size={16} /></span>
                        <span>Rapoarte</span>
                      </a>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {years.map((year) => (
                        <SidebarMenuItem key={year}>
                          <Collapsible defaultOpen={false} className="group/collapsible">

                            <CollapsibleTrigger asChild>
                              <SidebarMenuButton asChild>
                                <a href="#">
                                  <span><Calendar size={16} /></span>
                                  <span>{year}</span>
                                </a>
                              </SidebarMenuButton>
                            </CollapsibleTrigger>

                            <CollapsibleContent>
                              <SidebarMenuSub>
                                {months.map((month, i) => (
                                  <SidebarMenuSubItem key={month}>
                                    <SidebarMenuButton asChild>
                                      <Link 
                                        to={`/reports/${year}/${i + 1}`} 
                                        className={model.hasReportFor(year, i) ? '' : 'opacity-50'}>
                                        <span>{month} {year}</span>
                                      </Link>
                                    </SidebarMenuButton>
                                  </SidebarMenuSubItem>
                                ))}
                              </SidebarMenuSub>
                            </CollapsibleContent>

                          </Collapsible>
                        </SidebarMenuItem>
                      ))}

                    </SidebarMenuSub>
                  </CollapsibleContent>

                </Collapsible>
              </SidebarMenuItem>


              <SidebarMenuItem>

                <SidebarMenuButton asChild>
                  <Link to="/products">
                    <span><PackageSearch size={16} /></span>
                    <span>Produse</span>
                  </Link>
                </SidebarMenuButton>

              </SidebarMenuItem>
            </SidebarMenu>

          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>

      <SidebarFooter />

      <SidebarRail />
    </Sidebar>
  );
});