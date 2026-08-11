"use client";

import DashboardShell from "../_components/DashboardShell";
import StatsCard from "@/components/shared/StatsCard";
import { Building2, FileText, DollarSign, LayoutDashboard, ArrowRight } from "lucide-react";
import StatusBadge from "@/components/shared/StatusBadge";
import { useLandlordStats, useLandlordRequests } from "./_hooks/useLandlord";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function LandlordDashboardOverview() {
  const { data: statsRes, isLoading: statsLoading } = useLandlordStats();
  const { data: requestsRes, isLoading: requestsLoading } = useLandlordRequests();

  const stats = statsRes?.data;
  const requests = requestsRes?.data || [];
  const recentRequests = requests.slice(0, 5);

  return (
    <DashboardShell 
      title="Landlord Overview"
      description="Welcome back. Here is what's happening with your properties today."
    >
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[120px] rounded-2xl" />
          ))
        ) : (
          <>
            <StatsCard 
              label="Total Properties" 
              value={stats?.properties?.total || 0} 
              icon={<Building2 className="size-5" />} 
            />
            <StatsCard 
              label="Available Units" 
              value={stats?.properties?.available || 0} 
              icon={<LayoutDashboard className="size-5" />} 
            />
            <StatsCard 
              label="Active Rentals" 
              value={stats?.rentals?.active || 0} 
              icon={<FileText className="size-5" />} 
            />
            <StatsCard 
              label="Mo. Revenue (Estimated)" 
              value={`$${(stats?.revenue?.totalAmount || 0).toLocaleString('en-US')}`} 
              icon={<DollarSign className="size-5" />} 
            />
          </>
        )}
      </div>

      {/* Recent Requests Section */}
      <div className="flex flex-col gap-4 mt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-foreground">Recent Rental Requests</h2>
          <Link
            href="/dashboard/landlord/requests"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            View All <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {requestsLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-2xl" />
            ))
          ) : recentRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-border/60 rounded-2xl bg-card/10">
              <p className="text-muted-foreground text-sm font-medium">No recent rental requests.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {recentRequests.map((item) => {
                const tenantName = item.tenant?.name || "Unknown Tenant";
                const initial = tenantName.charAt(0).toUpperCase();

                return (
                  <div 
                    key={item.id} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4.5 rounded-2xl border border-border/40 bg-card/60 hover:bg-card hover:border-primary/20 transition-all duration-200 gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold">
                        {initial}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-foreground truncate">{tenantName}</span>
                        <span className="text-xs text-muted-foreground truncate">{item.property?.title || "Unknown Property"}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-6">
                      <div className="flex flex-col text-left sm:text-right leading-tight">
                        <span className="text-[10px] text-muted-foreground/60 uppercase font-bold tracking-wider">Move In</span>
                        <span className="text-xs font-semibold text-foreground">{new Date(item.moveInDate).toLocaleDateString()}</span>
                      </div>
                      <div className="shrink-0">
                        <StatusBadge status={item.status} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
