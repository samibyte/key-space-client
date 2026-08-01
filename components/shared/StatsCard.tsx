import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number; // positive = up, negative = down
    text: string;
  };
  className?: string;
}

export default function StatsCard({
  label,
  value,
  icon,
  trend,
  className,
}: StatsCardProps) {
  return (
    <Card className={cn("overflow-hidden rounded-2xl", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 shadow-none space-y-0 border-none pb-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tracking-tight mt-1">{value}</div>
        {trend && (
          <p className="mt-2 text-xs">
            <span
              className={cn(
                "inline-flex font-medium pr-1",
                trend.value > 0 ? "text-emerald-500" : trend.value < 0 ? "text-rose-500" : "text-muted-foreground",
              )}
            >
              {trend.value > 0 ? "+" : ""}
              {trend.value}%
            </span>
            <span className="text-muted-foreground">{trend.text}</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
