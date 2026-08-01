"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function NavLink({ href, children, className }: NavLinkProps) {
  const pathname = usePathname();
  const isActive =
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={cn(
        "group relative py-2 text-sm font-medium transition-all duration-300 ease-out hover:text-primary",
        isActive ? "text-primary font-semibold" : "text-muted-foreground hover:translate-y-[-1px]",
        className
      )}
    >
      {children}
      {isActive ? (
        <span className="absolute bottom-0 left-0 h-[2px] w-full bg-primary rounded-full transition-all duration-300" />
      ) : (
        <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary/60 rounded-full transition-all duration-300 group-hover:w-full" />
      )}
    </Link>
  );
}
