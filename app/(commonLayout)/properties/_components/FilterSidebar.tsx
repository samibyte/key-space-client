"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import {
  SlidersHorizontal,
  RotateCcw,
  X,
  MapPin,
  BedDouble,
  Bath,
  Sparkles,
  ArrowUpDown,
  Tag,
} from "lucide-react";
import { useCategories } from "@/app/(commonLayout)/properties/_hooks/useProperties";
import type { PropertySortBy, SortOrder } from "@/types/property.type";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const AMENITY_OPTIONS = [
  { id: "WiFi", label: "WiFi", icon: "📶" },
  { id: "AC", label: "Air Conditioning", icon: "❄️" },
  { id: "Parking", label: "Parking", icon: "🚗" },
  { id: "Gym", label: "Gym", icon: "🏋️" },
  { id: "Pool", label: "Swimming Pool", icon: "🏊" },
  { id: "Lift", label: "Elevator / Lift", icon: "🛗" },
  { id: "Security", label: "Security", icon: "🔒" },
];

const BEDROOM_OPTIONS = ["Any", "1", "2", "3", "4", "5+"];
const BATHROOM_OPTIONS = ["Any", "1", "2", "3", "4+"];

const SORT_OPTIONS = [
  { value: "createdAt:desc", label: "Newest First" },
  { value: "createdAt:asc", label: "Oldest First" },
  { value: "monthlyRent:asc", label: "Price: Low → High" },
  { value: "monthlyRent:desc", label: "Price: High → Low" },
  { value: "bedrooms:desc", label: "Most Bedrooms" },
  { value: "bedrooms:asc", label: "Fewest Bedrooms" },
];

