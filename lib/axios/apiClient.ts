/**
 * Browser-safe API client using plain fetch.
 * Does NOT import next/headers — safe for use in client components and useQuery.
 */
import type { ApiResponse } from "@/types/api.type";

interface ApiErrorSource {
  message?: string;
}

interface ApiErrorData {
  message?: string;
  errorSources?: ApiErrorSource[];
}

async function extractErrorMessage(
  res: Response,
  fallback: string,
): Promise<string> {
  try {
    const errorData = (await res.json()) as ApiErrorData;
    if (errorData?.message) {
      if (Array.isArray(errorData.errorSources)) {
        const details = errorData.errorSources
          .map((source) => source.message)
          .filter(Boolean)
          .join(", ");
        if (details) return details;
      }
      return errorData.message;
    }
  } catch {
    // Ignore JSON parse error and use default message
  }
  return fallback;
}

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
    throw new Error(
      await extractErrorMessage(
        res,
        `GET ${endpoint} failed with status ${res.status}`,
      ),
    );
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
  const requestBody = body instanceof FormData ? body : JSON.stringify(body);

  if (!(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${base}${endpoint}`, {
    method: "POST",
    headers,
    body: requestBody,
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(
      await extractErrorMessage(
        res,
        `POST ${endpoint} failed with status ${res.status}`,
      ),
    );
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
  const requestBody = body instanceof FormData ? body : JSON.stringify(body);

  if (!(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${base}${endpoint}`, {
    method: "PATCH",
    headers,
    body: requestBody,
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(
      await extractErrorMessage(
        res,
        `PATCH ${endpoint} failed with status ${res.status}`,
      ),
    );
  }

  return res.json() as Promise<ApiResponse<TData>>;
}
