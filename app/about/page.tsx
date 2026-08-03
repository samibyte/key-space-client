import type { Metadata } from "next";
import { getPublicStats, type PublicStats } from "@/services/property.service";
import AboutHero from "./_components/AboutHero";
import MissionVision from "./_components/MissionVision";
import StatsSection from "./_components/StatsSection";
import FeaturesSection from "./_components/FeaturesSection";
import AboutCTA from "./_components/AboutCTA";

export const metadata: Metadata = {
  title: "About Us | Rent Nest",
  description:
    "Learn about Rent Nest, our mission, core platform features, and milestones simplifying renting in Bangladesh.",
};

export default async function AboutPage() {
  // Graceful fallback for stats if fetch fails (e.g. initial server seed states)
  let stats: PublicStats = {
    totalProperties: 1250,
    activeLeases: 412,
    totalTenants: 980,
    totalLandlords: 310,
  };

  try {
    const res = await getPublicStats();
    if (res && res.success) {
      stats = res.data;
    }
  } catch (error) {
    console.error("Could not fetch DB public stats for About Page:", error);
  }

  return (
    <main className="-mt-18 flex flex-col flex-1 bg-background">
      {/* Hero Header */}
      <AboutHero />

      {/* Stats Board */}
      <StatsSection stats={stats} />

      {/* Mission & Values */}
      <MissionVision />

      {/* Feature Sets */}
      <FeaturesSection />

      {/* Call to action */}
      <AboutCTA />
    </main>
  );
}
