"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getLandlordDashboardStats,
  getMyProperties,
  updateProperty,
  deleteProperty,
  getLandlordRequests,
  updateRentalStatus,
} from "@/services/landlord.service";
import type { PropertyFilters } from "@/types/property.type";
import type { RentalFilters } from "@/types/rental.type";

// QUERIES
export function useLandlordStats() {
  return useQuery({
    queryKey: ["landlord", "stats"],
    queryFn: () => getLandlordDashboardStats(),
    staleTime: 60 * 1000,
  });
}

export function useMyProperties(filters: PropertyFilters = {}) {
  return useQuery({
    queryKey: ["landlord", "properties", filters],
    queryFn: () => getMyProperties(filters),
    staleTime: 30 * 1000,
  });
}

export function useLandlordRequests(filters: RentalFilters = {}) {
  return useQuery({
    queryKey: ["landlord", "requests", filters],
    queryFn: () => getLandlordRequests(filters),
    staleTime: 30 * 1000,
  });
}

//MUTATIONS

export function useDeleteProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProperty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["landlord", "properties"] });
      queryClient.invalidateQueries({ queryKey: ["landlord", "stats"] });
    },
  });
}

export function useUpdateRentalStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "APPROVED" | "REJECTED";
    }) => updateRentalStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["landlord", "requests"] });
      queryClient.invalidateQueries({ queryKey: ["landlord", "stats"] });
    },
  });
}

export function useUpdateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      updateProperty(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["landlord", "properties"] });
      queryClient.invalidateQueries({ queryKey: ["landlord", "stats"] });
    },
  });
}
