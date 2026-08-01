import { LoginForm } from "../_components/loginForm";
import Logo from "@/components/ui/logo";
import Link from "next/link";

interface LoginParams {
  searchParams: Promise<{ redirect?: string }>;
}

const LoginPage = async ({ searchParams }: LoginParams) => {
  const params = await searchParams;
  const redirectPath = params.redirect;

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-[oklch(0.97_0.005_175)]  dark:bg-[oklch(0.11_0.014_240)]">
      {/* ── Ambient blobs ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Top-left emerald blob */}
        <div className="absolute -top-32 -left-32 h-140 w-140 rounded-full bg-[oklch(0.65_0.14_168/0.20)] blur-[120px]" />
        {/* Bottom-right jade blob */}
        <div className="absolute -bottom-40 -right-20 h-120 w-120 rounded-full bg-[oklch(0.5_0.10_175/0.18)] blur-[100px]" />
        {/* Center warm accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-[oklch(0.78_0.08_90/0.08)] blur-[90px]" />
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04] dark:opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.4 0.06 175) 1px, transparent 1px), linear-gradient(90deg, oklch(0.4 0.06 175) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* ── Glassmorphic card ── */}
      <div className="relative z-10 w-full max-w-md px-4 sm:px-0 mx-auto py-12">
        <div className="rounded-2xl border border-white/20 bg-white/70 dark:bg-white/5 dark:border-white/10 backdrop-blur-xl shadow-2xl shadow-black/10 dark:shadow-black/40 px-8 py-10 sm:px-10 sm:py-12 flex flex-col gap-8">

          {/* Header */}
          <div className="flex flex-col items-center gap-5 text-center">
            <Link href="/" className="transition-transform hover:scale-105 active:scale-95">
              <Logo className="w-14" />
            </Link>
            <div className="space-y-1.5">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Welcome back
              </h1>
              <p className="text-sm text-muted-foreground">
                Sign in to your Rent Nest account
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-border/50" />

          {/* Form */}
          <LoginForm redirectPath={redirectPath} />

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="font-medium text-primary hover:underline underline-offset-4 transition-colors"
            >
              Create one free
            </Link>
          </p>
        </div>

        {/* Trust badge */}
        <p className="mt-6 text-center text-[11px] text-muted-foreground/60 tracking-wide uppercase">
          Secure &middot; Encrypted &middot; Private
        </p>
      </div>
    </section>
  );
};

export default LoginPage;
