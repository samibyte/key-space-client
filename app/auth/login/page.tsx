import { LoginForm } from "../_components/loginForm";
import AuthLeftPanel from "../_components/AuthLeftPanel";
import Logo from "@/components/ui/logo";
import Link from "next/link";

interface LoginParams {
  searchParams: Promise<{ redirect?: string }>;
}

const LoginPage = async ({ searchParams }: LoginParams) => {
  const params = await searchParams;
  const redirectPath = params.redirect;

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* ── Left panel ── */}
      <AuthLeftPanel variant="login" />

      {/* ── Right: form panel ── */}
      <div className="relative flex flex-col min-h-screen overflow-y-auto bg-[oklch(0.97_0.005_175)] dark:bg-[oklch(0.11_0.014_240)]">
        {/* Ambient blobs (form side) */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-[oklch(0.65_0.14_168/0.12)] blur-[100px]" />
          <div className="absolute bottom-0 left-0 h-60 w-60 rounded-full bg-[oklch(0.5_0.10_175/0.10)] blur-[80px]" />
        </div>

        {/* Mobile-only logo (hidden on lg where left panel shows) */}
        <div className="lg:hidden flex items-center gap-3 p-6">
          <Link href="/" className="transition-transform hover:scale-105 active:scale-95">
            <Logo className="w-10" />
          </Link>
           <span className="font-semibold text-foreground tracking-tight">KeySpace</span>
        </div>

        {/* Centered form */}
        <div className="relative z-10 flex flex-1 items-center justify-center px-6 py-12 sm:px-10">
          <div className="w-full max-w-md space-y-8">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Welcome back
              </h1>
              <p className="text-muted-foreground">
                Sign in to your KeySpace account
              </p>
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-border/50" />

            {/* Form */}
            <LoginForm redirectPath={redirectPath} />

            {/* Footer */}
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/register"
                className="font-medium text-primary hover:underline underline-offset-4 transition-colors"
              >
                Create one free
              </Link>
            </p>
          </div>
        </div>

        {/* Trust badge */}
        <p className="relative z-10 pb-8 text-center text-[11px] text-muted-foreground/50 tracking-wide uppercase">
          Secure &middot; Encrypted &middot; Private
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
