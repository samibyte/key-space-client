"use client";

import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";

export const GoogleAuthButton = () => {
  const handleGoogleLogin = () => {
    // Note: Use NEXT_PUBLIC_API_BASE_URL to hit the backend route
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";
    window.location.href = `${baseUrl}/auth/google`;
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full h-11 relative overflow-hidden transition-all duration-300 hover:bg-muted/50 hover:border-primary/50 group"
      onClick={handleGoogleLogin}
    >
      <div className="absolute inset-x-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent top-0 opacity-0 group-hover:opacity-100 transition-opacity" />
      <FcGoogle className="mr-2 text-xl group-hover:scale-110 transition-transform duration-300" />
      <span className="font-medium">Continue with Google</span>
      <div className="absolute inset-x-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent bottom-0 opacity-0 group-hover:opacity-100 transition-opacity" />
    </Button>
  );
};
