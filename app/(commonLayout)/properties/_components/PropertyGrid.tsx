"use client";

import { Building2, SearchX, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import PropertyCard from "./PropertyCard";
import PropertyCardSkeleton from "./PropertyCardSkeleton";
import { useProperties } from "@/app/(commonLayout)/properties/_hooks/useProperties";
import type { PropertyFilters } from "@/types/property.type";
import type { PaginationMeta } from "@/types/api.type";

interface PropertyGridProps {
  initialFilters: PropertyFilters;
}

export default function PropertyGrid({ initialFilters }: PropertyGridProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Merge initial server-read filters with live URL params (client navigation)
  const filters: PropertyFilters = {
    ...initialFilters,
    searchTerm: searchParams.get("searchTerm") ?? initialFilters.searchTerm,
    city: searchParams.get("city") ?? initialFilters.city,
    area: searchParams.get("area") ?? initialFilters.area,
    minPrice: searchParams.get("minPrice") ?? initialFilters.minPrice,
    maxPrice: searchParams.get("maxPrice") ?? initialFilters.maxPrice,
    categoryId: searchParams.get("categoryId") ?? initialFilters.categoryId,
    amenities: searchParams.get("amenities") ?? initialFilters.amenities,
    bedrooms: searchParams.get("bedrooms") ?? initialFilters.bedrooms,
    minBedrooms: searchParams.get("minBedrooms") ?? initialFilters.minBedrooms,
    bathrooms: searchParams.get("bathrooms") ?? initialFilters.bathrooms,
    sortBy:
      (searchParams.get("sortBy") as PropertyFilters["sortBy"]) ??
      initialFilters.sortBy,
    sortOrder:
      (searchParams.get("sortOrder") as PropertyFilters["sortOrder"]) ??
      initialFilters.sortOrder,
    page: searchParams.get("page") ?? initialFilters.page ?? "1",
    limit: searchParams.get("limit") ?? initialFilters.limit ?? "12",
  };

  const { data: res, isLoading, isError } = useProperties(filters);
  const properties = res?.data ?? [];
  const meta = res?.meta as PaginationMeta | undefined;
  const totalPages = meta ? Math.ceil(meta.total / meta.limit) : 1;
  const currentPage = Number(filters.page) || 1;

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/properties?${params.toString()}`);
  }

  // --- Render states ---

  if (isError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-24 text-center gap-4">
        <div className="size-14 rounded-full bg-destructive/10 flex items-center justify-center">
          <SearchX className="size-7 text-destructive" />
        </div>
        <p className="font-semibold text-foreground">
          Failed to load properties
        </p>
        <p className="text-sm text-muted-foreground">
          Please check your connection and try again.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <PropertyCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!properties.length) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-24 text-center gap-4">
        <div className="size-16 rounded-full bg-muted flex items-center justify-center">
          <Building2 className="size-8 text-muted-foreground/40" />
        </div>
        <p className="font-semibold text-foreground">No properties found</p>
        <p className="text-sm text-muted-foreground max-w-xs">
          Try adjusting your filters or search terms to find available listings.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Result count */}
      {meta && (
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-semibold text-foreground">
            {(currentPage - 1) * meta.limit + 1}–
            {Math.min(currentPage * meta.limit, meta.total)}
          </span>{" "}
          of <span className="font-semibold text-foreground">{meta.total}</span>{" "}
          properties
        </p>
      )}

      {/* 4-column grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label="Previous page"
            className="size-9 flex items-center justify-center rounded-lg border border-border/60 bg-card text-muted-foreground hover:bg-muted/50 hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="size-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => {
              if (totalPages <= 7) return true;
              if (p === 1 || p === totalPages) return true;
              return Math.abs(p - currentPage) <= 2;
            })
            .reduce<(number | "…")[]>((acc, p, idx, arr) => {
              if (idx > 0) {
                const prev = arr[idx - 1] as number;
                if (p - prev > 1) acc.push("…");
              }
              acc.push(p);
              return acc;
            }, [])
            .map((item, idx) =>
              item === "…" ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-1 text-muted-foreground text-sm select-none"
                >
                  …
                </span>
              ) : (
                <button
                  key={item}
                  onClick={() => goToPage(item as number)}
                  className={`size-9 flex items-center justify-center rounded-lg text-sm font-medium border transition-all ${
                    item === currentPage
                      ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20"
                      : "bg-card border-border/60 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  {item}
                </button>
              ),
            )}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            aria-label="Next page"
            className="size-9 flex items-center justify-center rounded-lg border border-border/60 bg-card text-muted-foreground hover:bg-muted/50 hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
