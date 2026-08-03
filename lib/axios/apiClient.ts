/**
 * Browser-safe API client using plain fetch.
 * Does NOT import next/headers — safe for use in client components and useQuery.
 */
import type { ApiResponse } from "@/types/api.type";

export async function clientGet<TData>(
  endpoint: string,
  params?: Record<string, string>,
): Promise<ApiResponse<TData>> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");

  const url = new URL(`${base}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const res = await fetch(url.toString(), {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`GET ${endpoint} failed with status ${res.status}`);
  }

  return res.json() as Promise<ApiResponse<TData>>;
}

export async function clientPost<TData>(
  endpoint: string,
  body: unknown,
): Promise<ApiResponse<TData>> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");

  const headers: Record<string, string> = {};
  let requestBody: any = body;

  if (!(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    requestBody = JSON.stringify(body);
  }

  const res = await fetch(`${base}${endpoint}`, {
    method: "POST",
    headers,
    body: requestBody,
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`POST ${endpoint} failed with status ${res.status}`);
  }

  return res.json() as Promise<ApiResponse<TData>>;
}

export async function clientPatch<TData>(
  endpoint: string,
  body: unknown,
): Promise<ApiResponse<TData>> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");

  const headers: Record<string, string> = {};
  let requestBody: any = body;

  if (!(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    requestBody = JSON.stringify(body);
  }

  const res = await fetch(`${base}${endpoint}`, {
    method: "PATCH",
    headers,
    body: requestBody,
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`PATCH ${endpoint} failed with status ${res.status}`);
  }

  return res.json() as Promise<ApiResponse<TData>>;
}

