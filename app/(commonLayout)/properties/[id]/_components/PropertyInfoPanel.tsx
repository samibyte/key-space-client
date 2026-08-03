"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  BedDouble,
  Bath,
  Maximize2,
  ShieldCheck,
  Share2,
  Home,
} from "lucide-react";
import type { PropertyDetail } from "@/types/property.type";

interface PropertyInfoPanelProps {
  property: PropertyDetail;
}

function formatPrice(price: number): string {
  return `৳${price.toLocaleString("en-BD")}`;
}

export default function PropertyInfoPanel({ property }: PropertyInfoPanelProps) {
  const router = useRouter();
  const {
    id,
    monthlyRent,
    securityDeposit,
    bedrooms,
    bathrooms,
    size,
    status,
    reviews,
  } = property;

  const isAvailable = status === "AVAILABLE";

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null;

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  }

  return (
    <div className="sticky top-24 flex flex-col gap-4">
      {/* Price Card */}
      <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
        {/* Header accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-primary via-primary/70 to-primary/30" />

        <div className="p-5 flex flex-col gap-5">
          {/* Price */}
          <div>
            <p className="text-3xl font-bold text-foreground tracking-tight">
              {formatPrice(monthlyRent)}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">per month</p>
          </div>

          {/* Security Deposit */}
          {securityDeposit && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/60 border border-border/40">
              <ShieldCheck className="size-4 text-primary/70 flex-shrink-0" />
              <div>
                <p className="text-[11px] text-muted-foreground">Security Deposit</p>
                <p className="text-sm font-semibold text-foreground">
                  {formatPrice(securityDeposit)}
                </p>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted/50 border border-border/30">
              <BedDouble className="size-4 text-primary/80" />
              <span className="text-base font-bold text-foreground">{bedrooms}</span>
              <span className="text-[10px] text-muted-foreground">Beds</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted/50 border border-border/30">
              <Bath className="size-4 text-primary/80" />
              <span className="text-base font-bold text-foreground">{bathrooms}</span>
              <span className="text-[10px] text-muted-foreground">Baths</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted/50 border border-border/30">
              <Maximize2 className="size-4 text-primary/80" />
              <span className="text-base font-bold text-foreground">
                {size ?? "—"}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {size ? "sqft" : "Size"}
              </span>
            </div>
          </div>

          {/* Rating preview */}
          {avgRating !== null && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`size-3.5 ${
                      star <= Math.round(avgRating)
                        ? "text-amber-400"
                        : "text-muted-foreground/30"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-medium text-foreground">
                {avgRating.toFixed(1)}
              </span>
              <span className="text-[11px] text-muted-foreground">
                ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
              </span>
            </div>
          )}

          {/* CTA */}
          {isAvailable ? (
            <Button
              className="w-full h-11 rounded-xl font-semibold text-sm gap-2 shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/30 transition-all duration-200"
              onClick={() =>
                router.push(`/dashboard/tenant/rentals/new?propertyId=${id}`)
              }
            >
              <Home className="size-4" />
              Request Rental
            </Button>
          ) : (
            <Button
              className="w-full h-11 rounded-xl font-semibold text-sm"
              variant="outline"
              disabled
            >
              {status === "RENTED" ? "Currently Rented" : "Not Available"}
            </Button>
          )}

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
          >
            <Share2 className="size-3.5" />
            Share this property
          </button>
        </div>
      </div>
    </div>
  );
}
