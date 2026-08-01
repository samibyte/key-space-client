"use server";

import {
  getDefaultDashboardRoute,
  isValidRedirectForRole,
  UserRole,
} from "@/lib/authUtils";
import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { ILoginResponse } from "@/types/auth.type";
import {
  ILoginPayload,
  IRegisterPayload,
  loginZodSchema,
  registerZodSchema,
} from "@/zod/auth.validation";

// Login 

export const loginAction = async (
  payload: ILoginPayload,
  redirectPath?: string,
): Promise<{ success: boolean; message: string; redirectPath?: string }> => {
  const parsedPayload = loginZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    const firstError = parsedPayload.error.issues[0].message || "Invalid input";
    return { success: false, message: firstError };
  }

  try {
    const response = await httpClient.post<ILoginResponse>(
      "/auth/login",
      parsedPayload.data,
    );

    const { accessToken, refreshToken, userData } = response.data;
    const { role } = userData;
    await setTokenInCookies("accessToken", accessToken);
    await setTokenInCookies("refreshToken", refreshToken);

    const targetPath =
      redirectPath && isValidRedirectForRole(redirectPath, role as UserRole)
        ? redirectPath
        : getDefaultDashboardRoute(role as UserRole);

    return { success: true, redirectPath: targetPath, message: "Login successful" };
  } catch (error) {
    console.log(error, "error");

    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    return {
      success: false,
      message:
        axiosError.response?.data?.message ||
        `Login failed: ${axiosError.message || "Unknown error"}`,
    };
  }
};

//Register
export const registerAction = async (
  payload: IRegisterPayload,
  redirectPath?: string,
): Promise<{ success: boolean; message: string; redirectPath?: string }> => {
  const parsedPayload = registerZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    const firstError = parsedPayload.error.issues[0].message || "Invalid input";
    return { success: false, message: firstError };
  }

  try {
    const response = await httpClient.post<ILoginResponse>(
      "/auth/register",
      parsedPayload.data,
    );
    const { accessToken, refreshToken, userData } = response.data;
    const { role } = userData;
    await setTokenInCookies("accessToken", accessToken);
    await setTokenInCookies("refreshToken", refreshToken);

    const targetPath =
      redirectPath && isValidRedirectForRole(redirectPath, role as UserRole)
        ? redirectPath
        : getDefaultDashboardRoute(role as UserRole);

    return {
      success: true,
      redirectPath: targetPath,
      message: "Registration successful",
    };
  } catch (error) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    return {
      success: false,
      message:
        axiosError.response?.data?.message ||
        `Registration failed: ${axiosError.message || "Unknown error"}`,
    };
  }
};

// Logout
export const logoutAction = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const { deleteCookie } = await import("@/lib/cookieUtils");
    await deleteCookie("accessToken");
    await deleteCookie("refreshToken");
    return { success: true, message: "Logged out successfully" };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, message: "Logout failed" };
  }
};
