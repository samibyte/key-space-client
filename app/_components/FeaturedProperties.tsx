import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Property } from "@/types/property.type";
import PropertyCard from "@/app/(commonLayout)/properties/_components/PropertyCard";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FeaturedPropertiesProps {
  properties: Property[];
}

export default function FeaturedProperties({
  properties,
}: FeaturedPropertiesProps) {
  return (
    <section className="bg-muted/30 border-y border-border/40 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-widest text-primary font-bold">
              Top Pick Spaces
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Featured Properties
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Hand-picked verified listings configured with premium amenities
              and verified landlords.
            </p>
          </div>

          <Link
            href="/properties"
            className="text-sm font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all shrink-0 group"
          >
            View all listings
            <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Listings Display Grid */}
        {properties.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-border rounded-3xl bg-background/50">
            <p className="text-muted-foreground text-sm">
              No properties available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6.5">
            {properties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}

        {/* Bottom CTA container */}
        <div className="text-center mt-4">
          <Link
            href="/properties"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-11 px-8 rounded-xl font-bold bg-background shadow-xs hover:scale-[1.02] transition-transform",
            )}
          >
            Browse All Available Listings
          </Link>
        </div>
      </div>
    </section>
  );
}
