"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logoutAction } from "@/app/auth/_actions/authActions";
import { cn } from "@/lib/utils";
import Logo from "@/components/ui/logo";
import { 
  Building2, 
  LayoutDashboard, 
  CreditCard, 
  Settings, 
  Users, 
  Home, 
  FileText, 
  LogOut,
  ShieldCheck,
  ChevronRight,
  Plus
} from "lucide-react";
import type { UserRole } from "@/lib/authUtils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

interface DashboardSidebarProps {
  role: UserRole;
  userName: string;
  avatar?: string;
}

type NavLink = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const LANDLORD_LINKS: NavLink[] = [
  { href: "/dashboard/landlord", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/landlord/properties", label: "My Properties", icon: Building2 },
  { href: "/dashboard/landlord/requests", label: "Rental Requests", icon: FileText },
  { href: "/dashboard/landlord/properties/new", label: "Add Property", icon: Plus }
];

const TENANT_LINKS: NavLink[] = [
  { href: "/dashboard/tenant", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/tenant/rentals", label: "My Rentals", icon: Home },
  { href: "/dashboard/tenant/payments", label: "Payments", icon: CreditCard },
];

const ADMIN_LINKS: NavLink[] = [
  { href: "/dashboard/admin", label: "Analytics", icon: LayoutDashboard },
  { href: "/dashboard/admin/users", label: "Users", icon: Users },
  { href: "/dashboard/admin/properties", label: "Properties", icon: Building2 },
  { href: "/dashboard/admin/rentals", label: "Rentals", icon: FileText },
];

const getLinks = (role: UserRole) => {
  if (role === "LANDLORD") return LANDLORD_LINKS;
  if (role === "TENANT") return TENANT_LINKS;
  return ADMIN_LINKS;
};

export default function DashboardSidebar({ role, userName, avatar }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const links = getLinks(role);

  const handleLogout = async () => {
    await logoutAction();
    router.replace("/auth/login");
  };

  return (
    <Sidebar className="border-r border-border/40 bg-card/60 backdrop-blur-xl">
      {/* Header */}
      <SidebarHeader className="flex h-16 shrink-0 flex-row items-center px-4 border-b border-border/40">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Logo className="w-8 shrink-0" />
          <span className="font-bold tracking-tight text-foreground text-lg">Rent Nest</span>
        </Link>
      </SidebarHeader>

      {/* Nav Menu */}
      <SidebarContent className="px-2 py-4">
        {/* Menu Group */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 mb-2">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {links.map((link) => {
                const isExact = pathname === link.href;
                const hasExactMatchInSidebar = links.some(l => pathname === l.href);
                const isPrefix = pathname.startsWith(link.href) && link.href !== `/dashboard/${role.toLowerCase()}`;
                const isActive = isExact || (isPrefix && !hasExactMatchInSidebar);

                return (
                  <SidebarMenuItem key={link.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      render={<Link href={link.href} />}
                      className={cn(
                        "group flex items-center justify-between rounded-xl px-3 py-2.5 transition-all duration-200 h-10",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary/90 hover:text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <link.icon className={cn("size-4", isActive ? "text-primary-foreground/90" : "text-muted-foreground group-hover:text-foreground")} />
                        <span className="font-medium">{link.label}</span>
                      </div>
                      {isActive && <ChevronRight className="size-3.5 opacity-60" />}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* System Group */}
        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 mb-2">
            System
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href="/settings" />}
                  className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground h-10"
                >
                  <div className="flex items-center gap-3">
                    <Settings className="size-4 text-muted-foreground group-hover:text-foreground" />
                    <span className="font-medium">Settings</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-muted-foreground transition-colors hover:bg-rose-500/10 hover:text-rose-500 h-10 w-full text-left"
                >
                  <div className="flex items-center gap-3">
                    <LogOut className="size-4 text-muted-foreground group-hover:text-rose-500" />
                    <span className="font-medium">Log out</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer Profile */}
      <SidebarFooter className="border-t border-border/40 p-4">
        <div className="flex items-center gap-3 rounded-xl p-2 bg-muted/40 border border-border/30">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt={userName} className="size-full rounded-lg object-cover" />
            ) : (
              <span className="font-semibold">{userName.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="truncate text-sm font-semibold text-foreground">{userName}</span>
            <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-primary">
              {role === "ADMIN" && <ShieldCheck className="size-3" />}
              {role}
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
