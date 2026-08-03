import { Building2 } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AboutHero() {
  return (
    <section className="relative pt-28 overflow-hidden py-20 px-4 sm:px-6 lg:px-8 text-center bg-radial from-primary/10 via-background to-background">
      {/* Decorative blurred background shapes */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-3xl -z-10" />

      <div className="mx-auto max-w-4xl flex flex-col items-center gap-6">
        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-none">
          Redefining Rental <br className="hidden sm:inline" />
          Living in{" "}
          <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
            Bangladesh
          </span>
        </h1>

        {/* Hero Description */}
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Rent Nest is a state-of-the-art property management and rental
          matching platform. We bridge the gap between verified landlords and
          prospective tenants, turning complex lease journeys into secure,
          intuitive, and delightful modern experiences.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
          <Link
            href="/properties"
            className={cn(
              buttonVariants({ variant: "default" }),
              "h-11 px-6 rounded-xl font-semibold text-sm shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200",
            )}
          >
            Browse Properties
          </Link>
          <Link
            href="/auth/register"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-11 px-6 rounded-xl font-semibold text-sm bg-background/50 backdrop-blur-sm border-border/80 hover:bg-muted/80 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200",
            )}
          >
            Join as Member
          </Link>
        </div>
      </div>

      {/* Decorative Building Silhouette/Floating Glass Card */}
      <div className="mx-auto max-w-3xl mt-16 p-4 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-primary/5 rounded-3xl -z-10" />
        <div className="rounded-2xl overflow-hidden aspect-video relative bg-card/60 flex items-center justify-center group min-h-60 sm:min-h-80 border border-border/40">
          <div className="flex flex-col items-center gap-3 text-center p-6">
            <div className="size-16 rounded-2xl bg-gradient-to-br from-primary to-emerald-500 p-0.5 shadow-lg shadow-primary/20">
              <div className="w-full h-full rounded-[14px] bg-background flex items-center justify-center">
                <Building2 className="size-8 text-primary" />
              </div>
            </div>
            <p className="text-xl font-semibold text-foreground">
              Find Your Next Nesting Spot
            </p>
            <p className="text-sm text-muted-foreground max-w-sm">
              Discover beautiful flats, studio apartments, and commercial spaces
              suited perfectly to your life.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
