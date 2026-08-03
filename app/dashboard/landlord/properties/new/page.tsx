import DashboardShell from "../../../_components/DashboardShell";
import PropertyForm from "../_components/PropertyForm";
import { getCategories, getRegions } from "@/services/property.service";
import { QueryClient, HydrationBoundary, dehydrate } from "@tanstack/react-query";

export default async function NewPropertyPage() {
  const queryClient = new QueryClient();

  // Prefetch categories and regions on the server so the client gets them instantly
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["categories"],
      queryFn: getCategories,
    }),
    queryClient.prefetchQuery({
      queryKey: ["regions"],
      queryFn: getRegions,
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
