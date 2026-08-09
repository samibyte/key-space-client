import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { getProperties } from "@/services/property.service";
import PropertyCard from "../../_components/PropertyCard";

interface RelatedPropertiesProps {
  categoryId: string;
  categoryName: string;
  currentPropertyId: string;
}

export default async function RelatedProperties({
  categoryId,
  categoryName,
  currentPropertyId,
}: RelatedPropertiesProps) {
  let related;

  try {
    const res = await getProperties({ categoryId, limit: 7, status: "AVAILABLE" });
    // Filter out the current property and cap at 3
    const candidates = (res.data ?? []).filter((p) => p.id !== currentPropertyId);
    related = candidates.slice(0, 3);
  } catch {
    return null;
  }

  if (!related || related.length === 0) return null;

  return (
    <section className="mt-16 mb-6">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="size-4 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground leading-tight">
              More Like This
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Similar {categoryName} properties you may like
            </p>
          </div>
        </div>

        <Link
          href={`/properties?categoryId=${categoryId}`}
          className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors group"
        >
          View all
          <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Divider */}
      <div className="h-px bg-linear-to-r from-border via-primary/20 to-transparent mb-7" />

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {related.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </section>
  );
}
