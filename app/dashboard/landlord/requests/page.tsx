"use client";

import DashboardShell from "../../_components/DashboardShell";
import StatusBadge from "@/components/shared/StatusBadge";
import StatusTabFilter from "@/components/shared/StatusTabFilter";
import { Button } from "@/components/ui/button";
import { 
  Check, 
  X, 
  Loader2, 
  Calendar, 
  Clock, 
  Mail, 
  Phone, 
  Building2,
  Sparkles
} from "lucide-react";
import { useState, useRef, useCallback, memo, useMemo } from "react";
import { useLandlordRequests, useUpdateRentalStatus } from "../_hooks/useLandlord";
import { Skeleton } from "@/components/ui/skeleton";
import { useVirtualizer } from "@tanstack/react-virtual";
import { generateMockRentals } from "@/lib/fixtures/mockDataGenerator";
import type { RentalRequest } from "@/types/rental.type";
import { useRenderCount } from "@/hooks/useRenderCount";

// ── Memoized Request Card
interface RequestCardProps {
  item: RentalRequest;
  isMutationPending: boolean;
  targetStatus: "APPROVED" | "REJECTED" | null;
  onUpdateStatus: (id: string, newStatus: "APPROVED" | "REJECTED") => void;
}

const RequestCard = memo(function RequestCard({
  item,
  isMutationPending,
  targetStatus,
  onUpdateStatus,
}: RequestCardProps) {
  const status = targetStatus || item.status || "PENDING";
  const applicantName = item.tenant?.name || "Unknown Tenant";
  const initial = applicantName.charAt(0).toUpperCase();

  return (
    <div className="group relative flex flex-col rounded-2xl border border-border/40 bg-card/60 backdrop-blur-xl transition-all duration-300 hover:shadow-md p-5 gap-4 h-full">
      {/* Header: Property and Status */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <Building2 className="size-4 shrink-0 text-primary" />
          <h3 className="font-bold text-sm text-foreground tracking-tight truncate group-hover:text-primary transition-colors">
            {item.property?.title || "Unknown Property"}
          </h3>
        </div>
        <div className="shrink-0">
          <StatusBadge status={status} />
        </div>
      </div>

      {/* Applicant Profile Section */}
      <div className="flex items-start gap-3.5 p-3 rounded-xl bg-muted/40 border border-border/20">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-bold">
          {initial}
        </div>
        <div className="flex flex-col min-w-0 gap-1">
          <span className="text-sm font-bold text-foreground leading-none">{applicantName}</span>
          {item.tenant?.email && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground leading-none">
              <Mail className="size-3 text-muted-foreground/60" />
              <span className="truncate">{item.tenant.email}</span>
            </span>
          )}
          {item.tenant?.phone && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground leading-none">
              <Phone className="size-3 text-muted-foreground/60" />
              <span>{item.tenant.phone}</span>
            </span>
          )}
        </div>
      </div>

      {/* Lease / Rental terms */}
      <div className="grid grid-cols-2 gap-3 py-3 border-y border-border/30 text-xs font-semibold text-muted-foreground">
        <div className="flex items-center gap-2">
          <Clock className="size-4 text-muted-foreground/80" />
          <div className="flex flex-col leading-tight">
            <span className="text-[10px] text-muted-foreground/60 uppercase">Duration</span>
            <span>{item.durationMonths} Month{item.durationMonths > 1 ? "s" : ""}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="size-4 text-muted-foreground/80" />
          <div className="flex flex-col leading-tight">
            <span className="text-[10px] text-muted-foreground/60 uppercase">Move In</span>
            <span>{new Date(item.moveInDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Status Options / Request Decision footer */}
      {status === "PENDING" && (
        <div className="flex items-center justify-end gap-2.5 mt-auto pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onUpdateStatus(item.id, "REJECTED")}
            disabled={isMutationPending}
            className="rounded-xl h-9 gap-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-500/10 border-rose-500/20"
          >
            {isMutationPending && targetStatus === "REJECTED" ? (
              <Loader2 className="size-4 animate-spin text-rose-600" />
            ) : (
              <X className="size-4" />
            )}
            Reject
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onUpdateStatus(item.id, "APPROVED")}
            disabled={isMutationPending}
            className="rounded-xl h-9 gap-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10 border-emerald-500/20"
          >
            {isMutationPending && targetStatus === "APPROVED" ? (
              <Loader2 className="size-4 animate-spin text-emerald-600" />
            ) : (
              <Check className="size-4" />
            )}
            Approve
          </Button>
        </div>
      )}
    </div>
  );
});

