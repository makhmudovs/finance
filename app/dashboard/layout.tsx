import { cookies, headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/components/sidebar/app-sidebar";

import Header from "../components/sidebar/header";

export default async function Layout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  if (!session) {
    redirect("/login");
  }
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar user={session?.user} />
      <SidebarInset>
        <Header />
        <div className="p-4">
          {children}
          {modal}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
