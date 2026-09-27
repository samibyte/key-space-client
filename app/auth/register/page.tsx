import RegisterForm from "../_components/RegisterForm";
import AuthLeftPanel from "../_components/AuthLeftPanel";
import Logo from "@/components/ui/logo";
import Link from "next/link";
import { Sparkles } from "lucide-react";

interface RegisterParams {
  searchParams: Promise<{ redirect?: string }>;
}

const RegisterPage = async ({ searchParams }: RegisterParams) => {
  const params = await searchParams;
  const redirectPath = params.redirect;

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* ── Left panel ── */}
      <AuthLeftPanel variant="register" />

      {/* ── Right: form panel ── */}
      <div className="relative flex flex-col min-h-screen overflow-y-auto bg-gradient-to-br from-background via-background to-muted/30">
        {/* Ambient glow effects */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-[oklch(0.65_0.14_168)]/5 blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/[0.02] blur-[100px]" />
        </div>

        {/* Form container */}
        <div className="relative z-10 flex flex-1 items-start justify-center px-6 py-8 sm:px-10 lg:py-14">
          <div className="w-full max-w-md space-y-6">
            {/* Header with gradient text */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-foreground bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Get started today
              </h1>
              <p className="text-muted-foreground">
                Join KeySpace — it&apos;s free and takes under a minute
              </p>
            </div>

            {/* Divider with dot */}
            <div className="relative">
              <div className="h-px w-full bg-border/50" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-2 rounded-full bg-border/50" />
            </div>

            {/* Demo hint */}
            <div className="flex items-center gap-2.5 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
              <Sparkles className="size-4 text-primary shrink-0" />
              <p className="text-xs text-muted-foreground">
                Want to explore first?{" "}
                <Link
                  href="/auth/login"
                  className="font-semibold text-primary hover:underline underline-offset-4"
                >
                  Log in with a demo account
                </Link>{" "}
                — Admin, Landlord, or Tenant.
              </p>
            </div>

            {/* Form */}
            <RegisterForm redirectPath={redirectPath} />


            {/* Footer with link */}
            <div className="pt-2">
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="font-medium text-primary hover:text-primary/80 transition-colors hover:underline underline-offset-4 group"
                >
                  Sign in here
                  <span className="inline-block ml-1 transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Trust badge footer */}
        <div className="relative z-10 pb-6 text-center">
          <p className="text-[10px] text-muted-foreground/30 tracking-[0.15em] uppercase flex items-center justify-center gap-3">
            <span>Secure</span>
            <span className="w-px h-3 bg-border/30" />
            <span>Encrypted</span>
            <span className="w-px h-3 bg-border/30" />
            <span>Private</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;