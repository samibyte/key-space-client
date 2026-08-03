"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import DashboardShell from "../../_components/DashboardShell";
import DataTable from "@/components/shared/DataTable";
import StatusBadge from "@/components/shared/StatusBadge";
import StatusTabFilter from "@/components/shared/StatusTabFilter";
import { Button } from "@/components/ui/button";
import { useTenantRentals, useCreatePayment } from "../_hooks/useTenant";
import type { RentalRequest } from "@/types/rental.type";
import { toast } from "sonner";
import Link from "next/link";
import { Eye, CreditCard, Star, Plus } from "lucide-react";

const STATUS_TABS = ["ALL", "PENDING", "APPROVED", "ACTIVE", "COMPLETED", "REJECTED"];

export default function TenantRentalsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const statusParam = searchParams.get("status") || "ALL";

  const [activeTab, setActiveTab] = useState(statusParam);
  const filters = activeTab !== "ALL" ? { status: activeTab } : {};

  const { data: rentalsRes, isLoading } = useTenantRentals(filters);
  const createPayment = useCreatePayment();

  const rentals = rentalsRes?.data || [];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "ALL") {
      params.delete("status");
    } else {
      params.set("status", tab);
    }
    params.delete("page");
    router.push(`?${params.toString()}`);
  };

  const handlePayNow = async (rentalId: string) => {
    try {
      const res = await createPayment.mutateAsync(rentalId);
      if (res?.data?.checkoutUrl) {
        window.open(res.data.checkoutUrl, "_blank");
      }
    } catch {
      toast.error("Failed to initiate payment. Please try again.");
    }
  };

  const columns = [
    {
      key: "property",
      header: "Property",
      primary: true,
      render: (item: RentalRequest) => (
        <div className="flex flex-col">
          <span className="font-semibold text-foreground truncate max-w-48">
            {item.property?.title || "—"}
          </span>
          <span className="text-xs text-muted-foreground">
            {item.property?.city || ""}
          </span>
        </div>
      ),
    },
    {
      key: "moveInDate",
      header: "Move-in",
      render: (item: RentalRequest) => (
        <span className="text-sm">
          {new Date(item.moveInDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "durationMonths",
      header: "Duration",
      desktopOnly: true,
      render: (item: RentalRequest) => (
        <span className="text-sm">{item.durationMonths} mo.</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: RentalRequest) => <StatusBadge status={item.status} />,
    },
    {
      key: "payment",
      header: "Payment",
      render: (item: RentalRequest) =>
        item.payment ? (
          <StatusBadge status={item.payment.status} />
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        ),
    },
    {
      key: "actions",
      header: "",
      render: (item: RentalRequest) => (
        <div className="flex items-center justify-end gap-2">
          {item.status === "APPROVED" && !item.payment && (
            <Button
              size="sm"
              className="h-7 px-3 text-xs gap-1 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => handlePayNow(item.id)}
              disabled={createPayment.isPending}
            >
              <CreditCard className="size-3" />
              Pay Now
            </Button>
          )}
          {(item.status === "ACTIVE" || item.status === "COMPLETED") && (
            <Link href={`/dashboard/tenant/rentals/${item.id}#review`}>
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-3 text-xs gap-1"
              >
                <Star className="size-3" />
                {item.status === "ACTIVE" ? "Leave Review" : "Review"}
              </Button>
            </Link>
          )}
          <Link href={`/dashboard/tenant/rentals/${item.id}`}>
            <Button size="sm" variant="ghost" className="h-7 px-2">
              <Eye className="size-3.5" />
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <DashboardShell
      title="My Rentals"
      description="Track all your rental requests and active leases."
      headerAction={
        <Link href="/properties">
          <Button size="sm" className="gap-1.5">
            <Plus className="size-3.5" />
            New Request
          </Button>
        </Link>
      }
    >
      <div className="flex flex-col gap-4 flex-1 min-h-0">
        <StatusTabFilter
          tabs={STATUS_TABS}
          active={activeTab}
          onChange={handleTabChange}
        />
        <DataTable
          data={rentals}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="No rental requests found"
          className="flex-1"
        />
      </div>
    </DashboardShell>
  );
}
