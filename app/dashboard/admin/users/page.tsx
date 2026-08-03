"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardShell from "../../_components/DashboardShell";
import DataTable, { type Column } from "@/components/shared/DataTable";
import StatusBadge from "@/components/shared/StatusBadge";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminUsers, useUpdateUserStatus } from "../_hooks/useAdmin";
import type { User, UserRole, UserStatus } from "@/types/user.type";
import { ShieldBan, ShieldCheck, Search, X } from "lucide-react";
import { toast } from "sonner";


//  Avatar cell helper

function UserAvatar({ user }: { user: User }) {
  const initial = user.name?.charAt(0).toUpperCase() ?? "?";
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-bold overflow-hidden">
        {user.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.avatar} alt={user.name} className="size-full object-cover" />
        ) : (
          initial
        )}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-semibold text-foreground truncate">{user.name}</span>
        <span className="text-xs text-muted-foreground truncate">{user.email}</span>
      </div>
    </div>
  );
}

// 
//  Page
// 
export default function AdminUsersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ── URL-driven filters 
  const page = Number(searchParams.get("page")) || 1;
  const roleParam = (searchParams.get("role") ?? "") as UserRole | "";
  const statusParam = (searchParams.get("status") ?? "") as UserStatus | "";

  // ── Local search input (debounced → URL) 
  const [searchInput, setSearchInput] = useState(searchParams.get("searchTerm") ?? "");

  // Push param helper
  const pushParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      params.delete("page"); // reset to page 1
      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => pushParam("searchTerm", searchInput.trim()), 450);
    return () => clearTimeout(t);
  }, [searchInput, pushParam]);

  // ── Data 
  const { data: res, isLoading } = useAdminUsers({
    searchTerm: searchParams.get("searchTerm") ?? "",
    role: roleParam || undefined,
    status: statusParam || undefined,
    page,
    limit: 10,
  });

  const users: User[] = res?.data ?? [];
  const meta = res?.meta;

  // ── Mutation 
  const statusMutation = useUpdateUserStatus();
  const [confirmTarget, setConfirmTarget] = useState<User | null>(null);

  const handleToggleStatus = (user: User) => setConfirmTarget(user);

  const handleConfirm = () => {
    if (!confirmTarget) return;
    const newStatus: UserStatus = confirmTarget.status === "ACTIVE" ? "BANNED" : "ACTIVE";
    statusMutation.mutate(
      { id: confirmTarget.id, status: newStatus },
      {
        onSuccess: () => {
          toast.success(`User ${newStatus === "BANNED" ? "blocked" : "unblocked"} successfully.`);
          setConfirmTarget(null);
        },
        onError: () => {
          toast.error("Failed to update user status. Please try again.");
          setConfirmTarget(null);
        },
      }
    );
  };

  const clearFilters = () => {
    setSearchInput("");
    router.push("?");
  };

  const hasFilters = searchInput || roleParam || statusParam;

  // ── Table columns 
  const columns: Column<User>[] = [
    {
      key: "name",
      header: "User",
      primary: true,
      render: (u) => <UserAvatar user={u} />,
    },
    {
      key: "role",
      header: "Role",
      desktopOnly: false,
      render: (u) => (
        <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-muted-foreground">
          {u.role === "ADMIN" && <ShieldCheck className="size-3.5 text-primary" />}
          {u.role}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (u) => <StatusBadge status={u.status} />,
    },
    {
      key: "createdAt",
      header: "Joined",
      desktopOnly: true,
      render: (u) => (
        <span className="text-xs text-muted-foreground tabular-nums">
          {new Date(u.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Action",
      render: (u) => {
        const isBanned = u.status === "BANNED";
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleToggleStatus(u)}
            className={
              isBanned
                ? "h-8 rounded-xl gap-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10 border-emerald-500/20 text-xs font-semibold"
                : "h-8 rounded-xl gap-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-500/10 border-rose-500/20 text-xs font-semibold"
            }
          >
            {isBanned ? (
              <>
                <ShieldCheck className="size-3.5" />
                Unblock
              </>
            ) : (
              <>
                <ShieldBan className="size-3.5" />
                Block
              </>
            )}
          </Button>
        );
      },
    },
  ];

  return (
    <DashboardShell
      title="User Management"
      description="Search, filter, and moderate all platform users."
    >
      {/* ── Filters toolbar  */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            id="user-search"
            placeholder="Search by name or email…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9 h-9 rounded-xl bg-muted/40 border-border/50 text-sm"
          />
        </div>

        <Select
          value={roleParam || "ALL"}
          onValueChange={(v) => pushParam("role", !v || v === "ALL" ? "" : v)}
        >
          <SelectTrigger className="w-full sm:w-36 h-9 rounded-xl bg-muted/40 border-border/50 text-sm">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Roles</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="LANDLORD">Landlord</SelectItem>
            <SelectItem value="TENANT">Tenant</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={statusParam || "ALL"}
          onValueChange={(v) => pushParam("status", !v || v === "ALL" ? "" : v)}
        >
          <SelectTrigger className="w-full sm:w-36 h-9 rounded-xl bg-muted/40 border-border/50 text-sm">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="BANNED">Banned</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-9 gap-1.5 rounded-xl text-muted-foreground hover:text-foreground shrink-0"
          >
            <X className="size-3.5" />
            Clear
          </Button>
        )}
      </div>

      {/* ── Table ─────────────────────────────────────────────────────── */}
      <DataTable
        data={users}
        columns={columns}
        meta={meta}
        isLoading={isLoading}
        emptyMessage="No users match the current filters."
      />

      {/* ── Block/Unblock Confirm Dialog ───────────────────────────────── */}
      <ConfirmDialog
        isOpen={!!confirmTarget}
        title={
          confirmTarget?.status === "ACTIVE"
            ? `Block ${confirmTarget?.name}?`
            : `Unblock ${confirmTarget?.name}?`
        }
        description={
          confirmTarget?.status === "ACTIVE"
            ? "This user will be banned and lose access to the platform immediately."
            : "This user will be restored to active status and regain full access."
        }
        confirmText={confirmTarget?.status === "ACTIVE" ? "Block User" : "Unblock User"}
        isDestructive={confirmTarget?.status === "ACTIVE"}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmTarget(null)}
        isLoading={statusMutation.isPending}
      />
    </DashboardShell>
  );
}
