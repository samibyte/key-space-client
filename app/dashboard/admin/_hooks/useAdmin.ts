"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminDashboardStats,
  getAllUsers,
  updateUserStatus,
  getAllAdminProperties,
  deletePropertyListing,
  getAllAdminRentals,
} from "@/services/admin.service";
import type { UserFilters, UserStatus } from "@/types/user.type";

// ─── QUERIES

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => getAdminDashboardStats(),
    staleTime: 60 * 1000,
  });
}

export function useAdminUsers(filters: UserFilters & { page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: ["admin", "users", filters],
    queryFn: () => getAllUsers(filters),
    staleTime: 30 * 1000,
  });
}

export function useAdminProperties(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["admin", "properties", page, limit],
    queryFn: () => getAllAdminProperties(page, limit),
    staleTime: 30 * 1000,
  });
}

export function useAdminRentals(status?: string, page = 1, limit = 10) {
  return useQuery({
    queryKey: ["admin", "rentals", status, page, limit],
    queryFn: () => getAllAdminRentals(status, page, limit),
    staleTime: 30 * 1000,
  });
}

// ─── MUTATIONS

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: UserStatus }) =>
      updateUserStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
}

export function useDeleteAdminProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePropertyListing(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "properties"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
}
