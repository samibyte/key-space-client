"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  Building,
  Building2,
  Key,
  Users,
  Landmark,
} from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PublicStats } from "@/services/property.service";
import { useQuery } from "@tanstack/react-query";
import { clientGet } from "@/lib/axios/apiClient";
import { Category, Region } from "@/types/property.type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HeroSectionProps {
  stats: PublicStats;
}

export default function HeroSection({ stats }: HeroSectionProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [regionId, setRegionId] = useState<string>("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.set("searchTerm", searchTerm);
    if (regionId) params.set("regionId", regionId);
    if (categoryId) params.set("categoryId", categoryId);

    router.push(`/properties?${params.toString()}`);
  };

  const { data: regionsData } = useQuery({
    queryKey: ["regions"],
    queryFn: () => clientGet<Region[]>("/regions"),
    staleTime: Infinity,
  });
  const regions: Region[] = regionsData?.data ?? [];

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => clientGet<Category[]>("/categories"),
    staleTime: Infinity,
  });
  const categories: Category[] = categoriesData?.data ?? [];

  const statItems = [
    {
      label: "Listed Properties",
      val: stats.totalProperties,
      icon: <Building2 className="size-4.5" />,
    },
    {
      label: "Active Leases",
      val: stats.activeLeases,
      icon: <Key className="size-4.5" />,
    },
    {
      label: "Registered Tenants",
      val: stats.totalTenants,
      icon: <Users className="size-4.5" />,
    },
    {
      label: "Partner Landlords",
      val: stats.totalLandlords,
      icon: <Landmark className="size-4.5" />,
    },
  ];

  return (
    <section className="relative overflow-hidden pt-36 pb-24 px-4 sm:px-6 lg:px-8 bg-background flex items-center min-h-screen">
      {/* Background Images */}
      <div className="absolute inset-0 block md:hidden bg-cover bg-bottom opacity-70 dark:opacity-40 z-0 bg-[url('/rent-nest-hero-bg-mobile.png')]" />
      <div className="absolute inset-0 hidden md:block bg-cover bg-right  dark:opacity-40 z-0 bg-[url('/rent-nest-hero-bg-pc.png')]" />

      {/* Dynamic overlays for text legibility */}
      <div className="absolute inset-0 bg-black/30 z-10 hidden md:block" />
      <div className="absolute inset-0 bg-linear-to-t from-background/20 via-background/50 to-transparent z-10 block md:hidden" />

      {/* Decorative radial blur elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl z-10 pointer-events-none" />

      <div className="mx-auto max-w-7xl w-full flex flex-col items-center md:items-start text-center md:text-left gap-6 relative z-20">
        {/* Big Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] text-secondary/80 max-w-2xl">
          Find Your Perfect <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
            Nesting Spot
          </span>{" "}
          Today
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-secondary/70 max-w-2xl leading-relaxed">
          Search thousands of verified listings across Dhaka, Chittagong, and
          beyond. Request leases, manage documents, and handle monthly payments
          securely all in one place.
        </p>

        {/* Search Box / Interactive Bar */}
        <form
          onSubmit={handleSearch}
          className="w-full max-w-4xl p-2 rounded-2xl sm:rounded-full bg-card/75 backdrop-blur-md border border-border/80 shadow-lg flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-4"
        >
          {/* Search Term */}
          <div className="flex-1 flex items-center gap-2 px-3 py-2 border-b sm:border-b-0 sm:border-r border-border/60">
            <Search className="size-5 text-foreground shrink-0" />
            <input
              type="text"
              placeholder="Search properties, area, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-sm text-black placeholder:text-muted-foreground outline-none border-none"
            />
          </div>

          {/* Region Selection */}
          <div className="flex-1 flex items-center gap-2 px-3 py-2 border-b sm:border-b-0 sm:border-r border-border/60">
            <MapPin className="size-5 text-muted-foreground shrink-0" />
            <Select
              value={regionId}
              onValueChange={(val) => val && setRegionId(val)}
            >
              <SelectTrigger id="regionSelector">
                <SelectValue placeholder="Select division">
                  {regions.find((r) => r.id === regionId)?.name}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {regions.length === 0 ? (
                  <SelectItem value="__loading" disabled>
                    Loading regions...
                  </SelectItem>
                ) : (
                  regions.map((region) => (
                    <SelectItem key={region.id} value={region.id}>
                      {region.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Category Selection */}
          <div className="flex-1 flex items-center gap-2 px-3 py-2">
            <Building className="size-5 text-muted-foreground shrink-0" />
            <Select
              value={categoryId}
              onValueChange={(val) => val && setCategoryId(val)}
            >
              <SelectTrigger id="categorySelector">
                <SelectValue placeholder="Select property type">
                  {categories.find((c) => c.id === categoryId)?.name}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {categories.length === 0 ? (
                  <SelectItem value="__loading" disabled>
                    Loading categories...
                  </SelectItem>
                ) : (
                  categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            className="sm:h-11 h-12 px-6 rounded-xl sm:rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <Search className="size-4" />
            Search
          </button>
        </form>

        {/* Primary CTA and About Link */}
        <div className="flex items-center gap-4 mt-2">
          <Link
            href="/properties"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "rounded-full hover:bg-muted bg-background/55 backdrop-blur-xs",
            )}
          >
            Explore Map Listings
          </Link>
        </div>

        {/* Inline Metrics / Stats chips */}
        <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 pt-8 border-t border-border/40">
          {statItems.map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-3 p-3 rounded-2xl bg-card/80 border border-border/40 hover:border-primary hover:scale-105 transition-all duration-205"
            >
              <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                {s.icon}
              </div>
              <div className="text-left">
                <span className="text-sm font-extrabold text-foreground leading-none tracking-tight block">
                  {s.val >= 1000 ? `${(s.val / 1000).toFixed(0)}k+` : s.val}
                </span>
                <span className="text-[10px] text-muted-foreground font-medium block mt-0.5 whitespace-nowrap">
                  {s.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
