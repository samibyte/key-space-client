import DashboardShell from "../../../../_components/DashboardShell";
import PropertyForm from "../../_components/PropertyForm";
import { getCategories } from "@/services/property.service";
import { getPropertyById } from "@/services/landlord.service";
import { QueryClient, HydrationBoundary, dehydrate } from "@tanstack/react-query";

interface EditPropertyPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  const { id } = await params;
  const queryClient = new QueryClient();

  // Prefetch categories and fetch existing property data on the server
  const [, propertyRes] = await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["categories"],
      queryFn: getCategories,
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
