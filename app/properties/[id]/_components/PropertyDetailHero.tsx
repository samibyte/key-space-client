"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  X,
  Building2,
  Tag,
  Images,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PropertyDetail } from "@/types/property.type";

interface PropertyDetailHeroProps {
  property: PropertyDetail;
}

const STATUS_STYLES: Record<string, string> = {
  AVAILABLE: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  RENTED: "bg-rose-500/20 text-rose-400 border border-rose-500/30",
  UNAVAILABLE: "bg-zinc-500/20 text-zinc-400 border border-zinc-500/30",
};

const STATUS_LABELS: Record<string, string> = {
  AVAILABLE: "Available",
  RENTED: "Rented",
  UNAVAILABLE: "Unavailable",
};

function formatPrice(price: number): string {
  if (price >= 1000) {
    return `৳${(price / 1000).toFixed(price % 1000 === 0 ? 0 : 1)}k`;
  }
  return `৳${price.toLocaleString()}`;
}

export default function PropertyDetailHero({ property }: PropertyDetailHeroProps) {
  const router = useRouter();
  const { title, images, status, category, monthlyRent } = property;

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const hasImages = images && images.length > 0;
  const displayImages = hasImages ? images : [];
  const primaryImage = displayImages[activeIndex] ?? null;

  function openLightbox(index: number) {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }

  function closeLightbox() {
    setLightboxOpen(false);
  }

  function lightboxPrev() {
    setLightboxIndex((i) => (i - 1 + displayImages.length) % displayImages.length);
  }

  function lightboxNext() {
    setLightboxIndex((i) => (i + 1) % displayImages.length);
  }

  return (
    <>
      {/* Back Navigation */}
      <div className="mb-5">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground rounded-xl -ml-2"
          onClick={() => router.push("/properties")}
        >
          <ArrowLeft className="size-4" />
          Back to Listings
        </Button>
      </div>

      {/* Hero Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-3">
        {/* Main Image */}
        <div
          className="relative rounded-2xl overflow-hidden bg-muted cursor-zoom-in group aspect-video lg:aspect-auto lg:min-h-[480px]"
          onClick={() => hasImages && openLightbox(activeIndex)}
        >
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              sizes="(max-width: 1024px) 100vw, 70vw"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-muted">
              <Building2 className="size-16 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No images available</p>
            </div>
          )}

          {/* Gradient overlay */}
          {primaryImage && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          )}

          {/* Badges */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span
              className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide backdrop-blur-sm ${STATUS_STYLES[status] ?? STATUS_STYLES.UNAVAILABLE}`}
            >
              {STATUS_LABELS[status] ?? status}
            </span>
            {category && (
              <span className="flex items-center gap-1 bg-primary/80 backdrop-blur-sm text-primary-foreground text-[11px] font-semibold px-2.5 py-1 rounded-full">
                <Tag className="size-3" />
                {category.name}
              </span>
            )}
          </div>

          {/* Price overlay */}
          {primaryImage && (
            <div className="absolute bottom-4 left-4">
              <p className="text-white text-3xl font-bold drop-shadow">
                {formatPrice(monthlyRent)}
              </p>
              <p className="text-white/70 text-xs mt-0.5">per month</p>
            </div>
          )}

          {/* Photo count badge */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white text-[11px] font-medium px-3 py-1.5 rounded-full border border-white/20">
              <Images className="size-3.5" />
              {displayImages.length} Photos
            </div>
          )}
        </div>

        {/* Thumbnail Strip */}
        {displayImages.length > 1 && (
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2.5 lg:max-h-[480px] lg:overflow-y-auto lg:pr-1">
            {displayImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`relative rounded-xl overflow-hidden aspect-[4/3] flex-shrink-0 transition-all duration-200 ring-2 ${
                  idx === activeIndex
                    ? "ring-primary shadow-md shadow-primary/20"
                    : "ring-transparent hover:ring-primary/40 opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={img}
                  alt={`${title} photo ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="160px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 size-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            onClick={closeLightbox}
            aria-label="Close"
          >
            <X className="size-5" />
          </button>

          <button
            className="absolute left-4 size-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              lightboxPrev();
            }}
            aria-label="Previous"
          >
            <ChevronLeft className="size-5" />
          </button>

          <div
            className="relative w-[90vw] max-w-5xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={displayImages[lightboxIndex]!}
              alt={`${title} ${lightboxIndex + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>

          <button
            className="absolute right-4 size-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              lightboxNext();
            }}
            aria-label="Next"
          >
            <ChevronRight className="size-5" />
          </button>

          {/* Counter */}
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {lightboxIndex + 1} / {displayImages.length}
          </p>
        </div>
      )}
    </>
  );
}
