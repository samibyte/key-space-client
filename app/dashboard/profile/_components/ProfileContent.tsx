import DashboardShell from "@/app/dashboard/_components/DashboardShell";
import { User } from "@/types/user.type";
import {
  Mail,
  Phone,
  CalendarDays,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react";

function RoleBadge({ role }: { role: string }) {
  const map: Record<string, { label: string; className: string }> = {
    ADMIN: {
      label: "Administrator",
      className:
        "bg-rose-500/10 text-rose-500 border border-rose-500/20",
    },
    LANDLORD: {
      label: "Landlord",
      className:
        "bg-primary/10 text-primary border border-primary/20",
    },
    TENANT: {
      label: "Tenant",
      className:
        "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
    },
  };
  const badge = map[role] ?? {
    label: role,
    className: "bg-muted text-muted-foreground border border-border",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${badge.className}`}
    >
      {role === "ADMIN" && <ShieldCheck className="size-3" />}
      {badge.label}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${
        status === "ACTIVE"
          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
          : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
      }`}
    >
      {status}
    </span>
  );
}

export default function ProfileContent({ user }: { user: User }) {
  const initial = user.name.charAt(0).toUpperCase();
  const joined = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <DashboardShell
      title="My Profile"
      description="Your account information and details."
      breadcrumbs={[{ label: "Dashboard", href: "#" }, { label: "Profile" }]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl">
        {/* Left: Avatar Card */}
        <div className="lg:col-span-1">
          <div className="flex flex-col items-center gap-4 p-7 rounded-2xl border border-border/60 bg-card shadow-xs text-center">
            {/* Avatar */}
            <div className="relative">
              <div className="size-24 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center overflow-hidden shadow-md">
                {user.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="size-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-extrabold text-primary select-none">
                    {initial}
                  </span>
                )}
              </div>
              {/* Online dot */}
              <span className="absolute bottom-1 right-1 size-3.5 rounded-full bg-emerald-500 border-2 border-background" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-lg font-bold text-foreground leading-tight">
                {user.name}
              </h2>
              <p className="text-xs text-muted-foreground">{user.email}</p>
              <div className="flex items-center justify-center gap-2 pt-1">
                <RoleBadge role={user.role} />
                <StatusBadge status={user.status} />
              </div>
            </div>

            <div className="w-full pt-4 border-t border-border/40 text-xs text-muted-foreground">
              <div className="flex items-center justify-center gap-1.5">
                <CalendarDays className="size-3.5 text-primary/60" />
                Member since {joined}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Info Card */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Personal Information */}
          <div className="rounded-2xl border border-border/60 bg-card shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">
                Personal Information
              </h3>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                  <UserIcon className="size-3.5" />
                  Full Name
                </label>
                <p className="text-sm font-medium text-foreground bg-muted/40 rounded-xl px-4 py-2.5 border border-border/40">
                  {user.name}
                </p>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                  <Mail className="size-3.5" />
                  Email Address
                </label>
                <p className="text-sm font-medium text-foreground bg-muted/40 rounded-xl px-4 py-2.5 border border-border/40 truncate">
                  {user.email}
                </p>
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                  <Phone className="size-3.5" />
                  Phone Number
                </label>
                <p className="text-sm font-medium text-foreground bg-muted/40 rounded-xl px-4 py-2.5 border border-border/40">
                  {user.phone ?? (
                    <span className="text-muted-foreground italic">
                      Not provided
                    </span>
                  )}
                </p>
              </div>

              {/* Role */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5" />
                  Account Role
                </label>
                <div className="bg-muted/40 rounded-xl px-4 py-2 border border-border/40 flex items-center">
                  <RoleBadge role={user.role} />
                </div>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="rounded-2xl border border-border/60 bg-card shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">
                Account Details
              </h3>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Account ID */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Account ID
                </label>
                <p className="text-xs font-mono text-muted-foreground bg-muted/40 rounded-xl px-4 py-2.5 border border-border/40 truncate">
                  {user.id}
                </p>
              </div>

              {/* Status */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Account Status
                </label>
                <div className="bg-muted/40 rounded-xl px-4 py-2 border border-border/40 flex items-center">
                  <StatusBadge status={user.status} />
                </div>
              </div>

              {/* Joined */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                  <CalendarDays className="size-3.5" />
                  Joined
                </label>
                <p className="text-sm font-medium text-foreground bg-muted/40 rounded-xl px-4 py-2.5 border border-border/40">
                  {joined}
                </p>
              </div>

              {/* Last updated */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Last Updated
                </label>
                <p className="text-sm font-medium text-foreground bg-muted/40 rounded-xl px-4 py-2.5 border border-border/40">
                  {new Date(user.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
