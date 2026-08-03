import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPropertyById } from "@/services/property.service";
import PropertyDetailHero from "./_components/PropertyDetailHero";
import PropertyInfoPanel from "./_components/PropertyInfoPanel";
import PropertyDetails from "./_components/PropertyDetails";
import LandlordCard from "./_components/LandlordCard";
import ReviewsSection from "./_components/ReviewsSection";
import PropertyDetailSkeleton from "./_components/PropertyDetailSkeleton";

interface PropertyDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PropertyDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const res = await getPropertyById(id);
    const property = res.data;
    if (!property) return { title: "Property Details | Rent Nest" };
    const description = property.description?.slice(0, 160) ?? "";
    const image = property.images?.[0];

    return {
      title: `${property.title} | Rent Nest`,
      description,
      openGraph: {
        title: property.title,
        description,
        images: image ? [{ url: image }] : [],
      },
    };
  } catch {
    return {
      title: "Property Details | Rent Nest",
    };
  }
}

async function PropertyDetailContent({ id }: { id: string }) {
  let property;

  try {
    const res = await getPropertyById(id);
    property = res.data;
  } catch {
    notFound();
  }

  if (!property) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      {/* Hero Gallery with Back Navigation */}
      <PropertyDetailHero property={property} />

      {/* Title + Location — below hero */}
      <div className="mt-7 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-snug">
          {property.title}
        </h1>
        <p className="text-muted-foreground mt-1.5 text-sm">
          {[property.area, property.city].filter(Boolean).join(", ") ||
            property.address}
        </p>
      </div>

      {/* Two-column layout: details + sticky panel */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 items-start">
        {/* Left: all property information */}
        <div className="flex flex-col gap-10">
          <PropertyDetails property={property} />
          <LandlordCard landlord={property.landlord} />
          <ReviewsSection reviews={property.reviews} />
        </div>

        {/* Right: sticky info + CTA panel */}
        <PropertyInfoPanel property={property} />
      </div>
    </div>
  );
}

export default async function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  const { id } = await params;

  return (
    <main className="-mt-18 flex flex-col flex-1 bg-background">
      <Suspense fallback={<PropertyDetailSkeleton />}>
        <PropertyDetailContent id={id} />
      </Suspense>
    </main>
  );
}
