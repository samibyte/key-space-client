"use client";

import DashboardShell from "../_components/DashboardShell";
import { useTenantRentals } from "./_hooks/useTenant";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/shared/StatusBadge";
import Link from "next/link";
import {
  Home,
  Clock,
  CreditCard,
  Star,
  ArrowRight,
  MapPin,
  Calendar,
  Building2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useCreatePayment } from "./_hooks/useTenant";
import { toast } from "sonner";

export default function TenantOverviewPage() {
  const { data: rentalsRes, isLoading } = useTenantRentals();
  const createPayment = useCreatePayment();

  const rentals = rentalsRes?.data || [];

  const activeRental = rentals.find((r) => r.status === "ACTIVE");
  const pendingRentals = rentals.filter((r) => r.status === "PENDING");
  const approvedRentals = rentals.filter((r) => r.status === "APPROVED");
  const recentActivity = [...rentals].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5);

  const totalSpent = rentals
    .filter((r) => r.payment?.status === "COMPLETED")
    .reduce((sum, r) => sum + (r.payment?.amount || 0), 0);

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

  return (
    <DashboardShell
      title="My Dashboard"
      description="Your rental journey at a glance."
    >
      {isLoading ? (
        <div className="flex flex-col gap-6">
          <Skeleton className="h-44 rounded-2xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      ) : (
        <div className="flex flex-col gap-6">

          {/* ── Current Home Hero ─────────────────────────────── */}
          {activeRental ? (
            <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-linear-to-br from-primary/10 via-primary/5 to-background p-6">
              <div className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-primary/40 via-primary to-primary/40" />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary border border-primary/20">
                    <Home className="size-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs font-bold uppercase tracking-wider text-primary">Your Current Home</p>
                      <StatusBadge status="ACTIVE" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground leading-tight">
                      {activeRental.property?.title || "Active Rental"}
                    </h2>
                    {activeRental.property?.city && (
                      <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                        <MapPin className="size-3.5" />
                        <span>{activeRental.property.city}</span>
                      </div>
                    )}
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="size-3.5" />
                        Moved in {new Date(activeRental.moveInDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="size-3.5" />
                        {activeRental.durationMonths} month lease
                      </span>
                    </div>
                  </div>
                </div>
                <Link
                  href={`/dashboard/tenant/rentals/${activeRental.id}`}
                  className="shrink-0"
                >
                  <Button variant="outline" size="sm" className="gap-1.5">
                    View Details <ArrowRight className="size-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 py-10 text-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-muted/50 border border-border/40">
                <Building2 className="size-6 text-muted-foreground/50" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground/70">No active rental yet</p>
                <p className="text-xs text-muted-foreground mt-0.5">Browse properties and submit a rental request to get started.</p>
              </div>
              <Link href="/properties">
                <Button size="sm" className="mt-1">Browse Properties</Button>
              </Link>
            </div>
          )}

          {/* ── Action Items ───────────────────────────────────── */}
          {(pendingRentals.length > 0 || approvedRentals.length > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Awaiting Approval */}
              {pendingRentals.length > 0 && (
                <div className="flex items-start gap-4 rounded-2xl border border-amber-500/25 bg-amber-500/8 p-5">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/20">
                    <Clock className="size-5 text-amber-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-foreground">Awaiting Approval</p>
                      <Badge className="bg-amber-500/15 text-amber-600 border-amber-500/30 text-xs font-bold px-2 py-0.5 rounded-full">
                        {pendingRentals.length}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {pendingRentals[0].property?.title || "Property"} {pendingRentals.length > 1 ? `+${pendingRentals.length - 1} more` : ""}
                    </p>
                    <Link href="/dashboard/tenant/rentals?status=PENDING" className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors">
                      View Requests <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Payment Due */}
              {approvedRentals.map((rental) => (
                <div key={rental.id} className="flex items-start gap-4 rounded-2xl border border-blue-500/25 bg-blue-500/8 p-5">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 border border-blue-500/20">
                    <CreditCard className="size-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-foreground">Payment Due</p>
                      <CheckCircle2 className="size-3.5 text-blue-600" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {rental.property?.title || "Approved rental"} — request approved!
                    </p>
                    <Button
                      size="sm"
                      className="mt-2 h-7 px-3 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => handlePayNow(rental.id)}
                      disabled={createPayment.isPending}
                    >
                      {createPayment.isPending ? "Opening…" : "Pay Now"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Recent Activity ────────────────────────────────── */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold tracking-tight text-foreground">Recent Activity</h2>
              <Link
                href="/dashboard/tenant/rentals"
                className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                View All <ArrowRight className="size-3.5" />
              </Link>
            </div>

            {recentActivity.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 rounded-2xl border border-dashed border-border/50 bg-muted/10 text-center gap-2">
                <AlertCircle className="size-5 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">No rental activity yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {recentActivity.map((item) => (
                  <Link
                    key={item.id}
                    href={`/dashboard/tenant/rentals/${item.id}`}
                    className="flex items-center justify-between p-4 rounded-xl border border-border/40 bg-card/60 hover:bg-card hover:border-primary/20 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary border border-primary/15">
                        <Home className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                          {item.property?.title || "Property"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <StatusBadge status={item.status} />
                      <ArrowRight className="size-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* ── Subtle Summary Stats ───────────────────────────── */}
          {rentals.length > 0 && (
            <div className="grid grid-cols-3 divide-x divide-border/40 rounded-2xl border border-border/40 bg-muted/20">
              {[
                { label: "Total Requests", value: rentals.length },
                { label: "Active Rentals", value: rentals.filter((r) => r.status === "ACTIVE").length },
                { label: "Total Paid", value: `$${totalSpent.toLocaleString("en-US")}` },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col items-center justify-center py-4 px-2 text-center">
                  <span className="text-lg font-bold text-foreground">{stat.value}</span>
                  <span className="text-[11px] text-muted-foreground mt-0.5">{stat.label}</span>
                </div>
              ))}
            </div>
          )}

        </div>
      )}
    </DashboardShell>
  );
}
