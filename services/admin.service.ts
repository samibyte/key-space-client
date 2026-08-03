"use server";

import { httpClient } from "@/lib/axios/httpClient";
import type { ApiResponse } from "@/types/api.type";
import type { User, UserFilters, UserStatus } from "@/types/user.type";
import type { Property } from "@/types/property.type";
import type { RentalRequest } from "@/types/rental.type";

export interface AdminStats {
  users: {
    total: number;
    breakdown: {
      LANDLORD: number;
      TENANT: number;
      ADMIN: number;
    };
  };
  properties: {
    total: number;
  };
  rentals: {
    total: number;
  };
  revenue: {
    totalAmount: number;
  };
}

export async function getAdminDashboardStats(): Promise<
  ApiResponse<AdminStats>
> {
  return httpClient.get("/admin/stats");
}

export async function getAllUsers(
  filters: UserFilters & { page?: number; limit?: number } = {},
): Promise<ApiResponse<User[]>> {
  const params: Record<string, string> = {};
  const entries = Object.entries(filters) as [string, string | undefined][];
  for (const [key, value] of entries) {
    if (value !== undefined && value !== "" && value !== null) {
      params[key] = String(value);
    }
  }

  return httpClient.get("/admin/users", { params });
}

export async function updateUserStatus(
  id: string,
  status: UserStatus,
): Promise<ApiResponse<User>> {
  return httpClient.patch(`/admin/users/${id}/status`, { status });
}

export async function getAllAdminProperties(
  page = 1,
  limit = 10,
): Promise<ApiResponse<Property[]>> {
  return httpClient.get("/admin/properties", { params: { page, limit } });
}

export async function deletePropertyListing(
  id: string,
): Promise<ApiResponse<void>> {
  return httpClient.delete(`/admin/properties/${id}`);
}

export async function getAllAdminRentals(
  status?: string,
  page = 1,
  limit = 10,
): Promise<ApiResponse<RentalRequest[]>> {
  const params: Record<string, string> = {
    page: String(page),
    limit: String(limit),
  };
  if (status && status !== "ALL") {
    params.status = status;
  }
  return httpClient.get("/admin/rentals", { params });
}
