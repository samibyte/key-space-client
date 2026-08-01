"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import FilterSidebar from "./FilterSidebar";
import PropertyGrid from "./PropertyGrid";
import type { PropertyFilters } from "@/types/property.type";

interface PropertiesClientProps {
  initialFilters: PropertyFilters;
}

export default function PropertiesClient({ initialFilters }: PropertiesClientProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      {/* Mobile filter toggle */}
      <div className="flex items-center justify-between lg:hidden px-4 sm:px-6 pt-4">
        <h2 className="text-sm font-semibold text-foreground">Available Properties</h2>
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl border border-border/60 bg-card hover:bg-muted/50 transition-all"
        >
          <SlidersHorizontal className="size-3.5" />
          Filters
        </button>
      </div>

      {/* Main layout */}
      <div className="flex gap-8 px-4 sm:px-6 pb-12 items-start">
        {/* Sidebar */}
        <div className="w-96 shrink-0 hidden lg:block">
          <FilterSidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Mobile sidebar (portal-like via fixed positioning inside component) */}
        <div className="lg:hidden">
          <FilterSidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Grid */}
        <div className="flex-1 min-w-0">
          <PropertyGrid initialFilters={initialFilters} />
        </div>
      </div>
    </div>
  );
}
