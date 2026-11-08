import dynamic from "next/dynamic";
import DashboardShell from "../../../_components/DashboardShell";
import { getCategories, getRegions, getAmenities } from "@/services/property.service";
import { QueryClient, HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

function PropertyFormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse max-w-4xl mx-auto">
      <Skeleton className="h-14 w-full rounded-2xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-12 rounded-xl" />
        <Skeleton className="h-12 rounded-xl" />
      </div>
      <Skeleton className="h-44 w-full rounded-2xl" />
      <div className="flex justify-end gap-3">
        <Skeleton className="h-10 w-28 rounded-xl" />
      </div>
    </div>
  );
}

const PropertyForm = dynamic(
  () => import("../_components/PropertyForm"),
  {
    loading: () => <PropertyFormSkeleton />,
  }
);

export default async function NewPropertyPage() {
  const queryClient = new QueryClient();

  // Prefetch categories, regions and amenities on the server so the client gets them instantly
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["categories"],
      queryFn: getCategories,
    }),
    queryClient.prefetchQuery({
      queryKey: ["regions"],
      queryFn: getRegions,
    }),
    queryClient.prefetchQuery({
      queryKey: ["amenities"],
      queryFn: getAmenities,
    }),
  ]);

  return (
    <DashboardShell
      title="Create New Listing"
      description="Add a new property to your portfolio. Fill in the details to attract the best tenants."
      breadcrumbs={[
        { label: "Properties", href: "/dashboard/landlord/properties" },
        { label: "New Listing" }
      ]}
    >
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="max-w-4xl mx-auto w-full mt-4">
          <PropertyForm />
        </div>
      </HydrationBoundary>
    </DashboardShell>
  );
}
