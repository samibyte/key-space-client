"use client";

import DashboardShell from "../../_components/DashboardShell";
import StatusBadge from "@/components/shared/StatusBadge";
import StatusTabFilter from "@/components/shared/StatusTabFilter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Edit2,
  Trash2,
  MapPin,
  BedDouble,
  Bath,
  Ruler,
  ChevronDown,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  useMyProperties,
  useDeleteProperty,
  useUpdateProperty,
} from "../_hooks/useLandlord";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function LandlordPropertiesPage() {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);
  const TABS = ["ALL", "AVAILABLE", "RENTED", "UNAVAILABLE"];

  const { data: propertiesRes, isLoading } = useMyProperties({
    status: statusFilter === "ALL" ? undefined : statusFilter,
  });

  const deleteMutation = useDeleteProperty();
  const updateMutation = useUpdateProperty();

  const handleDelete = () => {
    if (propertyToDelete) {
      deleteMutation.mutate(propertyToDelete, {
        onSuccess: () => setPropertyToDelete(null),
      });
    }
  };

  const handleStatusUpdate = (id: string, newStatus: string) => {
    updateMutation.mutate({ id, data: { status: newStatus } });
  };

  const properties = propertiesRes?.data || [];

  return (
    <DashboardShell
      title="My Properties"
      description="Manage your listed properties and their availability."
      headerAction={
        <Link href="/dashboard/landlord/properties/new">
          <Button className="gap-2 rounded-xl">
            <Plus className="size-4" />
            Add Property
          </Button>
        </Link>
      }
    >
      <ConfirmDialog
        isOpen={!!propertyToDelete}
        title="Delete Property Listing"
        description="Are you sure you want to delete this property? This action is permanent and may reject all pending rental requests for this property."
        confirmText="Yes, delete property"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
        onCancel={() => setPropertyToDelete(null)}
      />

      <StatusTabFilter
        tabs={TABS}
        active={statusFilter}
        onChange={setStatusFilter}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 rounded-2xl border border-border/40 p-4"
            >
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-6 w-3/4 rounded-md" />
              <Skeleton className="h-4 w-1/2 rounded-md" />
              <div className="flex gap-2 justify-between mt-2">
                <Skeleton className="h-8 w-20 rounded-md" />
                <Skeleton className="h-8 w-16 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border/60 rounded-2xl bg-card/10">
          <p className="text-muted-foreground text-sm font-medium">
            No {statusFilter !== "ALL" ? statusFilter.toLowerCase() : ""}{" "}
            properties found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {properties.map((property) => {
            const hasUpdatePending =
              updateMutation.isPending &&
              updateMutation.variables?.id === property.id;
            const updatedStatus = hasUpdatePending
              ? (updateMutation.variables?.data as { status?: string })?.status
              : null;
            const currentStatus =
              updatedStatus || property.status || "UNAVAILABLE";

            const defaultImg =
              "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80";
            const coverImg =
              property.images && property.images.length > 0
                ? property.images[0]
                : defaultImg;

            return (
              <div
                key={property.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border/40 bg-card/60 backdrop-blur-xl transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-primary/20"
              >
                {/* Visual Thumbnail */}
                <div className="relative h-48 w-full overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverImg}
                    alt={property.title}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {property.category && (
                    <span className="absolute top-3 left-3 rounded-lg bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md border border-white/10">
                      {property.category.name}
                    </span>
                  )}
                </div>

                {/* Body Details */}
                <div className="flex flex-col flex-1 p-5 gap-4">
                  <div className="flex flex-col gap-1.5 min-w-0">
                    <h3 className="text-base font-bold text-foreground tracking-tight truncate group-hover:text-primary transition-colors">
                      {property.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="size-3.5 shrink-0 text-muted-foreground" />
                      <span className="truncate">
                        {property.address}, {property.city}
                      </span>
                    </div>
                  </div>

                  {/* Specification grid */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-border/30 text-xs font-semibold text-muted-foreground bg-muted/20 rounded-xl px-2">
                    <div className="flex items-center gap-1.5 justify-center">
                      <BedDouble className="size-4 text-muted-foreground/80" />
                      <span>
                        {property.bedrooms} Bed
                        {property.bedrooms > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 justify-center">
                      <Bath className="size-4 text-muted-foreground/80" />
                      <span>
                        {property.bathrooms} Bath
                        {property.bathrooms > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 justify-center">
                      <Ruler className="size-4 text-muted-foreground/80" />
                      <span>
                        {property.size ? `${property.size} sqft` : "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                        Monthly Rent
                      </span>
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-xl font-extrabold text-foreground">
                          ${property.monthlyRent.toLocaleString("en-US")}
                        </span>
                        <span className="text-xs text-muted-foreground font-semibold">
                          /mo
                        </span>
                      </div>
                    </div>

                    {/* Quick Status Action Changer */}
                    <div className="relative">
                      {hasUpdatePending ? (
                        <div className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-full border border-border bg-muted/60 text-muted-foreground">
                          <Loader2 className="size-3 animate-spin text-primary" />
                          <span>Updating...</span>
                        </div>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 rounded-full border border-border/40 bg-card hover:bg-muted py-1 pl-2.5 pr-2 gap-1"
                              >
                                <StatusBadge status={currentStatus} />
                                <ChevronDown className="size-3.5 text-muted-foreground" />
                              </Button>
                            }
                          />
                          <DropdownMenuContent
                            align="end"
                            className="w-40 rounded-xl"
                          >
                            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 py-1.5">
                              Change Status
                            </div>
                            <DropdownMenuSeparator className="-mx-1 my-1 h-px bg-border/40" />
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(property.id, "AVAILABLE")
                              }
                              className="rounded-lg py-2 cursor-pointer focus:bg-emerald-500/10 focus:text-emerald-600 dark:focus:bg-emerald-500/20"
                            >
                              Available
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(property.id, "RENTED")
                              }
                              className="rounded-lg py-2 cursor-pointer focus:bg-blue-500/10 focus:text-blue-600 dark:focus:bg-blue-500/20"
                            >
                              Rented
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(property.id, "UNAVAILABLE")
                              }
                              className="rounded-lg py-2 cursor-pointer focus:bg-rose-500/10 focus:text-rose-600 dark:focus:bg-rose-500/20"
                            >
                              Unavailable
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="flex border-t border-border/40 bg-muted/30 px-5 py-3 items-center justify-between mt-auto">
                  <span className="text-[10px] text-muted-foreground font-semibold">
                    Added: {new Date(property.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/landlord/properties/${property.id}/edit`}
                    >
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="rounded-lg hover:bg-muted/80"
                      >
                        <Edit2 className="size-4 text-muted-foreground hover:text-foreground" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="rounded-lg hover:bg-rose-500/10"
                      onClick={() => setPropertyToDelete(property.id)}
                    >
                      <Trash2 className="size-4 text-rose-500" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}
