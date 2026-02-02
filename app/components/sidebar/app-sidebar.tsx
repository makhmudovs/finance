"use client";

import * as React from "react";
import {
  SquareTerminal,
  CogIcon,
  ArrowLeftRight,
  HandCoins,
  PiggyBank,
  ReceiptText,
} from "lucide-react";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

// This is sample data.
const links = {
  navMain: [
    {
      title: "Overview",
      url: "/dashboard",
      icon: SquareTerminal,
    },
    {
      title: "Transactions",
      url: "/dashboard/transactions",
      icon: ArrowLeftRight,
    },
    {
      title: "Budgets",
      url: "/dashboard/budgets",
      icon: HandCoins,
    },
    {
      title: "Pots",
      url: "/dashboard/pots",
      icon: PiggyBank,
    },
    {
      title: "Bills",
      url: "/dashboard/bills",
      icon: ReceiptText,
    },
  ],
};

type User = {
  name: string;
  email: string;
};

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: User }) {
  const { state } = useSidebar();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu className={`${state === "collapsed" ? "mt-0" : "mt-2"}`}>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="#">
                <CogIcon className="!size-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={links.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
