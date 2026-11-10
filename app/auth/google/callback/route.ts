import { NextRequest, NextResponse } from "next/server";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { jwtDecode } from "jwt-decode";
import { getDefaultDashboardRoute, UserRole } from "@/lib/authUtils";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * Redirect responses from the OAuth callback must never be cached or leak the
 * callback URL (which may contain credentials) through the Referer header.
 */
function secureRedirect(url: URL) {
  const response = NextResponse.redirect(url, 303);
  response.headers.set("Cache-Control", "no-store, max-age=0");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}

function invalidAuthRedirect(request: NextRequest) {
  return secureRedirect(
    new URL("/auth/login?error=Invalid_Google_Auth", request.url),
  );
}

/**
 * Exchange the short-lived, single-use authorization code for tokens. The
 * backend never puts access/refresh tokens in the browser URL.
 */
async function exchangeAuthorizationCode(
  code: string,
): Promise<TokenPair | null> {
  if (!BASE_API_URL) return null;

  try {
    const res = await fetch(`${BASE_API_URL}/auth/google/exchange`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
      cache: "no-store",
    });

    if (!res.ok) return null;

    const payload = await res.json();
    const data = payload?.data ?? payload;

    if (
      typeof data?.accessToken !== "string" ||
      typeof data?.refreshToken !== "string"
    ) {
      return null;
    }

    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return invalidAuthRedirect(request);
  }

  const tokens = await exchangeAuthorizationCode(code);

  if (!tokens) {
    return invalidAuthRedirect(request);
  }

  await setTokenInCookies("accessToken", tokens.accessToken);
  await setTokenInCookies("refreshToken", tokens.refreshToken);

  try {
    // Decode access token to get user role for dashboard routing
    const decoded = jwtDecode<{ role: UserRole }>(tokens.accessToken);
    const role = decoded.role;
    const targetPath =
      role === "ADMIN" || role === "LANDLORD" || role === "TENANT"
        ? getDefaultDashboardRoute(role)
        : "/dashboard/tenant";

    return secureRedirect(new URL(targetPath, request.url));
  } catch {
    return secureRedirect(new URL("/dashboard/tenant", request.url));
  }
}
