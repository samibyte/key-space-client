"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import DashboardShell from "../../_components/DashboardShell";
import DataTable, { type Column } from "@/components/shared/DataTable";
import StatusBadge from "@/components/shared/StatusBadge";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { useAdminProperties, useDeleteAdminProperty } from "../_hooks/useAdmin";
import type { Property } from "@/types/property.type";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";


//  Thumbnail helper

function PropertyCell({ property }: { property: Property }) {
  const thumb = property.images?.[0];
  return (
    <div className="flex items-center gap-3">
      <div className="size-10 shrink-0 rounded-lg overflow-hidden bg-muted/60 border border-border/40">
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt={property.title} className="size-full object-cover" />
        ) : (
          <div className="size-full flex items-center justify-center text-muted-foreground/40 text-lg">🏠</div>
        )}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-semibold text-foreground truncate max-w-40">
          {property.title}
        </span>
        <span className="text-xs text-muted-foreground">{property.city}</span>
      </div>
    </div>
  );
}

export default function AdminPropertiesPage() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const { data: res, isLoading } = useAdminProperties(page, 10);
  const properties: Property[] = res?.data ?? [];
  const meta = res?.meta;

  const deleteMutation = useDeleteAdminProperty();
  const [confirmTarget, setConfirmTarget] = useState<Property | null>(null);

  const handleDelete = () => {
    if (!confirmTarget) return;
    deleteMutation.mutate(confirmTarget.id, {
      onSuccess: () => {
        toast.success("Property deleted and removed from the platform.");
        setConfirmTarget(null);
      },
      onError: () => {
        toast.error("Failed to delete property. Please try again.");
        setConfirmTarget(null);
      },
    });
  };

  const columns: Column<Property>[] = [
    {
      key: "title",
      header: "Property",
      primary: true,
      render: (p) => <PropertyCell property={p} />,
    },
    {
      key: "landlord",
      header: "Landlord",
      render: (p) => (
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-medium text-foreground truncate">{p.landlord?.name ?? "—"}</span>
          <span className="text-xs text-muted-foreground truncate">{p.landlord?.email ?? ""}</span>
        </div>
      ),
    },
    {
      key: "monthlyRent",
      header: "Rent/mo",
      desktopOnly: true,
      render: (p) => (
        <span className="text-sm font-semibold tabular-nums">
          ${p.monthlyRent.toLocaleString("en-US")}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (p) => <StatusBadge status={p.status} />,
    },
    {
      key: "actions",
      header: "Action",
      render: (p) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setConfirmTarget(p)}
          className="h-8 rounded-xl gap-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-500/10 border-rose-500/20 text-xs font-semibold"
        >
          <Trash2 className="size-3.5" />
          Delete
        </Button>
      ),
    },
  ];

  return (
    <DashboardShell
      title="Property Moderation"
      description="Review all platform listings. Permanently delete inappropriate or fraudulent properties."
    >
      <DataTable
        data={properties}
        columns={columns}
        meta={meta}
        isLoading={isLoading}
        emptyMessage="No properties found."
      />

      <ConfirmDialog
        isOpen={!!confirmTarget}
        title={`Delete "${confirmTarget?.title}"?`}
        description="This will permanently remove the property listing along with all associated reviews and payments. This action cannot be undone."
        confirmText="Delete Property"
        isDestructive
        onConfirm={handleDelete}
        onCancel={() => setConfirmTarget(null)}
        isLoading={deleteMutation.isPending}
      />
    </DashboardShell>
  );
}
