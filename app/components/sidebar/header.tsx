"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ModeToggle } from "../mode-toggle";
import { usePathname } from "next/navigation";

export default function Header() {
  const path = usePathname();

  const crumbs = [
    {
      path: "/dashboard",
      desc: "Track you dash",
      name: "Overview",
    },
    {
      path: "/dashboard/transactions",
      desc: "Manage transactions",
      name: "Transactions",
    },
    {
      path: "/dashboard/budgets",
      desc: "Manage budgets",
      name: "Budgets",
    },
    {
      path: "/dashboard/pots",
      desc: "Manage pots",
      name: "Pots",
    },
    {
      path: "/dashboard/bills",
      desc: "Manage bills",
      name: "Bills",
    },
  ];
  return (
    <header className="flex border-b h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center justify-between gap-2 px-4 w-full">
        <div className="flex items-center">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  {crumbs.map((crumb) => {
                    if (crumb.path === path) {
                      return crumb.desc;
                    }
                  })}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {crumbs.map((crumb) => {
                    if (crumb.path === path) {
                      return crumb.name;
                    }
                  })}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <ModeToggle />
      </div>
    </header>
  );
}
