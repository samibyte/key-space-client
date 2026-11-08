"use client";

import { useState, useCallback, useMemo, memo } from "react";
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
import { ShieldBan, ShieldCheck, Search, X, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useRenderCount } from "@/hooks/useRenderCount";
import { generateMockUsers } from "@/lib/fixtures/mockDataGenerator";
import { useDebouncedCallback } from "@/hooks/useDebounce";

// ── Avatar cell helper (memoized)
const UserAvatar = memo(function UserAvatar({ user }: { user: User }) {
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
});

// ── Colocated Search Input to isolate keystroke re-renders from the table
interface SearchInputProps {
  initialValue: string;
  onSearch: (value: string) => void;
}

const UserSearchInput = memo(function UserSearchInput({
  initialValue,
  onSearch,
}: SearchInputProps) {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val);
    onSearch(val);
  };

  return (
    <div className="relative w-full sm:max-w-xs">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
      <Input
        id="user-search"
        placeholder="Search by name or email…"
        value={value}
        onChange={handleChange}
        className="pl-9 h-9 rounded-xl bg-muted/40 border-border/50 text-sm"
      />
    </div>
  );
});

// 
//  Page
// 
export default function AdminUsersPage() {
  useRenderCount("AdminUsersPage");
  const router = useRouter();
  const searchParams = useSearchParams();

  // ── URL-driven filters 
  const page = Number(searchParams.get("page")) || 1;
  const roleParam = (searchParams.get("role") ?? "") as UserRole | "";
  const statusParam = (searchParams.get("status") ?? "") as UserStatus | "";
  const currentSearchTerm = searchParams.get("searchTerm") ?? "";

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

  // Debounced search handler (~300ms)
  const handleDebouncedSearch = useDebouncedCallback((val: string) => {
    pushParam("searchTerm", val.trim());
  }, 300);

  // ── Data 
  const [useBenchmark, setUseBenchmark] = useState(false);
  const mockUsers = useMemo(() => (useBenchmark ? generateMockUsers(1000) : []), [useBenchmark]);

  const { data: res, isLoading } = useAdminUsers({
    searchTerm: currentSearchTerm,
    role: roleParam || undefined,
    status: statusParam || undefined,
    page,
    limit: 10,
  });

  const users: User[] = useBenchmark ? mockUsers : (res?.data ?? []);
  const meta = useBenchmark ? undefined : res?.meta;

  // ── Mutation 
  const statusMutation = useUpdateUserStatus();
  const [confirmTarget, setConfirmTarget] = useState<User | null>(null);

  const handleToggleStatus = useCallback((user: User) => {
    setConfirmTarget(user);
  }, []);

  const handleConfirm = useCallback(() => {
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
  }, [confirmTarget, statusMutation]);

  const clearFilters = useCallback(() => {
    router.push("?");
  }, [router]);

  const hasFilters = Boolean(currentSearchTerm || roleParam || statusParam);

  // ── Table columns (stable reference)
  const columns: Column<User>[] = useMemo(
    () => [
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
    ],
    [handleToggleStatus]
  );

  return (
    <DashboardShell
      title="User Management"
      description="Search, filter, and moderate all platform users."
      headerAction={
        process.env.NODE_ENV !== "production" ? (
          <Button
            variant={useBenchmark ? "default" : "outline"}
            size="sm"
            onClick={() => setUseBenchmark((b) => !b)}
            className="text-xs gap-1.5 rounded-xl h-8"
          >
            <Sparkles className="size-3.5" />
            {useBenchmark ? "1,000 Fixtures Active" : "Load 1,000 Fixtures"}
          </Button>
        ) : undefined
      }
    >
      {/* ── Filters toolbar  */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <UserSearchInput
          key={currentSearchTerm}
          initialValue={currentSearchTerm}
          onSearch={handleDebouncedSearch}
        />

        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap sm:flex-nowrap">
          {/* Role Filter */}
          <Select
            value={roleParam || "ALL"}
            onValueChange={(val) => pushParam("role", !val || val === "ALL" ? "" : val)}
          >
            <SelectTrigger className="h-9 w-36 rounded-xl bg-muted/40 border-border/50 text-xs font-medium">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="ALL">All Roles</SelectItem>
              <SelectItem value="TENANT">Tenant</SelectItem>
              <SelectItem value="LANDLORD">Landlord</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            value={statusParam || "ALL"}
            onValueChange={(val) => pushParam("status", !val || val === "ALL" ? "" : val)}
          >
            <SelectTrigger className="h-9 w-36 rounded-xl bg-muted/40 border-border/50 text-xs font-medium">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="BANNED">Banned</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear Filters */}
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-9 px-2.5 rounded-xl text-xs text-muted-foreground hover:text-foreground gap-1"
            >
              <X className="size-3.5" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* ── Table  */}
      <DataTable
        data={users}
        columns={columns}
        meta={meta}
        isLoading={isLoading}
        emptyMessage="No users found."
        virtualized={useBenchmark}
      />

      {/* ── Confirm Status Dialog  */}
      <ConfirmDialog
        isOpen={!!confirmTarget}
        title={confirmTarget?.status === "ACTIVE" ? "Block User Account?" : "Unblock User Account?"}
        description={
          confirmTarget?.status === "ACTIVE"
            ? `Are you sure you want to block ${confirmTarget?.name}? They will be immediately logged out and unable to access KeySpace.`
            : `Are you sure you want to unblock ${confirmTarget?.name}? Their access to KeySpace will be fully restored.`
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
