"use client";

import { cn } from "@/lib/utils";

interface StatusTabFilterProps {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
  className?: string;
}

export default function StatusTabFilter({ tabs, active, onChange, className }: StatusTabFilterProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2 border-b border-border/40 pb-4", className)}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={cn(
            "px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 capitalize",
            active === tab
              ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
              : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          {tab.charAt(0) + tab.slice(1).toLowerCase()}
        </button>
      ))}
    </div>
  );
}
