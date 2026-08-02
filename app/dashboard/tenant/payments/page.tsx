"use client";

import { useSearchParams } from "next/navigation";
import DashboardShell from "../../_components/DashboardShell";
import DataTable from "@/components/shared/DataTable";
import StatusBadge from "@/components/shared/StatusBadge";
import { useMyPayments } from "../_hooks/useTenant";
import type { Payment } from "@/types/rental.type";
import type { PaginationMeta } from "@/types/api.type";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Eye } from "lucide-react";

export default function TenantPaymentsPage() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") || "1");

  const { data: paymentsRes, isLoading } = useMyPayments(page);
  const payments = paymentsRes?.data || [];
  const meta: PaginationMeta | undefined = paymentsRes?.meta;

  const columns = [
    {
      key: "createdAt",
      header: "Date",
      desktopOnly: false,
      render: (item: Payment) => (
        <span className="text-sm">
          {new Date(item.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "property",
      header: "Property",
      primary: true,
      render: (item: Payment) => (
        <span className="text-sm font-medium truncate max-w-40 block">
          {item.rentalRequest?.property?.title || "—"}
        </span>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      render: (item: Payment) => (
        <span className="text-sm font-bold">${item.amount?.toLocaleString("en-US")}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: Payment) => <StatusBadge status={item.status} />,
    },
    {
      key: "transactionId",
      header: "Transaction ID",
      desktopOnly: true,
      render: (item: Payment) => (
        <span className="text-xs font-mono text-muted-foreground truncate max-w-36 block">
          {item.transactionId || "—"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (item: Payment) => (
        <Link href={`/dashboard/tenant/payments/${item.id}`}>
          <Button size="sm" variant="ghost" className="h-7 px-2">
            <Eye className="size-3.5" />
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <DashboardShell
      title="Payment History"
      description="All your rental payments in one place."
    >
      <div className="flex flex-col flex-1 min-h-0">
        <DataTable
          data={payments}
          columns={columns}
          meta={meta}
          isLoading={isLoading}
          emptyMessage="No payments found"
          className="flex-1"
        />
      </div>
    </DashboardShell>
  );
}
