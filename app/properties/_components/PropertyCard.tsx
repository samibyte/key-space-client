"use client";

import Image from "next/image";
import Link from "next/link";
import {
  BedDouble,
  Bath,
  Maximize2,
  MapPin,
  Tag,
  Wifi,
  Car,
  Wind,
  Dumbbell,
  Waves,
  ShieldCheck,
  Building2,
} from "lucide-react";
import type { Property } from "@/types/property.type";

interface PropertyCardProps {
  property: Property;
}

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="size-3" />,
  AC: <Wind className="size-3" />,
  Parking: <Car className="size-3" />,
  Gym: <Dumbbell className="size-3" />,
  Pool: <Waves className="size-3" />,
  Security: <ShieldCheck className="size-3" />,
  Lift: <Building2 className="size-3" />,
};

const STATUS_STYLES: Record<string, string> = {
  AVAILABLE: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  RENTED: "bg-rose-500/20 text-rose-400 border border-rose-500/30",
  UNAVAILABLE: "bg-zinc-500/20 text-zinc-400 border border-zinc-500/30",
};

function formatPrice(price: number): string {
  if (price >= 1000) {
    return `৳${(price / 1000).toFixed(price % 1000 === 0 ? 0 : 1)}k`;
  }
  return `৳${price.toLocaleString()}`;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const {
    id,
    title,
    address,
    city,
    area,
    monthlyRent,
    bedrooms,
    bathrooms,
    size,
    images,
    amenities,
    status,
    category,
    landlord,
  } = property;

  const displayImage = images?.[0] ?? null;
  const extraImages = images?.length > 1 ? images.length - 1 : 0;
  const displayAmenities = amenities?.slice(0, 3) ?? [];
  const extraAmenities = (amenities?.length ?? 0) - displayAmenities.length;

  return (
    <Link
      href={`/properties/${id}`}
      className="group relative flex flex-col rounded-2xl overflow-hidden bg-card border border-border/60 shadow-sm hover:shadow-xl hover:shadow-primary/8 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      {/* Image area */}
      <div className="relative h-52 w-full overflow-hidden bg-muted flex-shrink-0">
        {displayImage ? (
          <Image
            src={displayImage}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <Building2 className="size-12 text-muted-foreground/30" />
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Extra images badge */}
        {extraImages > 0 && (
          <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full border border-white/20">
            +{extraImages} photos
          </span>
        )}

        {/* Status badge */}
        <span
          className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide backdrop-blur-sm ${STATUS_STYLES[status] ?? STATUS_STYLES.UNAVAILABLE}`}
        >
          {status === "AVAILABLE" ? "Available" : status === "RENTED" ? "Rented" : "Unavailable"}
        </span>

        {/* Price overlay on bottom */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div>
            <p className="text-white text-xl font-bold leading-none drop-shadow">
              {formatPrice(monthlyRent)}
            </p>
            <p className="text-white/70 text-[10px] mt-0.5">/ month</p>
          </div>
          {category && (
            <span className="bg-primary/80 backdrop-blur-sm text-primary-foreground text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
              <Tag className="size-2.5" />
              {category.name}
            </span>
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Title + location */}
        <div>
          <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-1 mt-1.5 text-muted-foreground">
            <MapPin className="size-3 flex-shrink-0 text-primary/70" />
            <span className="text-[11px] truncate">
              {[area, city].filter(Boolean).join(", ") || address}
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground border-t border-border/50 pt-2.5">
          <span className="flex items-center gap-1.5">
            <BedDouble className="size-3.5 text-primary/70 flex-shrink-0" />
            <span className="font-medium text-foreground">{bedrooms}</span> bed
          </span>
          <span className="flex items-center gap-1.5">
            <Bath className="size-3.5 text-primary/70 flex-shrink-0" />
            <span className="font-medium text-foreground">{bathrooms}</span> bath
          </span>
          {size && (
            <span className="flex items-center gap-1.5 ml-auto">
              <Maximize2 className="size-3 text-muted-foreground/70 flex-shrink-0" />
              <span>{size} sqft</span>
            </span>
          )}
        </div>

        {/* Amenity chips */}
        {displayAmenities.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            {displayAmenities.map((amenity) => (
              <span
                key={amenity}
                className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-accent text-accent-foreground border border-accent/60"
              >
                {AMENITY_ICONS[amenity] ?? null}
                {amenity}
              </span>
            ))}
            {extraAmenities > 0 && (
              <span className="text-[10px] text-muted-foreground font-medium px-2 py-0.5 rounded-full bg-muted">
                +{extraAmenities}
              </span>
            )}
          </div>
        )}

        {/* Landlord footer */}
        <div className="flex items-center gap-2 mt-auto border-t border-border/50 pt-2.5">
          <div className="size-7 rounded-full overflow-hidden bg-primary/10 flex-shrink-0 flex items-center justify-center ring-1 ring-primary/20">
            {landlord?.avatar ? (
              <Image
                src={landlord.avatar}
                alt={landlord.name}
                width={28}
                height={28}
                className="object-cover"
              />
            ) : (
              <span className="text-primary text-[10px] font-bold uppercase">
                {landlord?.name?.charAt(0) ?? "?"}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-muted-foreground">Listed by</p>
            <p className="text-[11px] font-medium text-foreground truncate">
              {landlord?.name ?? "Landlord"}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
