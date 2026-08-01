import type { Metadata } from "next";
import { Suspense } from "react";
import ListingHero from "./_components/ListingHero";
import PropertiesClient from "./_components/PropertiesClient";
import type { PropertyFilters } from "@/types/property.type";

export const metadata: Metadata = {
  title: "Browse Properties | Rent Nest",
  description:
    "Discover premium rental properties across Bangladesh. Filter by city, price, bedrooms, amenities and more.",
};

interface PropertiesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function getString(val: string | string[] | undefined): string | undefined {
  if (Array.isArray(val)) return val[0];
  return val;
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const resolvedParams = await searchParams;

  const initialFilters: PropertyFilters = {
    searchTerm: getString(resolvedParams.searchTerm),
    city: getString(resolvedParams.city),
    area: getString(resolvedParams.area),
    minPrice: getString(resolvedParams.minPrice),
    maxPrice: getString(resolvedParams.maxPrice),
    categoryId: getString(resolvedParams.categoryId),
    amenities: getString(resolvedParams.amenities),
    amenityMatch: getString(resolvedParams.amenityMatch) as PropertyFilters["amenityMatch"],
    bedrooms: getString(resolvedParams.bedrooms),
    minBedrooms: getString(resolvedParams.minBedrooms),
    maxBedrooms: getString(resolvedParams.maxBedrooms),
    bathrooms: getString(resolvedParams.bathrooms),
    sortBy: getString(resolvedParams.sortBy) as PropertyFilters["sortBy"],
    sortOrder: getString(resolvedParams.sortOrder) as PropertyFilters["sortOrder"],
    page: getString(resolvedParams.page) ?? "1",
    limit: getString(resolvedParams.limit) ?? "12",
  };

  return (
    <main className="flex flex-col flex-1">
      {/* Hero with quick search */}
      <Suspense>
        <ListingHero />
      </Suspense>

      {/* Filters + Grid */}
      <div className="flex-1 bg-background">
        <div className="mx-auto max-w-[1600px] pt-6">
          <Suspense>
            <PropertiesClient initialFilters={initialFilters} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
