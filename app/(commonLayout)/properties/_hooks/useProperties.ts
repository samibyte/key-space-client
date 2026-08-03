"use client";

import { useQuery } from "@tanstack/react-query";
import { getProperties, getCategories } from "@/services/property.service";
import type { PropertyFilters } from "@/types/property.type";

export function useProperties(filters: PropertyFilters = {}) {
  return useQuery({
    queryKey: ["properties", filters],
    queryFn: () => getProperties(filters),
    staleTime: 30 * 1000,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
    staleTime: 5 * 60 * 1000,
  });
}
