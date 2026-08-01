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
  pattern: [/^\/dashboard\/tenant/],
  exact: [],
};

export const landlordProtectedRoutes: RouteConfig = {
  pattern: [/^\/dashboard\/landlord/],
  exact: [],
};

export const adminProtectedRoutes: RouteConfig = {
  pattern: [/^\/dashboard\/admin/],
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
    return "/dashboard/admin";
  }
  if (role === "LANDLORD") {
    return "/dashboard/landlord";
  }
  if (role === "TENANT") {
    return "/dashboard/tenant";
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
