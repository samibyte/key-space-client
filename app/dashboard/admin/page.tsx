"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import DashboardShell from "../_components/DashboardShell";
import StatsCard from "@/components/shared/StatsCard";
import { useAdminStats } from "./_hooks/useAdmin";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Building2,
  FileText,
  DollarSign,
} from "lucide-react";
import { useRenderCount } from "@/hooks/useRenderCount";

// Stable icon elements to prevent StatsCard prop identity changes
const ICONS = {
  users: <Users className="size-5" />,
  building: <Building2 className="size-5" />,
  file: <FileText className="size-5" />,
  dollar: <DollarSign className="size-5" />,
};

// Precise Skeleton for RoleBar matching the exact 176px (h-44) chart + legend height to eliminate CLS
function RoleBarSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-44 w-full flex flex-col justify-around py-3">
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-full rounded-full" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-3/4 rounded-full" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-3 w-1/4 rounded-full" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 border-t border-border/40 pt-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="size-8 rounded-lg" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-4 w-12" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Lazy-loaded RoleBar with recharts (364 KB parsed) deferred outside the initial critical path
const RoleBar = dynamic(
  () => import("./_components/RoleBar").then((mod) => mod.RoleBar),
  {
    ssr: false,
    loading: () => <RoleBarSkeleton />,
  }
);

export default function AdminDashboardOverview() {
  useRenderCount("AdminDashboardOverview");
  const { data: statsRes, isLoading } = useAdminStats();
  const stats = statsRes?.data;
  const totalUsers = stats?.users?.total ?? 0;
  const totalProperties = stats?.properties?.total ?? 0;
  const totalRentals = stats?.rentals?.total ?? 0;
  const totalRevenue = stats?.revenue?.totalAmount ?? 0;

  const landlords = stats?.users?.breakdown?.LANDLORD ?? 0;
  const tenants = stats?.users?.breakdown?.TENANT ?? 0;
  const admins = stats?.users?.breakdown?.ADMIN ?? 0;

  const formattedValues = useMemo(
    () => ({
      users: totalUsers.toLocaleString(),
      properties: totalProperties.toLocaleString(),
      rentals: totalRentals.toLocaleString(),
      revenue: `$${(totalRevenue / 100).toLocaleString("en-US", { minimumFractionDigits: 0 })}`,
    }),
    [totalUsers, totalProperties, totalRentals, totalRevenue]
  );

  return (
    <DashboardShell
      title="Admin Overview"
      description="Platform-wide analytics and a real-time health check of KeySpace."
    >
      {/* ── KPI Grid  */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-30 rounded-2xl" />
          ))
        ) : (
          <>
            <StatsCard
              label="Total Users"
              value={formattedValues.users}
              icon={ICONS.users}
            />
            <StatsCard
              label="Total Properties"
              value={formattedValues.properties}
              icon={ICONS.building}
            />
            <StatsCard
              label="Total Rentals"
              value={formattedValues.rentals}
              icon={ICONS.file}
            />
            <StatsCard
              label="Platform Revenue"
              value={formattedValues.revenue}
              icon={ICONS.dollar}
            />
          </>
        )}
      </div>

      {/* ── User Role Breakdown*/}
      <Card className="rounded-2xl border border-border/50 shadow-sm">
        <CardHeader className="pb-4 pt-5">
          <CardTitle className="text-base font-bold tracking-tight flex items-center gap-2">
            <Users className="size-4 text-primary" />
            User Role Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5 pb-6">
          {isLoading ? (
            <RoleBarSkeleton />
          ) : (
            <RoleBar
              landlords={landlords}
              tenants={tenants}
              admins={admins}
              totalUsers={totalUsers}
            />
          )}
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
