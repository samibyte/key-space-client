"use client";

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
import { RoleBar } from "./_components/RoleBar";

export default function AdminDashboardOverview() {
  const { data: statsRes, isLoading } = useAdminStats();
  const stats = statsRes?.data;
  const totalUsers = stats?.users?.total ?? 0;
  const totalProperties = stats?.properties?.total ?? 0;
  const totalRentals = stats?.rentals?.total ?? 0;
  const totalRevenue = stats?.revenue?.totalAmount ?? 0;

  const landlords = stats?.users?.breakdown?.LANDLORD ?? 0;
  const tenants = stats?.users?.breakdown?.TENANT ?? 0;
  const admins = stats?.users?.breakdown?.ADMIN ?? 0;

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
              value={totalUsers.toLocaleString()}
              icon={<Users className="size-5" />}
            />
            <StatsCard
              label="Total Properties"
              value={totalProperties.toLocaleString()}
              icon={<Building2 className="size-5" />}
            />
            <StatsCard
              label="Total Rentals"
              value={totalRentals.toLocaleString()}
              icon={<FileText className="size-5" />}
            />
            <StatsCard
              label="Platform Revenue"
              value={`$${(totalRevenue / 100).toLocaleString("en-US", { minimumFractionDigits: 0 })}`}
              icon={<DollarSign className="size-5" />}
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
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="size-8 rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-1.5 w-full rounded-full" />
                </div>
              </div>
            ))
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
