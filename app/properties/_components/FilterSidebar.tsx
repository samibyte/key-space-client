"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { SlidersHorizontal, RotateCcw, X } from "lucide-react";
import { useCategories } from "@/app/properties/_hooks/useProperties";
import type { PropertyFilters, PropertySortBy, SortOrder } from "@/types/property.type";

const AMENITY_OPTIONS = ["WiFi", "AC", "Parking", "Gym", "Pool", "Lift", "Security"];
const BEDROOM_OPTIONS = ["1", "2", "3", "4", "5+"];
const BATHROOM_OPTIONS = ["1", "2", "3", "4+"];

interface FilterSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function FilterSidebar({ isOpen, onClose }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: categoriesRes } = useCategories();
  const categories = categoriesRes?.data ?? [];

  const getParam = (key: string) => searchParams.get(key) ?? "";

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.set("page", "1");
      router.push(`/properties?${params.toString()}`);
    },
    [router, searchParams],
  );

  const toggleAmenity = useCallback(
    (amenity: string) => {
      const current = getParam("amenities")
        .split(",")
        .filter(Boolean);
      const next = current.includes(amenity)
        ? current.filter((a) => a !== amenity)
        : [...current, amenity];
      updateParam("amenities", next.join(","));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams, updateParam],
  );

  const selectedAmenities = getParam("amenities").split(",").filter(Boolean);

  function resetAll() {
    router.push("/properties");
  }

  const hasFilters = Array.from(searchParams.keys()).some((k) => k !== "page");

  const containerClass = [
    "flex flex-col gap-5 bg-card border border-border/60 rounded-2xl p-5",
    // mobile drawer behaviour
    "max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:z-50 max-lg:w-72 max-lg:overflow-y-auto max-lg:shadow-2xl",
    "max-lg:transition-transform max-lg:duration-300",
    isOpen ? "max-lg:translate-x-0" : "max-lg:-translate-x-full",
    // desktop sticky
    "lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto",
  ].join(" ");

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={containerClass}>
        {/* Sidebar header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-primary" />
            <h2 className="font-semibold text-sm text-foreground">Filters</h2>
          </div>
          <div className="flex items-center gap-2">
            {hasFilters && (
              <button
                onClick={resetAll}
                className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-destructive transition-colors"
              >
                <RotateCcw className="size-3" />
                Reset
              </button>
            )}
            {/* Close on mobile */}
            <button
              onClick={onClose}
              className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close filters"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        <hr className="border-border/50" />

        {/* City */}
        <FilterGroup label="City">
          <input
            type="text"
            placeholder="e.g. Dhaka"
            defaultValue={getParam("city")}
            onBlur={(e) => updateParam("city", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") updateParam("city", (e.target as HTMLInputElement).value);
            }}
            className="w-full text-sm bg-muted/50 border border-border/60 rounded-lg px-3 py-2 placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
          />
        </FilterGroup>

        {/* Price range */}
        <FilterGroup label="Monthly Rent (৳)">
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              defaultValue={getParam("minPrice")}
              min={0}
              onBlur={(e) => updateParam("minPrice", e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") updateParam("minPrice", (e.target as HTMLInputElement).value);
              }}
              className="w-full text-sm bg-muted/50 border border-border/60 rounded-lg px-3 py-2 placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
            />
            <input
              type="number"
              placeholder="Max"
              defaultValue={getParam("maxPrice")}
              min={0}
              onBlur={(e) => updateParam("maxPrice", e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") updateParam("maxPrice", (e.target as HTMLInputElement).value);
              }}
              className="w-full text-sm bg-muted/50 border border-border/60 rounded-lg px-3 py-2 placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
            />
          </div>
        </FilterGroup>

        {/* Bedrooms */}
        <FilterGroup label="Bedrooms">
          <div className="flex flex-wrap gap-2">
            {BEDROOM_OPTIONS.map((opt) => {
              const val = opt === "5+" ? "5" : opt;
              const active = getParam("minBedrooms") === val || getParam("bedrooms") === val;
              return (
                <button
                  key={opt}
                  onClick={() => {
                    if (opt === "5+") {
                      updateParam("minBedrooms", "5");
                      updateParam("bedrooms", "");
                    } else {
                      updateParam("bedrooms", active ? "" : val);
                      updateParam("minBedrooms", "");
                    }
                  }}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                    active
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted/50 border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </FilterGroup>

        {/* Bathrooms */}
        <FilterGroup label="Bathrooms">
          <div className="flex flex-wrap gap-2">
            {BATHROOM_OPTIONS.map((opt) => {
              const val = opt === "4+" ? "4" : opt;
              const isActive = getParam("bathrooms") === val;
              return (
                <button
                  key={opt}
                  onClick={() => updateParam("bathrooms", isActive ? "" : val)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted/50 border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </FilterGroup>

        {/* Category */}
        {categories.length > 0 && (
          <FilterGroup label="Property Type">
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="category"
                  checked={!getParam("categoryId")}
                  onChange={() => updateParam("categoryId", "")}
                  className="accent-primary"
                />
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                  All Types
                </span>
              </label>
              {categories.map((cat) => (
                <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="category"
                    checked={getParam("categoryId") === cat.id}
                    onChange={() => updateParam("categoryId", cat.id)}
                    className="accent-primary"
                  />
                  <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                    {cat.name}
                  </span>
                </label>
              ))}
            </div>
          </FilterGroup>
        )}

        {/* Amenities */}
        <FilterGroup label="Amenities">
          <div className="flex flex-col gap-1.5">
            {AMENITY_OPTIONS.map((amenity) => (
              <label
                key={amenity}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={selectedAmenities.includes(amenity)}
                  onChange={() => toggleAmenity(amenity)}
                  className="accent-primary size-3.5"
                />
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                  {amenity}
                </span>
              </label>
            ))}
          </div>
        </FilterGroup>

        {/* Sort */}
        <FilterGroup label="Sort By">
          <select
            value={`${getParam("sortBy") || "createdAt"}:${getParam("sortOrder") || "desc"}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split(":");
              updateParam("sortBy", sortBy as PropertySortBy);
              updateParam("sortOrder", sortOrder as SortOrder);
            }}
            className="w-full text-sm bg-muted/50 border border-border/60 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40 transition text-foreground"
          >
            <option value="createdAt:desc">Newest First</option>
            <option value="createdAt:asc">Oldest First</option>
            <option value="monthlyRent:asc">Price: Low to High</option>
            <option value="monthlyRent:desc">Price: High to Low</option>
            <option value="bedrooms:desc">Most Bedrooms</option>
            <option value="bedrooms:asc">Least Bedrooms</option>
          </select>
        </FilterGroup>
      </aside>
    </>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      {children}
    </div>
  );
}
