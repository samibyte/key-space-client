import { getUserInfo } from "@/services/auth.service";
import DashboardSidebar from "./_components/DashboardSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userInfo = await getUserInfo();

  if (!userInfo) {
    return null; // A fallback empty state, though middleware guarantees they are authed before hitting this.
  }

  const role = userInfo.role;

  return (
    <SidebarProvider>
      <div className="flex bg-background h-screen w-screen overflow-hidden">
        <DashboardSidebar 
          role={role} 
          userName={userInfo.name} 
          avatar={userInfo.avatar} 
        />
        <SidebarInset className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
