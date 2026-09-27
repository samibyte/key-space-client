import type { Metadata } from "next";
import {
  getCategories,
  getProperties,
  getPublicStats,
  getRegions,
  type PublicStats,
} from "@/services/property.service";
import type { Property } from "@/types/property.type";
import HeroSection from "../_components/HeroSection";
import CollectionsSection from "../_components/CollectionsSection";
import FeaturedProperties from "../_components/FeaturedProperties";
import LocationsSection from "../_components/LocationsSection";
import HowItWorks from "../_components/HowItWorks";
import TestimonialsSection from "../_components/TestimonialsSection";
import BenefitsSection from "../_components/BenefitsSection";
import LandlordCTA from "../_components/LandlordCTA";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";

export const metadata: Metadata = {
  title: "KeySpace | Premium Property Rentals & Placement Platform",
  description:
    "Explore verified rentals, flats, duplexes, and commercial spaces across Bangladesh. Seamless lease matching, secure payments, and tenant credit management.",
};

export default async function HomePage() {
  // Graceful fallback for stats
  let stats: PublicStats = {
    totalProperties: 1250,
    activeLeases: 412,
    totalTenants: 980,
    totalLandlords: 310,
  };

  // Graceful fallback for properties
  let featuredProperties: Property[] = [];
  const queryClient = new QueryClient();

  // Prefetch categories and regions on the server so the client gets them instantly
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["categories"],
      queryFn: getCategories,
    }),
    queryClient.prefetchQuery({
      queryKey: ["regions"],
      queryFn: getRegions,
    }),
  ]);

  try {
    const [statsRes, propertiesRes] = await Promise.all([
      getPublicStats(),
      getProperties({ limit: "6", status: "AVAILABLE" }),
    ]);

    if (statsRes && statsRes.success) {
      stats = statsRes.data;
    }
    if (propertiesRes && propertiesRes.success) {
      featuredProperties = propertiesRes.data;
    }
  } catch (error) {
    console.error("Could not fetch DB records for KeySpace Home:", error);
  }

  return (
    <main className="-mt-18 flex flex-col flex-1 bg-background select-none">
      {/* 1. Hero Hero Header */}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <HeroSection stats={stats} />
      </HydrationBoundary>

      {/* 2. Curated collections */}
      <CollectionsSection />

      {/* 3. Featured properties */}
      <FeaturedProperties properties={featuredProperties} />

      {/* 4. Explore by locations */}
      <LocationsSection />

      {/* 5. How it works timeline */}
      <HowItWorks />

      {/* 6. Testimonials trust strip */}
      <TestimonialsSection stats={stats} />

      {/* 7. Occupant Perks & Benefits */}
      <BenefitsSection />

      {/* 8. Become a landlord banner */}
      <LandlordCTA />
    </main>
  );
}
