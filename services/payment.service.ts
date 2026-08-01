"use server";

import { httpClient } from "@/lib/axios/httpClient";
import type { ApiResponse } from "@/types/api.type";
import type { Payment } from "@/types/rental.type";

export async function createPayment(rentalRequestId: string): Promise<ApiResponse<{ checkoutUrl: string }>> {
  return httpClient.post("/payments/create", { rentalRequestId });
}

export async function confirmPayment(sessionId: string): Promise<ApiResponse<Payment>> {
  return httpClient.post("/payments/confirm", { sessionId });
}

export async function getMyPayments(page = 1, limit = 10): Promise<ApiResponse<Payment[]>> {
  return httpClient.get("/payments", { params: { page, limit } });
}

export async function getPaymentById(id: string): Promise<ApiResponse<Payment>> {
  return httpClient.get(`/payments/${id}`);
}
