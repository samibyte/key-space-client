import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type StatusType = "AVAILABLE" | "RENTED" | "UNAVAILABLE" | "PENDING" | "APPROVED" | "REJECTED" | "ACTIVE" | "COMPLETED" | "FAILED" | "BANNED";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const styles: Record<StatusType, string> = {
  // Properties
  AVAILABLE: "bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 border-emerald-500/30 dark:text-emerald-400",
  RENTED: "bg-blue-500/15 text-blue-600 hover:bg-blue-500/25 border-blue-500/30 dark:text-blue-400",
  UNAVAILABLE: "bg-zinc-500/15 text-zinc-600 hover:bg-zinc-500/25 border-zinc-500/30 dark:text-zinc-400",
  // Rentals & Payments
  PENDING: "bg-amber-500/15 text-amber-600 hover:bg-amber-500/25 border-amber-500/30 dark:text-amber-400",
  APPROVED: "bg-blue-500/15 text-blue-600 hover:bg-blue-500/25 border-blue-500/30 dark:text-blue-400",
  REJECTED: "bg-rose-500/15 text-rose-600 hover:bg-rose-500/25 border-rose-500/30 dark:text-rose-400",
  ACTIVE: "bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 border-emerald-500/30 dark:text-emerald-400",
  COMPLETED: "bg-zinc-500/15 text-zinc-600 hover:bg-zinc-500/25 border-zinc-500/30 dark:text-zinc-400",
  FAILED: "bg-rose-500/15 text-rose-600 hover:bg-rose-500/25 border-rose-500/30 dark:text-rose-400",
  // Users
  BANNED: "bg-rose-500/15 text-rose-600 hover:bg-rose-500/25 border-rose-500/30 dark:text-rose-400",
};

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const badgeStyle = styles[status as StatusType] ?? "bg-muted text-muted-foreground border-border";

  return (
    <Badge 
      variant="outline"
      className={cn("uppercase tracking-wide font-semibold px-2.5 py-0.5 rounded-full border", badgeStyle, className)}
    >
      {status}
    </Badge>
  );
}