export default function LandlordRequestsPage() {
  useRenderCount("LandlordRequestsPage");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [useBenchmarkData, setUseBenchmarkData] = useState(false);
  const TABS = ["ALL", "PENDING", "APPROVED", "REJECTED", "ACTIVE", "COMPLETED"];

  const { data: requestsRes, isLoading } = useLandlordRequests({
    status: statusFilter === "ALL" ? undefined : statusFilter,
  });
  
  const updateMutation = useUpdateRentalStatus();

  const handleUpdateStatus = useCallback((id: string, newStatus: "APPROVED" | "REJECTED") => {
    updateMutation.mutate({ id, status: newStatus });
  }, [updateMutation]);

  // Dev benchmark mock data generator (1,000 items)
  const mockRentals = useMemo(() => {
    if (!useBenchmarkData) return [];
    return generateMockRentals(1000);
  }, [useBenchmarkData]);

  const rawRequests = useBenchmarkData ? mockRentals : (requestsRes?.data || []);
  const requests = useMemo(() => {
    if (statusFilter === "ALL") return rawRequests;
    return rawRequests.filter((r) => r.status === statusFilter);
  }, [rawRequests, statusFilter]);

  // Virtualizer scroll container reference
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Group into pairs for a responsive 2-column virtual grid
  const rowPairs = useMemo(() => {
    const pairs: RentalRequest[][] = [];
    for (let i = 0; i < requests.length; i += 2) {
      pairs.push(requests.slice(i, i + 2));
    }
    return pairs;
  }, [requests]);

  const virtualizer = useVirtualizer({
    count: rowPairs.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => 280,
    overscan: 5,
  });

  const virtualItems = virtualizer.getVirtualItems();
  const totalVirtualSize = virtualizer.getTotalSize();

  return (
    <DashboardShell 
      title="Rental Requests"
      description="Review and manage applications from prospective tenants."
      headerAction={
        process.env.NODE_ENV !== "production" ? (
          <Button
            variant={useBenchmarkData ? "default" : "outline"}
            size="sm"
            onClick={() => setUseBenchmarkData((prev) => !prev)}
            className="text-xs gap-1.5 rounded-xl h-8"
          >
            <Sparkles className="size-3.5" />
            {useBenchmarkData ? "1,000 Fixtures Active" : "Load 1,000 Fixtures"}
          </Button>
        ) : undefined
      }
    >
      <StatusTabFilter
        tabs={TABS}
        active={statusFilter}
        onChange={setStatusFilter}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-4 rounded-2xl border border-border/40 p-5">
              <Skeleton className="h-6 w-1/3 rounded-md" />
              <div className="flex gap-3">
                <Skeleton className="size-11 rounded-full" />
                <div className="flex flex-col gap-2 grow">
                  <Skeleton className="h-4 w-1/2 rounded-md" />
                  <Skeleton className="h-4 w-3/4 rounded-md" />
                </div>
              </div>
              <Skeleton className="h-10 w-full rounded-xl" />
              <div className="flex gap-2 justify-end mt-2">
                <Skeleton className="h-8 w-20 rounded-md" />
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border/60 rounded-2xl bg-card/10 mt-6">
          <p className="text-muted-foreground text-sm font-medium">
            No {statusFilter !== "ALL" ? statusFilter.toLowerCase() : ""} requests found.
          </p>
        </div>
      ) : (
        <div
          ref={scrollContainerRef}
          className="overflow-auto max-h-[calc(100vh-280px)] min-h-[400px] mt-4 pr-1"
        >
          <div
            style={{
              height: `${totalVirtualSize}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {virtualItems.map((virtualRow) => {
              const pair = rowPairs[virtualRow.index];
              return (
                <div
                  key={virtualRow.key}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    transform: `translateY(${virtualRow.start}px)`,
                    paddingBottom: "1.5rem",
                  }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {pair.map((item) => {
                    const isMutationPending =
                      updateMutation.isPending && updateMutation.variables?.id === item.id;
                    const targetStatus = isMutationPending
                      ? (updateMutation.variables?.status as "APPROVED" | "REJECTED")
                      : null;

                    return (
                      <RequestCard
                        key={item.id}
                        item={item}
                        isMutationPending={isMutationPending}
                        targetStatus={targetStatus}
                        onUpdateStatus={handleUpdateStatus}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
