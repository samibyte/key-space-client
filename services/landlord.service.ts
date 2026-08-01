"use server";

import { httpClient } from "@/lib/axios/httpClient";
import type { ApiResponse } from "@/types/api.type";
import type { Property, PropertyFilters } from "@/types/property.type";
import type { RentalRequest, RentalFilters } from "@/types/rental.type";

export async function getLandlordDashboardStats(): Promise<ApiResponse<any>> {
  return httpClient.get("/landlord/stats");
}

export async function getMyProperties(
  filters: PropertyFilters = {}
): Promise<ApiResponse<Property[]>> {
  const params: Record<string, string> = {};
  const entries = Object.entries(filters) as [string, string | undefined][];
  for (const [key, value] of entries) {
    if (value !== undefined && value !== "" && value !== null) {
      params[key] = String(value);
    }
  }

  return httpClient.get("/landlord/properties", { params });
}

export async function createProperty(data: any): Promise<ApiResponse<Property>> {
  return httpClient.post("/landlord/properties", data);
}

export async function updateProperty(id: string, data: any): Promise<ApiResponse<Property>> {
  return httpClient.put(`/landlord/properties/${id}`, data);
}

export async function deleteProperty(id: string): Promise<ApiResponse<void>> {
  return httpClient.delete(`/landlord/properties/${id}`);
}

export async function getLandlordRequests(
  filters: RentalFilters = {}
): Promise<ApiResponse<RentalRequest[]>> {
  const params: Record<string, string> = {};
  const entries = Object.entries(filters) as [string, string | undefined][];
  for (const [key, value] of entries) {
    if (value !== undefined && value !== "" && value !== null) {
      params[key] = String(value);
    }
  }

  return httpClient.get("/landlord/requests", { params });
}

export async function updateRentalStatus(
  id: string,
  status: "APPROVED" | "REJECTED"
): Promise<ApiResponse<RentalRequest>> {
  return httpClient.patch(`/landlord/requests/${id}`, { status });
}