const MAX_PRICE = 100000;

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
      router.push(`/properties?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      params.set("page", "1");
      router.push(`/properties?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const toggleAmenity = useCallback(
    (amenity: string) => {
      const current = getParam("amenities").split(",").filter(Boolean);
      const next = current.includes(amenity)
        ? current.filter((a) => a !== amenity)
        : [...current, amenity];
      updateParam("amenities", next.join(","));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams, updateParam],
  );

  const selectedAmenities = getParam("amenities").split(",").filter(Boolean);

  // Price slider state (local, applies on change end)
  const initialMin = parseInt(getParam("minPrice") || "0", 10);
  const initialMax = parseInt(getParam("maxPrice") || String(MAX_PRICE), 10);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    initialMin,
    Math.min(initialMax, MAX_PRICE),
  ]);

  function applyPriceRange(range: number[]) {
    const [min, max] = range as [number, number];
    setPriceRange([min, max]);
    const params = new URLSearchParams(searchParams.toString());
    if (min > 0) params.set("minPrice", String(min));
    else params.delete("minPrice");
    if (max < MAX_PRICE) params.set("maxPrice", String(max));
    else params.delete("maxPrice");
    params.set("page", "1");
    router.push(`/properties?${params.toString()}`, { scroll: false });
  }

  function resetAll() {
    setPriceRange([0, MAX_PRICE]);
    router.push("/properties", { scroll: false });
  }

  const hasFilters = Array.from(searchParams.keys()).some((k) => k !== "page");

  const currentSort = `${getParam("sortBy") || "createdAt"}:${getParam("sortOrder") || "desc"}`;

  const containerClass = cn(
    // Base styles
    "flex flex-col gap-0 bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm",
    // Mobile drawer
    "max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:z-50 max-lg:w-80 max-lg:shadow-2xl max-lg:overflow-y-auto",
    "max-lg:transition-transform max-lg:duration-300",
    isOpen ? "max-lg:translate-x-0" : "max-lg:-translate-x-full",
    // Desktop sticky — no overflow
    "lg:sticky lg:top-24 lg:self-start",
  );

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
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border/50">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center size-7 rounded-lg bg-primary/10">
              <SlidersHorizontal className="size-3.5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-sm text-foreground leading-none">
                Filters
              </h2>
              {hasFilters && (
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Active
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {hasFilters && (
              <button
                onClick={resetAll}
                className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground hover:text-destructive transition-colors px-2 py-1 rounded-md hover:bg-destructive/10"
              >
                <RotateCcw className="size-3" />
                Reset
              </button>
            )}
            <button
              onClick={onClose}
              className="lg:hidden flex items-center justify-center size-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
              aria-label="Close filters"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex flex-col divide-y divide-border/50">
          {/* City */}
          <FilterSection
            icon={<MapPin className="size-3.5" />}
            label="Location"
          >
            <Input
              type="text"
              placeholder="e.g. Dhaka, Chittagong…"
              defaultValue={getParam("city")}
              onBlur={(e) => updateParam("city", e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter")
                  updateParam("city", (e.target as HTMLInputElement).value);
              }}
              className="h-8 text-sm"
            />
          </FilterSection>
          {/* Sort */}
          <FilterSection
            icon={<ArrowUpDown className="size-3.5" />}
            label="Sort By"
          >
            <div className="grid grid-cols-2 gap-1">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    const [sortBy, sortOrder] = opt.value.split(":");
                    updateParam("sortBy", sortBy as PropertySortBy);
                    updateParam("sortOrder", sortOrder as SortOrder);
                  }}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200 text-left",
                    currentSort === opt.value
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground border border-transparent",
                  )}
                >
                  {currentSort === opt.value && (
                    <span className="size-1.5 rounded-full bg-primary shrink-0" />
                  )}
                  {opt.label}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* Price range slider */}
          <FilterSection
            icon={<Tag className="size-3.5" />}
            label="Monthly Rent (৳)"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-foreground tabular-nums">
                ৳{priceRange[0].toLocaleString()}
              </span>
              <span className="text-[10px] text-muted-foreground">to</span>
              <span className="text-xs font-semibold text-foreground tabular-nums">
                {priceRange[1] >= MAX_PRICE
                  ? "৳" + MAX_PRICE.toLocaleString() + "+"
                  : "৳" + priceRange[1].toLocaleString()}
              </span>
            </div>
            <Slider
              value={priceRange}
              min={0}
              max={MAX_PRICE}
              step={500}
              onValueChange={(val) => setPriceRange(val as [number, number])}
              onValueCommitted={(val: number | readonly number[]) =>
                applyPriceRange(val as number[])
              }
            />
          </FilterSection>

          {/* Bedrooms */}
          <FilterSection
            icon={<BedDouble className="size-3.5" />}
            label="Bedrooms"
          >
            <div className="flex flex-wrap gap-1.5">
              {BEDROOM_OPTIONS.map((opt) => {
                const val = opt === "Any" ? "" : opt === "5+" ? "5" : opt;
                const isAny = opt === "Any";
                const active = isAny
                  ? !getParam("minBedrooms") && !getParam("bedrooms")
                  : opt === "5+"
                    ? getParam("minBedrooms") === "5"
                    : getParam("bedrooms") === val;
                return (
                  <button
                    key={opt}
                    onClick={() => {
                      if (isAny) {
                        updateParams({ bedrooms: "", minBedrooms: "" });
                      } else if (opt === "5+") {
                        updateParams({ minBedrooms: "5", bedrooms: "" });
                      } else {
                        updateParams({
                          bedrooms: active ? "" : val,
                          minBedrooms: "",
                        });
                      }
                    }}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200",
                      active
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-muted/40 border-border/50 text-muted-foreground hover:border-primary/50 hover:text-foreground hover:bg-muted/70",
                    )}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </FilterSection>

          {/* Bathrooms */}
          <FilterSection icon={<Bath className="size-3.5" />} label="Bathrooms">
            <div className="flex flex-wrap gap-1.5">
              {BATHROOM_OPTIONS.map((opt) => {
                const val = opt === "Any" ? "" : opt === "4+" ? "4" : opt;
                const isAny = opt === "Any";
                const isActive = isAny
                  ? !getParam("bathrooms")
                  : getParam("bathrooms") === val;
                return (
                  <button
                    key={opt}
                    onClick={() =>
                      updateParam("bathrooms", isAny ? "" : isActive ? "" : val)
                    }
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-muted/40 border-border/50 text-muted-foreground hover:border-primary/50 hover:text-foreground hover:bg-muted/70",
                    )}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </FilterSection>

          {/* Property Type */}
          {categories.length > 0 && (
            <FilterSection
              icon={<Tag className="size-3.5" />}
              label="Property Type"
            >
              <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                {[{ id: "", name: "All Types" }, ...categories].map((cat) => (
                  <label
                    key={cat.id}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <Checkbox
                      checked={
                        cat.id === ""
                          ? !getParam("categoryId")
                          : getParam("categoryId") === cat.id
                      }
                      onCheckedChange={() => updateParam("categoryId", cat.id)}
                    />
                    <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors truncate">
                      {cat.name}
                    </span>
                  </label>
                ))}
              </div>
            </FilterSection>
          )}

          {/* Amenities */}
          <FilterSection
            icon={<Sparkles className="size-3.5" />}
            label="Amenities"
          >
            <div className="grid grid-cols-2 gap-x-3 gap-y-2">
              {AMENITY_OPTIONS.map(({ id, label, icon }) => (
                <label
                  key={id}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <Checkbox
                    checked={selectedAmenities.includes(id)}
                    onCheckedChange={() => toggleAmenity(id)}
                  />
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                    <span className="text-sm leading-none">{icon}</span>
                    {label}
                  </span>
                </label>
              ))}
            </div>
            {selectedAmenities.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-border/40">
                {selectedAmenities.map((a) => (
                  <Badge
                    key={a}
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
                    onClick={() => toggleAmenity(a)}
                  >
                    {a} ×
                  </Badge>
                ))}
              </div>
            )}
          </FilterSection>
        </div>
      </aside>
    </>
  );
}

function FilterSection({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="px-4 py-3">
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-primary/60">{icon}</span>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
          {label}
        </p>
      </div>
      {children}
    </div>
  );
}
