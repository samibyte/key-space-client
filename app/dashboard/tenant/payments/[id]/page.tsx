"use client";

import { use } from "react";
import DashboardShell from "../../../_components/DashboardShell";
import { usePaymentById } from "../../_hooks/useTenant";
import StatusBadge from "@/components/shared/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  CreditCard,
  Calendar,
  Building2,
  ArrowLeft,
  CheckCircle2,
  Hash,
  Clock,
} from "lucide-react";

function ReceiptRow({ label, value, mono = false }: { label: React.ReactNode; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-border/30 last:border-0">
      <span className="text-xs text-muted-foreground shrink-0">{label}</span>
      <span className={`text-sm font-medium text-right ${mono ? "font-mono text-xs break-all" : ""}`}>
        {value}
      </span>
    </div>
  );
}

export default function PaymentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: res, isLoading } = usePaymentById(id);
  const payment = res?.data;
  const rental = payment?.rentalRequest;
  const property = rental?.property;

  return (
    <DashboardShell
      title="Payment Receipt"
      breadcrumbs={[
        { label: "Payments", href: "/dashboard/tenant/payments" },
        { label: "Receipt" },
      ]}
    >
      {isLoading ? (
        <div className="max-w-lg flex flex-col gap-4">
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
        </div>
      ) : !payment ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <p className="text-muted-foreground text-sm">Payment not found.</p>
          <Link href="/dashboard/tenant/payments">
            <Button variant="outline" size="sm" className="gap-1.5">
              <ArrowLeft className="size-3.5" /> Back to Payments
            </Button>
          </Link>
        </div>
      ) : (
        <div className="max-w-lg flex flex-col gap-5">

          {/* Status Banner */}
          <div
            className={`flex items-center gap-3 p-4 rounded-2xl border ${
              payment.status === "COMPLETED"
                ? "bg-emerald-500/8 border-emerald-500/20"
                : payment.status === "FAILED"
                ? "bg-rose-500/8 border-rose-500/20"
                : "bg-amber-500/8 border-amber-500/20"
            }`}
          >
            <div
              className={`flex size-10 shrink-0 items-center justify-center rounded-xl border ${
                payment.status === "COMPLETED"
                  ? "bg-emerald-500/15 border-emerald-500/20 text-emerald-600"
                  : payment.status === "FAILED"
                  ? "bg-rose-500/15 border-rose-500/20 text-rose-500"
                  : "bg-amber-500/15 border-amber-500/20 text-amber-600"
              }`}
            >
              <CreditCard className="size-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">
                {payment.status === "COMPLETED"
                  ? "Payment Successful"
                  : payment.status === "FAILED"
                  ? "Payment Failed"
                  : "Payment Pending"}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(payment.createdAt).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="ml-auto shrink-0">
              <StatusBadge status={payment.status} />
            </div>
          </div>

          {/* Amount */}
          <div className="flex flex-col items-center justify-center py-6 rounded-2xl border border-border/50 bg-card">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Total Paid</p>
            <p className="text-4xl font-bold tracking-tight text-foreground">
              ${payment.amount?.toLocaleString("en-US")}
            </p>
            {payment.status === "COMPLETED" && (
              <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-600 font-medium">
                <CheckCircle2 className="size-3.5" />
                Confirmed
              </div>
            )}
          </div>

          {/* Transaction Details */}
          <div className="rounded-2xl border border-border/50 bg-card p-5">
            <h3 className="text-sm font-bold text-foreground mb-1">Transaction Details</h3>
            <div className="flex flex-col">
              <ReceiptRow
                label={<span className="flex items-center gap-1"><Hash className="size-3" />Transaction ID</span>}
                value={payment.transactionId || "—"}
                mono
              />
              <ReceiptRow
                label={<span className="flex items-center gap-1"><Calendar className="size-3" />Date</span>}
                value={new Date(payment.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              />
              <ReceiptRow
                label={<span className="flex items-center gap-1"><Clock className="size-3" />Updated</span>}
                value={new Date(payment.updatedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              />
            </div>
          </div>

          {/* Linked Rental */}
          {property && (
            <div className="rounded-2xl border border-border/50 bg-card p-5">
              <h3 className="text-sm font-bold text-foreground mb-3">Linked Rental</h3>
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                  <Building2 className="size-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{property.title}</p>
                  <p className="text-xs text-muted-foreground">{property.city}</p>
                </div>
                {rental && (
                  <Link href={`/dashboard/tenant/rentals/${rental.id}`} className="ml-auto shrink-0">
                    <Button variant="outline" size="sm" className="text-xs h-7 px-3">
                      View Rental
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}

        </div>
      )}
    </DashboardShell>
  );
}
