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
    let errorMsg = `GET ${endpoint} failed with status ${res.status}`;
    try {
      const errorData = await res.json();
      if (errorData?.message) {
        if (errorData.errorSources && Array.isArray(errorData.errorSources)) {
          errorMsg = errorData.errorSources.map((e: any) => e.message).join(", ");
        } else {
          errorMsg = errorData.message;
        }
      }
    } catch (e) {
      // Ignore JSON parse error and use default message
    }
    throw new Error(errorMsg);
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
    let errorMsg = `POST ${endpoint} failed with status ${res.status}`;
    try {
      const errorData = await res.json();
      if (errorData?.message) {
        if (errorData.errorSources && Array.isArray(errorData.errorSources)) {
          errorMsg = errorData.errorSources.map((e: any) => e.message).join(", ");
        } else {
          errorMsg = errorData.message;
        }
      }
    } catch (e) {
      // Ignore JSON parse error and use default message
    }
    throw new Error(errorMsg);
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
    let errorMsg = `PATCH ${endpoint} failed with status ${res.status}`;
    try {
      const errorData = await res.json();
      if (errorData?.message) {
        if (errorData.errorSources && Array.isArray(errorData.errorSources)) {
          errorMsg = errorData.errorSources.map((e: any) => e.message).join(", ");
        } else {
          errorMsg = errorData.message;
        }
      }
    } catch (e) {
      // Ignore JSON parse error and use default message
    }
    throw new Error(errorMsg);
  }

  return res.json() as Promise<ApiResponse<TData>>;
}

