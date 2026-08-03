import Image from "next/image";
import { MessageSquare, Star } from "lucide-react";
import type { Review } from "@/types/property.type";

interface ReviewsSectionProps {
  reviews: Review[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`size-3.5 ${star <= rating ? "text-amber-400" : "text-muted-foreground/25"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const hasReviews = reviews.length > 0;
  const avgRating = hasReviews
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : null;

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-xl font-bold text-foreground">Reviews</h2>
        {hasReviews && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
            {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
          </span>
        )}
      </div>

      {!hasReviews ? (
        <div className="rounded-2xl border border-border/40 bg-muted/30 py-12 flex flex-col items-center gap-3">
          <div className="size-12 rounded-full bg-muted flex items-center justify-center">
            <MessageSquare className="size-5 text-muted-foreground/40" />
          </div>
          <p className="font-medium text-foreground">No reviews yet</p>
          <p className="text-sm text-muted-foreground text-center max-w-xs">
            Be the first to review this property after renting it.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {/* Summary Bar */}
          <div className="rounded-2xl border border-border/50 bg-card p-5 flex flex-col sm:flex-row gap-5">
            {/* Average Score */}
            <div className="flex flex-col items-center justify-center gap-1.5 sm:pr-5 sm:border-r border-border/40">
              <p className="text-4xl font-bold text-foreground">
                {avgRating!.toFixed(1)}
              </p>
              <StarRating rating={Math.round(avgRating!)} />
              <p className="text-xs text-muted-foreground">
                out of 5 · {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
              </p>
            </div>

            {/* Rating Breakdown */}
            <div className="flex-1 flex flex-col justify-center gap-2">
              {ratingCounts.map(({ star, count }) => {
                const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2.5">
                    <div className="flex items-center gap-1 w-10 flex-shrink-0 justify-end">
                      <span className="text-xs text-muted-foreground">{star}</span>
                      <Star className="size-3 text-amber-400 fill-amber-400" />
                    </div>
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-amber-400 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-6 flex-shrink-0">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Review List */}
          <div className="flex flex-col gap-3">
            {reviews.map((review) => {
              const initials = review.tenant.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();

              return (
                <div
                  key={review.id}
                  className="rounded-2xl border border-border/40 bg-card p-4 flex flex-col gap-3 hover:border-primary/20 transition-colors duration-200"
                >
                  {/* Reviewer info */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-full overflow-hidden bg-primary/10 flex-shrink-0 flex items-center justify-center ring-1 ring-primary/20">
                        {review.tenant.avatar ? (
                          <Image
                            src={review.tenant.avatar}
                            alt={review.tenant.name}
                            width={36}
                            height={36}
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-primary text-[10px] font-bold">
                            {initials}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {review.tenant.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {formatDate(review.createdAt)}
                        </p>
                      </div>
                    </div>
                    <StarRating rating={review.rating} />
                  </div>

                  {/* Comment */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
