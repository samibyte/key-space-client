"use client";

import { Home, ShieldCheck, UserCheck } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface RoleBarProps {
  landlords: number;
  tenants: number;
  admins: number;
  totalUsers: number;
}

export function RoleBar({
  landlords,
  tenants,
  admins,
  totalUsers,
}: RoleBarProps) {
  const landlordPct =
    totalUsers > 0 ? Math.round((landlords / totalUsers) * 100) : 0;
  const tenantPct =
    totalUsers > 0 ? Math.round((tenants / totalUsers) * 100) : 0;
  const adminPct = totalUsers > 0 ? Math.round((admins / totalUsers) * 100) : 0;

  const data = [
    {
      role: "Landlords",
      count: landlords,
      percentage: landlordPct,
      color: "#0ea5e9", // bg-sky-500
      iconColor: "text-sky-600 bg-sky-500/10",
      icon: Home,
    },
    {
      role: "Tenants",
      count: tenants,
      percentage: tenantPct,
      color: "#8b5cf6", // bg-violet-500
      iconColor: "text-violet-600 bg-violet-500/10",
      icon: UserCheck,
    },
    {
      role: "Admins",
      count: admins,
      percentage: adminPct,
      color: "#005040", // primary theme color
      iconColor: "text-primary bg-primary/10",
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Recharts Bar Chart */}
      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 10, left: -20, bottom: 0 }}
          >
            <XAxis type="number" hide />
            <YAxis
              dataKey="role"
              type="category"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "var(--color-muted-foreground)",
                fontSize: 13,
                fontWeight: 500,
              }}
              width={80}
            />
            <Tooltip
              cursor={{ fill: "var(--color-muted)", opacity: 0.1 }}
              content={<CustomTooltip />}
            />
            <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={12}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend / Metrics List */}
      <div className="grid grid-cols-1 gap-4 border-t border-border/40 pt-5">
        {data.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.role} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${item.iconColor}`}
                >
                  <Icon className="size-4" />
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {item.role}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-foreground tabular-nums">
                  {item.count.toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground/60 font-medium">
                  ({item.percentage}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      role: string;
      count: number;
      percentage: number;
      color: string;
      iconColor: string;
      icon: React.ComponentType<{ className?: string }>;
    };
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border border-border/80 bg-popover px-3 py-2 text-xs shadow-md">
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-popover-foreground">
            {data.role}
          </span>
          <span className="text-muted-foreground font-medium">
            Users:{" "}
            <span className="font-bold text-popover-foreground">
              {data.count.toLocaleString()}
            </span>
          </span>
          <span className="text-muted-foreground font-medium">
            Share:{" "}
            <span className="font-bold text-popover-foreground">
              {data.percentage}%
            </span>
          </span>
        </div>
      </div>
    );
  }
  return null;
};
