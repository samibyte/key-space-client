import dynamic from "next/dynamic";
import DashboardShell from "../../../../_components/DashboardShell";
import { getCategories, getRegions, getAmenities } from "@/services/property.service";
import { getPropertyById } from "@/services/landlord.service";
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
  () => import("../../_components/PropertyForm"),
  {
    loading: () => <PropertyFormSkeleton />,
  }
);

interface EditPropertyPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  const { id } = await params;
  const queryClient = new QueryClient();

  // Prefetch categories + regions + amenities and fetch existing property data on the server
  const [, , , propertyRes] = await Promise.all([
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
    getPropertyById(id).catch(() => null),
  ]);

  const property = propertyRes?.data ?? null;

  return (
    <DashboardShell
      title="Edit Property"
      description={`Update the details for: ${property?.title ?? `Property #${id}`}`}
      breadcrumbs={[
        { label: "Properties", href: "/dashboard/landlord/properties" },
        { label: "Edit Listing" }
      ]}
    >
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="max-w-4xl mx-auto w-full mt-4">
          <PropertyForm isEdit propertyId={id} initialData={property} />
        </div>
      </HydrationBoundary>
    </DashboardShell>
  );
}
