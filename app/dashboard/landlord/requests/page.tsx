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
  User, 
  Mail, 
  Phone, 
  Building2 
} from "lucide-react";
import { useState } from "react";
import { useLandlordRequests, useUpdateRentalStatus } from "../_hooks/useLandlord";
import { Skeleton } from "@/components/ui/skeleton";

export default function LandlordRequestsPage() {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const TABS = ["ALL", "PENDING", "APPROVED", "REJECTED", "ACTIVE", "COMPLETED"];

  const { data: requestsRes, isLoading } = useLandlordRequests({
    status: statusFilter === "ALL" ? undefined : statusFilter
  });
  
  const updateMutation = useUpdateRentalStatus();

  const handleUpdateStatus = (id: string, newStatus: "APPROVED" | "REJECTED") => {
    updateMutation.mutate({ id, status: newStatus });
  };

  const requests = requestsRes?.data || [];

  return (
    <DashboardShell 
      title="Rental Requests"
      description="Review and manage applications from prospective tenants."
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
            No {statusFilter !== 'ALL' ? statusFilter.toLowerCase() : ''} requests found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {requests.map((item) => {
            const isMutationPending = updateMutation.isPending && updateMutation.variables?.id === item.id;
            const targetStatus = isMutationPending ? updateMutation.variables?.status : null;
            const status = targetStatus || item.status || "PENDING";

            const applicantName = item.tenant?.name || "Unknown Tenant";
            const initial = applicantName.charAt(0).toUpperCase();

            return (
              <div 
                key={item.id} 
                className="group relative flex flex-col rounded-2xl border border-border/40 bg-card/60 backdrop-blur-xl transition-all duration-300 hover:shadow-md p-5 gap-4"
              >
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
                      <span>{item.durationMonths} Month{item.durationMonths > 1 ? 's' : ''}</span>
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
                  <div className="flex items-center justify-end gap-2.5 mt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleUpdateStatus(item.id, "REJECTED")}
                      disabled={isMutationPending}
                      className="rounded-xl h-9 gap-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-500/10 border-rose-500/20"
                    >
                      {isMutationPending && updateMutation.variables?.status === "REJECTED" ? (
                        <Loader2 className="size-4 animate-spin text-rose-600" />
                      ) : (
                        <X className="size-4" />
                      )}
                      Reject
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleUpdateStatus(item.id, "APPROVED")}
                      disabled={isMutationPending}
                      className="rounded-xl h-9 gap-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10 border-emerald-500/20"
                    >
                      {isMutationPending && updateMutation.variables?.status === "APPROVED" ? (
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
          })}
        </div>
      )}
    </DashboardShell>
  );
}
