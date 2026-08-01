"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Menu,
  X
} from "lucide-react";
import type { UserRole } from "@/lib/authUtils";
import { useState, useEffect } from "react";


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
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const links = getLinks(role);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const SidebarContent = (
    <>
      {/* Header */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-border/40">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Logo className="w-8 shrink-0" />
          <span className="font-bold tracking-tight text-foreground text-lg hidden sm:block">Rent Nest</span>
        </Link>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 overflow-y-auto px-4 pt-6 pb-4 space-y-1">
        <div className="mb-4 px-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Menu
          </p>
        </div>
        {links.map((link) => {
          const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== `/dashboard/${role.toLowerCase()}`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                  : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <link.icon className={cn("size-4", isActive ? "text-primary-foreground/90" : "text-muted-foreground group-hover:text-foreground")} />
                {link.label}
              </div>
              {isActive && <ChevronRight className="size-3.5 opacity-60" />}
            </Link>
          );
        })}

        <div className="mt-8 mb-4 px-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            System
          </p>
        </div>
        <Link
          href="/settings"
          className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
        >
          <Settings className="size-4 text-muted-foreground group-hover:text-foreground" />
          Settings
        </Link>
        <Link
          href="/api/auth/logout" // Or wherever logout is handled
          className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-rose-500/10 hover:text-rose-500"
        >
          <LogOut className="size-4 text-muted-foreground group-hover:text-rose-500" />
          Log out
        </Link>
      </nav>

      {/* Footer Profile */}
      <div className="shrink-0 border-t border-border/40 p-4">
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
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border/40 bg-background/80 backdrop-blur-md px-4">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="w-7" />
          <span className="font-bold text-foreground">Rent Nest</span>
        </Link>
        <button
          onClick={() => setIsMobileOpen(true)}
          className="flex size-9 items-center justify-center rounded-lg border border-border/60 bg-card text-muted-foreground"
        >
          <Menu className="size-5" />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 left-0 z-40 bg-card/60 backdrop-blur-xl border-r border-border/40">
        {SidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
          <aside className="relative flex w-72 max-w-[80vw] flex-col bg-card h-full shadow-2xl animate-in slide-in-from-left">
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute right-4 top-4 size-8 flex items-center justify-center rounded-lg bg-muted text-foreground"
            >
              <X className="size-4" />
            </button>
            {SidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
