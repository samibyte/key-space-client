"use client";

import { useState } from "react";
import {
  MapPin,
  Wifi,
  Car,
  Wind,
  Dumbbell,
  Waves,
  ShieldCheck,
  Building2,
  Tag,
  CalendarDays,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { PropertyDetail } from "@/types/property.type";

interface PropertyDetailsProps {
  property: PropertyDetail;
}

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="size-4" />,
  AC: <Wind className="size-4" />,
  Parking: <Car className="size-4" />,
  Gym: <Dumbbell className="size-4" />,
  Pool: <Waves className="size-4" />,
  Security: <ShieldCheck className="size-4" />,
  Lift: <Building2 className="size-4" />,
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function PropertyDetails({ property }: PropertyDetailsProps) {
  const {
    description,
    address,
    city,
    area,
    amenities,
    category,
    createdAt,
    size,
    bedrooms,
    bathrooms,
  } = property;

  const [expanded, setExpanded] = useState(false);
  const DESCRIPTION_LIMIT = 220;
  const isLong = description.length > DESCRIPTION_LIMIT;
  const displayedDescription =
    expanded || !isLong ? description : description.slice(0, DESCRIPTION_LIMIT) + "...";

  return (
    <div className="flex flex-col gap-8">
      {/* About Section */}
      <section>
        <h2 className="text-xl font-bold text-foreground mb-3">About this Property</h2>
        <div className="rounded-2xl border border-border/50 bg-card p-5">
          <p className="text-muted-foreground leading-relaxed text-sm">
            {displayedDescription}
          </p>
          {isLong && (
            <button
              className="mt-2 flex items-center gap-1 text-primary text-sm font-medium hover:text-primary/80 transition-colors"
              onClick={() => setExpanded((p) => !p)}
            >
              {expanded ? (
                <>
                  Show less <ChevronUp className="size-4" />
                </>
              ) : (
                <>
                  Read more <ChevronDown className="size-4" />
                </>
              )}
            </button>
          )}
        </div>
      </section>

      {/* Property Facts */}
      <section>
        <h2 className="text-xl font-bold text-foreground mb-3">Property Facts</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: "Category",
              value: category.name,
              icon: <Tag className="size-4 text-primary/70" />,
            },
            {
              label: "Bedrooms",
              value: `${bedrooms} bed${bedrooms !== 1 ? "s" : ""}`,
              icon: <Building2 className="size-4 text-primary/70" />,
            },
            {
              label: "Bathrooms",
              value: `${bathrooms} bath${bathrooms !== 1 ? "s" : ""}`,
              icon: <Building2 className="size-4 text-primary/70" />,
            },
            {
              label: "Size",
              value: size ? `${size} sqft` : "Not specified",
              icon: <Building2 className="size-4 text-primary/70" />,
            },
            {
              label: "Listed on",
              value: formatDate(createdAt),
              icon: <CalendarDays className="size-4 text-primary/70" />,
            },
          ].map((fact) => (
            <div
              key={fact.label}
              className="flex flex-col gap-1.5 p-3.5 rounded-xl bg-muted/50 border border-border/40"
            >
              <div className="flex items-center gap-1.5">
                {fact.icon}
                <span className="text-[10px] uppercase tracking-wide font-semibold text-muted-foreground">
                  {fact.label}
                </span>
              </div>
              <p className="text-sm font-medium text-foreground">{fact.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Location */}
      <section>
        <h2 className="text-xl font-bold text-foreground mb-3">Location</h2>
        <div className="rounded-2xl border border-border/50 bg-card p-5 flex items-start gap-3.5">
          <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <MapPin className="size-4.5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{address}</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {[area, city].filter(Boolean).join(", ")}
            </p>
          </div>
        </div>
      </section>

      {/* Amenities */}
      {amenities && amenities.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">Amenities</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {amenities.map((amenity) => (
              <div
                key={amenity}
                className="flex items-center gap-2.5 p-3.5 rounded-xl border border-border/40 bg-card hover:border-primary/30 hover:bg-accent/40 transition-colors duration-200"
              >
                <span className="text-primary/80 flex-shrink-0">
                  {AMENITY_ICONS[amenity] ?? <ShieldCheck className="size-4" />}
                </span>
                <span className="text-sm font-medium text-foreground">{amenity}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
