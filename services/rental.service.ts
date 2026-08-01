"use server";

import { httpClient } from "@/lib/axios/httpClient";
import type { ApiResponse } from "@/types/api.type";
import type { RentalRequest, RentalFilters, Payment, Review } from "@/types/rental.type";

//RENTALS

export async function createRentalRequest(data: any): Promise<ApiResponse<RentalRequest>> {
  return httpClient.post("/rentals", data);
}

export async function getTenantRentals(
  filters: RentalFilters = {}
): Promise<ApiResponse<RentalRequest[]>> {
  const params: Record<string, string> = {};
  const entries = Object.entries(filters) as [string, string | undefined][];
  for (const [key, value] of entries) {
    if (value !== undefined && value !== "" && value !== null) {
      params[key] = String(value);
    }
  }

  return httpClient.get("/rentals", { params });
}

export async function getTenantRentalById(id: string): Promise<ApiResponse<RentalRequest>> {
  return httpClient.get(`/rentals/${id}`);
}

// REVIEWS

export async function createReview(data: any): Promise<ApiResponse<Review>> {
  return httpClient.post("/reviews", data);
}

export async function getPropertyReviews(propertyId: string): Promise<ApiResponse<Review[]>> {
  return httpClient.get(`/reviews/property/${propertyId}`);
}
