import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import Logo from "@/components/ui/logo";
import { MenuIcon, LayoutDashboard, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";
import NavLink from "@/components/shared/NavLink";
import { getDefaultDashboardRoute } from "@/lib/authUtils";
import { getUserInfo } from "@/services/auth.service";

type NavigationItem = {
  title: string;
  href: string;
};

const navigationItems: NavigationItem[] = [
  { title: "Home", href: "/" },
  { title: "Browse Properties", href: "/properties" },
  { title: "About Us", href: "/about" },
  { title: "Contact Us", href: "/contact" },
];

const Navbar = async () => {
  const userInfo = await getUserInfo();
  const dashboardRoute = userInfo
    ? getDefaultDashboardRoute(userInfo.role)
    : null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/30 bg-background/60 backdrop-blur-md supports-backdrop-filter:bg-background/60 transition-all duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-2 sm:px-6">
        {/* Left/Center Split Nav for Desktop */}
        <div className="text-muted-foreground flex flex-1 items-center gap-8 font-medium md:justify-center lg:gap-12">
          <NavLink href="/" className="max-md:hidden">
            Home
          </NavLink>
          <NavLink href="/properties" className="max-md:hidden">
            Browse Properties
          </NavLink>
          
          <Link href="/" className="flex items-baseline transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]">
            <Logo className="w-12 sm:w-14" />
          </Link>
          
          <NavLink href="/about" className="max-md:hidden">
            About Us
          </NavLink>
          <NavLink href="/contact" className="max-md:hidden">
            Contact Us
          </NavLink>
        </div>

        {/* Right Nav for Desktop */}
        <div className="hidden md:flex items-center gap-3">
          {userInfo ? (
            <Button 
              className="h-10 text-xs font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm shadow-primary/10 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] inline-flex items-center gap-2 px-4"
              render={<Link href={dashboardRoute || "/dashboard"} />}
              nativeButton={false}
            >
              <LayoutDashboard className="size-3.5" />
              <span>Dashboard</span>
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                className="h-10 text-xs font-semibold rounded-xl text-foreground hover:bg-muted/50 transition-all duration-300 px-4"
                render={<Link href="/auth/login" />}
                nativeButton={false}
              >
                Log in
              </Button>
              <Button 
                className="h-10 text-xs font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm shadow-primary/10 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] px-4"
                render={<Link href="/auth/register" />}
                nativeButton={false}
              >
                Sign up
              </Button>
            </>
          )}
        </div>

        {/* Mobile Nav Menu */}
        <div className="md:hidden flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger
              className="md:hidden"
              render={<Button variant="outline" size="icon" className="h-9 w-9 rounded-lg border-border/40 bg-background/50 backdrop-blur-sm" />}
            >
              <MenuIcon className="size-4" />
              <span className="sr-only">Menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-background/95 backdrop-blur-md border border-border/40 p-2 rounded-xl shadow-lg ring-1 ring-foreground/5 animate-in fade-in-50 zoom-in-95" align="end">
              <DropdownMenuGroup className="space-y-1">
                {navigationItems.map((item, index) => (
                  <DropdownMenuItem key={index} className="rounded-lg">
                    <Link href={item.href} className="w-full flex py-1.5 px-2 text-sm text-foreground hover:text-primary transition-colors">
                      {item.title}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              
              <DropdownMenuSeparator className="my-2 bg-border/40" />

              <DropdownMenuGroup className="space-y-1">
                {userInfo ? (
                  <DropdownMenuItem className="rounded-lg">
                    <Link 
                      href={dashboardRoute || "/dashboard"} 
                      className="w-full flex items-center gap-2 py-1.5 px-2 text-sm font-semibold text-primary"
                    >
                      <LayoutDashboard className="size-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                ) : (
                  <>
                    <DropdownMenuItem className="rounded-lg">
                      <Link 
                        href="/auth/login" 
                        className="w-full flex items-center gap-2 py-1.5 px-2 text-sm text-foreground"
                      >
                        <LogIn className="size-4" />
                        <span>Log in</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-lg">
                      <Link 
                        href="/auth/register" 
                        className="w-full flex items-center gap-2 py-1.5 px-2 text-sm font-medium text-primary"
                      >
                        <UserPlus className="size-4" />
                        <span>Sign up</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
