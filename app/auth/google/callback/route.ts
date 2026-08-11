import { NextRequest, NextResponse } from "next/server";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { jwtDecode } from "jwt-decode";
import { UserRole } from "@/lib/authUtils";

// Re-using the logic from getDefaultDashboardRoute
const getDefaultDashboardRoute = (role: UserRole) => {
  switch (role) {
    case "ADMIN":
      return "/dashboard/admin";
    case "LANDLORD":
      return "/dashboard/landlord";
    case "TENANT":
      return "/dashboard/tenant";
    default:
      return "/dashboard/tenant";
  }
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");

  if (!accessToken || !refreshToken) {
    return NextResponse.redirect(new URL("/auth/login?error=Invalid_Google_Auth", request.url));
  }

  // Set tokens in Next.js cookies
  await setTokenInCookies("accessToken", accessToken);
  await setTokenInCookies("refreshToken", refreshToken);

  try {
    // Decode access token to get user role for dashboard routing
    const decoded = jwtDecode<{ role: UserRole }>(accessToken);
    const targetPath = getDefaultDashboardRoute(decoded.role);
    return NextResponse.redirect(new URL(targetPath, request.url));
  } catch (err) {
    console.error("Failed to decode token from Google OAuth", err);
    return NextResponse.redirect(new URL("/dashboard/tenant", request.url));
  }
}
