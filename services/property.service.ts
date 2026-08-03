"use server";

import { httpClient } from "@/lib/axios/httpClient";
import type { ApiResponse, PaginationMeta } from "@/types/api.type";
import type { Category, Property, PropertyDetail, PropertyFilters, Region } from "@/types/property.type";

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

export async function getPropertyById(id: string): Promise<ApiResponse<PropertyDetail>> {
  return httpClient.get<PropertyDetail>(`/properties/${id}`);
}

export async function getCategories(): Promise<ApiResponse<Category[]>> {
  return httpClient.get<Category[]>("/categories");
}

export async function getRegions(): Promise<ApiResponse<Region[]>> {
  return httpClient.get<Region[]>("/regions");
}

export async function getAmenities(): Promise<ApiResponse<string[]>> {
  return httpClient.get<string[]>("/properties/amenities");
}


export interface PublicStats {
  totalProperties: number;
  activeLeases: number;
  totalTenants: number;
  totalLandlords: number;
}

export async function getPublicStats(): Promise<ApiResponse<PublicStats>> {
  return httpClient.get<PublicStats>("/properties/public/stats");
}

