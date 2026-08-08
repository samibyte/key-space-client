"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/app/auth/_actions/authActions";
import { UserCircle, LogOut } from "lucide-react";

interface NavbarProfileDropdownProps {
  name: string;
  email: string;
  avatar?: string;
}

export default function NavbarProfileDropdown({
  name,
  email,
  avatar,
}: NavbarProfileDropdownProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();
    router.replace("/auth/login");
  };

  const AvatarTrigger = (
    <button
      className="flex items-center justify-center size-9 rounded-full border-2 border-primary/30 bg-primary/10 text-primary font-semibold text-sm hover:border-primary/60 hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 transition-all duration-200 overflow-hidden shrink-0 cursor-pointer"
      aria-label="Open profile menu"
    >
      {avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatar}
          alt={name}
          className="size-full object-cover rounded-full"
        />
      ) : (
        <span className="select-none">{name.charAt(0).toUpperCase()}</span>
      )}
    </button>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={AvatarTrigger} />

      <DropdownMenuContent
        align="end"
        className="w-52 bg-background/95 backdrop-blur-md border border-border/40 p-2 rounded-xl shadow-lg ring-1 ring-foreground/5"
      >
        {/* User info label */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-1.5">
            <p className="text-sm font-semibold text-foreground leading-tight truncate">
              {name}
            </p>
            <p className="text-xs text-muted-foreground truncate">{email}</p>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Profile link */}
        <DropdownMenuItem className="rounded-lg cursor-pointer">
          <Link
            href="/dashboard/profile"
            className="w-full flex items-center gap-2.5 py-1 px-1 text-sm text-foreground hover:text-primary transition-colors"
          >
            <UserCircle className="size-4 text-muted-foreground shrink-0" />
            My Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem
          onClick={handleLogout}
          className="rounded-lg cursor-pointer flex items-center gap-2.5 py-1 px-1 text-sm text-rose-500 hover:text-rose-600 focus:text-rose-500 w-full"
        >
          <LogOut className="size-4 shrink-0" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
