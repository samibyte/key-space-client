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
