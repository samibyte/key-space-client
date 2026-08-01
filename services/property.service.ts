"use server";

import { httpClient } from "@/lib/axios/httpClient";
import type { ApiResponse, PaginationMeta } from "@/types/api.type";
import type { Category, Property, PropertyFilters } from "@/types/property.type";

export interface PropertiesResult {
  properties: Property[];
  meta: PaginationMeta;
}

export async function getProperties(
  filters: PropertyFilters = {},
): Promise<ApiResponse<Property[]>> {
  // Build clean params — skip undefined/empty values
  const params: Record<string, string> = {};

  const entries = Object.entries(filters) as [string, string | undefined][];
  for (const [key, value] of entries) {
    if (value !== undefined && value !== "" && value !== null) {
      params[key] = String(value);
    }
  }

  return httpClient.get<Property[]>("/properties", { params });
}

export async function getCategories(): Promise<ApiResponse<Category[]>> {
  return httpClient.get<Category[]>("/categories");
}
