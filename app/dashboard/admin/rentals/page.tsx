"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import DashboardShell from "../../_components/DashboardShell";
import DataTable, { type Column } from "@/components/shared/DataTable";
import StatusBadge from "@/components/shared/StatusBadge";
import StatusTabFilter from "@/components/shared/StatusTabFilter";
import { useAdminRentals } from "../_hooks/useAdmin";
import type { RentalRequest } from "@/types/rental.type";

const TABS = ["ALL", "PENDING", "APPROVED", "REJECTED", "ACTIVE", "COMPLETED", "CANCELLED"];

export default function AdminRentalsPage() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const [statusFilter, setStatusFilter] = useState("ALL");

  const { data: res, isLoading } = useAdminRentals(
    statusFilter === "ALL" ? undefined : statusFilter,
    page,
    10
  );
  const rentals: RentalRequest[] = res?.data ?? [];
  const meta = res?.meta;

  const columns: Column<RentalRequest>[] = [
    {
      key: "property",
      header: "Property",
      primary: true,
      render: (r) => (
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold text-foreground truncate max-w-40">
            {r.property?.title ?? "—"}
          </span>
          <span className="text-xs text-muted-foreground truncate">
            {r.property?.city ?? ""}
          </span>
        </div>
      ),
    },
    {
      key: "tenant",
      header: "Tenant",
      render: (r) => (
        <div className="flex flex-col min-w-0">
          <span className="text-sm text-foreground font-medium truncate">
            {r.tenant?.name ?? "—"}
          </span>
          <span className="text-xs text-muted-foreground truncate">
            {r.tenant?.email ?? ""}
          </span>
        </div>
      ),
    },
    {
      key: "landlord",
      header: "Landlord",
      desktopOnly: true,
      render: (r) => (
        <span className="text-sm text-foreground font-medium">
          {r.property?.landlord?.name ?? "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Rental Status",
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: "payment",
      header: "Payment",
      desktopOnly: true,
      render: (r) =>
        r.payment ? (
          <StatusBadge status={r.payment.status} />
        ) : (
          <span className="text-xs text-muted-foreground/60">—</span>
        ),
    },
    {
      key: "createdAt",
      header: "Submitted",
      desktopOnly: true,
      render: (r) => (
        <span className="text-xs text-muted-foreground tabular-nums">
          {new Date(r.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      ),
    },
  ];

  return (
    <DashboardShell
      title="Rental Overview"
      description="Read-only view of all rental requests across the platform."
    >
      <StatusTabFilter tabs={TABS} active={statusFilter} onChange={setStatusFilter} />

      <DataTable
        data={rentals}
        columns={columns}
        meta={meta}
        isLoading={isLoading}
        emptyMessage="No rentals match the current filter."
      />
    </DashboardShell>
  );
}
