export default function PropertyCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl overflow-hidden bg-card border border-border/60 shadow-sm animate-pulse">
      {/* Image skeleton */}
      <div className="h-52 w-full bg-muted" />

      {/* Body skeleton */}
      <div className="flex flex-col gap-3 p-4">
        {/* Title */}
        <div className="space-y-1.5">
          <div className="h-3.5 bg-muted rounded-md w-4/5" />
          <div className="h-3 bg-muted rounded-md w-3/5" />
        </div>
        {/* Location */}
        <div className="h-3 bg-muted rounded-md w-2/3" />
        {/* Stats */}
        <div className="flex gap-3 border-t border-border/50 pt-2.5">
          <div className="h-3 bg-muted rounded-md w-14" />
          <div className="h-3 bg-muted rounded-md w-14" />
          <div className="h-3 bg-muted rounded-md w-16 ml-auto" />
        </div>
        {/* Amenities */}
        <div className="flex gap-1.5">
          <div className="h-5 bg-muted rounded-full w-14" />
          <div className="h-5 bg-muted rounded-full w-10" />
          <div className="h-5 bg-muted rounded-full w-16" />
        </div>
        {/* Landlord */}
        <div className="flex items-center gap-2 border-t border-border/50 pt-2.5">
          <div className="size-7 rounded-full bg-muted flex-shrink-0" />
          <div className="space-y-1">
            <div className="h-2.5 bg-muted rounded-md w-12" />
            <div className="h-3 bg-muted rounded-md w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}
