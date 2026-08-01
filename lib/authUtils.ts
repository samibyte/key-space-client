export type UserRole = "ADMIN" | "LANDLORD" | "TENANT";

export const authRoutes = ["/login", "/register"];

export const isAuthRoute = (pathname: string) => {
  return authRoutes.some((router: string) => router === pathname);
};

export type RouteConfig = {
  exact: string[];
  pattern: RegExp[];
};

export const tenantProtectedRoutes: RouteConfig = {
  pattern: [/^\/tenant\/dashboard/], // Matches any path that starts with /tenant/dashboard
  exact: [],
};

export const landlordProtectedRoutes: RouteConfig = {
  pattern: [/^\/landlord\/dashboard/], // Matches any path that starts with /landlord/dashboard
  exact: [],
};

export const adminProtectedRoutes: RouteConfig = {
  pattern: [/^\/admin\/dashboard/], // Matches any path that starts with /admin/dashboard
  exact: [],
};

export const isRouteMatches = (pathname: string, routes: RouteConfig) => {
  if (routes.exact.includes(pathname)) {
    return true;
  }
  return routes.pattern.some((pattern: RegExp) => pattern.test(pathname));
};

export const getRouteOwner = (
  pathname: string,
): "ADMIN" | "LANDLORD" | "TENANT" | null => {
  if (isRouteMatches(pathname, landlordProtectedRoutes)) {
    return "LANDLORD";
  }

  if (isRouteMatches(pathname, adminProtectedRoutes)) {
    return "ADMIN";
  }

  if (isRouteMatches(pathname, tenantProtectedRoutes)) {
    return "TENANT";
  }

  return null; // public route
};

export const getDefaultDashboardRoute = (role: UserRole) => {
  if (role === "ADMIN") {
    return "/admin/dashboard";
  }
  if (role === "LANDLORD") {
    return "/doctor/dashboard";
  }
  if (role === "TENANT") {
    return "/tenant/dashboard";
  }

  return "/";
};

export const isValidRedirectForRole = (
  redirectPath: string,
  role: UserRole,
) => {
  const sanitizedRedirectPath = redirectPath.split("?")[0] || redirectPath;
  const routeOwner = getRouteOwner(sanitizedRedirectPath);

  if (routeOwner === null) {
    return true;
  }

  if (routeOwner === role) {
    return true;
  }

  return false;
};
