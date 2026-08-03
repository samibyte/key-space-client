import { Skeleton } from "@/components/ui/skeleton";

export default function PropertyDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      {/* Back button */}
      <Skeleton className="h-9 w-40 rounded-xl mb-5" />

      {/* Hero gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-3 mb-10">
        <Skeleton className="w-full aspect-video lg:aspect-auto lg:min-h-[480px] rounded-2xl" />
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-2.5">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
          ))}
        </div>
      </div>

      {/* Title */}
      <Skeleton className="h-9 w-3/4 rounded-lg mb-2" />
      <Skeleton className="h-5 w-1/3 rounded-lg mb-10" />

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">
        {/* Left */}
        <div className="flex flex-col gap-8">
          {/* Description */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-48 rounded-lg mb-1" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-5/6 rounded" />
            <Skeleton className="h-4 w-4/6 rounded" />
          </div>
          {/* Facts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
          {/* Amenities */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-12 rounded-xl" />
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-4">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
