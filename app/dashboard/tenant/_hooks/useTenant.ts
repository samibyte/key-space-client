"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTenantRentals,
  getTenantRentalById,
  createRentalRequest,
  createReview,
} from "@/services/rental.service";
import {
  createPayment,
  confirmPayment,
  getMyPayments,
  getPaymentById,
} from "@/services/payment.service";
import type { RentalFilters } from "@/types/rental.type";

//QUERIES 

export function useTenantRentals(filters: RentalFilters = {}) {
  return useQuery({
    queryKey: ["tenant", "rentals", filters],
    queryFn: async () => {
      const res = await getTenantRentals(filters);
      if (!res.success) {
        throw new Error(res.message);
      }
      return res;
    },
    staleTime: 30 * 1000,
  });
}

export function useTenantRentalById(id: string) {
  return useQuery({
    queryKey: ["tenant", "rental", id],
    queryFn: async () => {
      const res = await getTenantRentalById(id);
      if (!res.success) {
        throw new Error(res.message);
      }
      return res;
    },
    enabled: !!id,
    staleTime: 30 * 1000,
  });
}

export function useMyPayments(page = 1) {
  return useQuery({
    queryKey: ["tenant", "payments", page],
    queryFn: async () => {
      const res = await getMyPayments(page);
      if (!res.success) {
        throw new Error(res.message);
      }
      return res;
    },
    staleTime: 30 * 1000,
  });
}

export function usePaymentById(id: string) {
  return useQuery({
    queryKey: ["tenant", "payment", id],
    queryFn: async () => {
      const res = await getPaymentById(id);
      if (!res.success) {
        throw new Error(res.message);
      }
      return res;
    },
    enabled: !!id,
    staleTime: 30 * 1000,
  });
}

//  MUTATIONS

export function useCreateRentalRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      propertyId: string;
      moveInDate: string;
      durationMonths: number;
      message?: string;
    }) => {
      const res = await createRentalRequest(data);
      if (!res.success) {
        throw new Error(res.message);
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenant", "rentals"] });
    },
  });
}

export function useCreatePayment() {
  return useMutation({
    mutationFn: async (rentalRequestId: string) => {
      const res = await createPayment(rentalRequestId);
      if (!res.success) {
        throw new Error(res.message);
      }
      return res;
    },
  });
}

export function useConfirmPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (sessionId: string) => {
      const res = await confirmPayment(sessionId);
      if (!res.success) {
        throw new Error(res.message);
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenant", "rentals"] });
      queryClient.invalidateQueries({ queryKey: ["tenant", "payments"] });
    },
  });
}

export function useSubmitReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { propertyId: string; rating: number; comment: string }) => {
      const res = await createReview(data);
      if (!res.success) {
        throw new Error(res.message);
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenant", "rentals"] });
    },
  });
}
