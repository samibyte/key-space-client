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
    queryFn: () => getTenantRentals(filters),
    staleTime: 30 * 1000,
  });
}

export function useTenantRentalById(id: string) {
  return useQuery({
    queryKey: ["tenant", "rental", id],
    queryFn: () => getTenantRentalById(id),
    enabled: !!id,
    staleTime: 30 * 1000,
  });
}

export function useMyPayments(page = 1) {
  return useQuery({
    queryKey: ["tenant", "payments", page],
    queryFn: () => getMyPayments(page),
    staleTime: 30 * 1000,
  });
}

export function usePaymentById(id: string) {
  return useQuery({
    queryKey: ["tenant", "payment", id],
    queryFn: () => getPaymentById(id),
    enabled: !!id,
    staleTime: 30 * 1000,
  });
}

//  MUTATIONS

export function useCreateRentalRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      propertyId: string;
      moveInDate: string;
      durationMonths: number;
      message?: string;
    }) => createRentalRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenant", "rentals"] });
    },
  });
}

export function useCreatePayment() {
  return useMutation({
    mutationFn: (rentalRequestId: string) => createPayment(rentalRequestId),
  });
}

export function useConfirmPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => confirmPayment(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenant", "rentals"] });
      queryClient.invalidateQueries({ queryKey: ["tenant", "payments"] });
    },
  });
}

export function useSubmitReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { propertyId: string; rating: number; comment: string }) =>
      createReview(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenant", "rentals"] });
    },
  });
}
