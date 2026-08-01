import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
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
  const trendPositive = trend && trend.value > 0;
  const trendNegative = trend && trend.value < 0;

  return (
    <Card className={cn("relative overflow-hidden rounded-2xl transition-shadow duration-200 hover:shadow-md", className)}>
      {/* Decorative gradient accent */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-primary/40 via-primary to-primary/40 opacity-60" />
      
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2 pt-5">
        <CardTitle className="text-sm font-medium text-muted-foreground leading-snug">{label}</CardTitle>
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
          {icon}
        </div>
      </CardHeader>

      <CardContent className="pb-5">
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        {trend && (
          <div className="mt-2 flex items-center gap-1.5 text-xs">
            {trendPositive && <TrendingUp className="size-3.5 text-emerald-500" />}
            {trendNegative && <TrendingDown className="size-3.5 text-rose-500" />}
            {!trendPositive && !trendNegative && <Minus className="size-3.5 text-muted-foreground" />}
            <span className={cn(
              "font-semibold",
              trendPositive ? "text-emerald-500" : trendNegative ? "text-rose-500" : "text-muted-foreground"
            )}>
              {trend.value > 0 ? "+" : ""}
              {trend.value}%
            </span>
            <span className="text-muted-foreground">{trend.text}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
