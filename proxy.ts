import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  isAuthRoute,
  getRouteOwner,
  getDefaultDashboardRoute,
  UserRole,
} from "./lib/authUtils";

function decodeJwt(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payloadBase64 = parts[1];
    // Next.js Edge doesn't have Buffer, use atob safely
    const payloadStr = atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(payloadStr);
  } catch (e) {
    return null;
  }
}

function isTokenExpiringSoonEdge(token: string, thresholdInSeconds = 300): boolean {
  const payload = decodeJwt(token);
  if (!payload || !payload.exp) return true; // Treat invalid/missing exp as expiring
  const remainingSeconds = payload.exp - Math.floor(Date.now() / 1000);
  return remainingSeconds <= thresholdInSeconds;
}

// Helper to refresh tokens via Edge-friendly fetch
async function refreshTokenMiddleware(refreshToken: string) {
  try {
    // Note: We use fetch directly here instead of auth.service.ts
    // to strictly avoid importing node-only limits into the edge.
    const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!BASE_API_URL) return null;

    const res = await fetch(`${BASE_API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refreshToken=${refreshToken}`,
      },
    });

    if (!res.ok) return null;
    const { data } = await res.json();
    return data; // { accessToken, refreshToken, token }
  } catch (error) {
    console.error("Error refreshing token in middleware:", error);
    return null;
  }
}

export async function proxy(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    const pathWithQuery = `${pathname}${request.nextUrl.search}`;
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    const decodedAccessToken = accessToken ? decodeJwt(accessToken) : null;
    let isValidAccessToken = false;
    
    if (decodedAccessToken?.exp) {
      const remaining = decodedAccessToken.exp - Math.floor(Date.now() / 1000);
      isValidAccessToken = remaining > 0;
    }

    let userRole: UserRole | null = null;
    if (decodedAccessToken) {
      userRole = decodedAccessToken.role as UserRole;
    }

    const routeOwner = getRouteOwner(pathname);
    const isAuth = isAuthRoute(pathname);

    // Proactively refresh token if access token is valid but about to expire, and refresh token exists
    if (isValidAccessToken && refreshToken && isTokenExpiringSoonEdge(accessToken!)) {
      const requestHeaders = new Headers(request.headers);
      const response = NextResponse.next({ request: { headers: requestHeaders } });

      const newTokens = await refreshTokenMiddleware(refreshToken);

      if (newTokens) {
        requestHeaders.set("x-token-refreshed", "1");
        
        // Setup new response with forwarded headers and cookies
        const nextResponse = NextResponse.next({
          request: { headers: requestHeaders },
        });

        // Set cookies on the outbound response from middleware
        if (newTokens.accessToken) {
          nextResponse.cookies.set("accessToken", newTokens.accessToken, { path: "/", maxAge: 24 * 60 * 60 * 30 }); // 30 days
        }
        if (newTokens.refreshToken) {
          nextResponse.cookies.set("refreshToken", newTokens.refreshToken, { path: "/", maxAge: 24 * 60 * 60 * 30 });
        }
        
        return nextResponse;
      }
    }

    // Rule - 1: Logged-in users should not access auth pages
    if (isAuth && isValidAccessToken) {
      return NextResponse.redirect(
        new URL(getDefaultDashboardRoute(userRole as UserRole), request.url)
      );
    }

    const cleanPath = pathname.replace(/\/$/, "");
    if (cleanPath === "/dashboard") {
      if (isValidAccessToken && userRole) {
        return NextResponse.redirect(
          new URL(getDefaultDashboardRoute(userRole), request.url)
        );
      } else {
        const loginUrl = new URL("/auth/login", request.url);
        loginUrl.searchParams.set("redirect", pathWithQuery);
        return NextResponse.redirect(loginUrl);
      }
    }

    // Rule - 2: User trying to access Public route -> allow
    if (routeOwner === null) {
      return NextResponse.next();
    }

    // Rule - 3: User is Not logged in but trying to access protected route -> redirect to login
    if (!accessToken || !isValidAccessToken) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathWithQuery);
      return NextResponse.redirect(loginUrl);
    }

    // Rule - 4: User trying to visit role-based protected route but doesn't have required role -> default dashboard
    if (routeOwner === "ADMIN" || routeOwner === "LANDLORD" || routeOwner === "TENANT") {
      if (routeOwner !== userRole) {
        return NextResponse.redirect(
          new URL(getDefaultDashboardRoute(userRole as UserRole), request.url)
        );
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Error in proxy middleware:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)',
  ],
};
