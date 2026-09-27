import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AboutCTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center relative overflow-hidden">
      {/* Visual background gradient accents */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/5 rounded-3xl -z-10" />
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-80 h-80 bg-primary/10 rounded-full blur-3xl -z-10" />

      <div className="p-8 sm:p-12 rounded-3xl border border-primary/20 bg-background/60 backdrop-blur-md shadow-xl flex flex-col items-center gap-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight max-w-xl">
          Ready to Unlock Your Perfect Space?
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-md leading-relaxed">
          Sign up today to explore thousands of active listings, request leases directly, and pay your rent hassle-free.
        </p>

        <div className="flex flex-wrap gap-4 justify-center mt-2 w-full sm:w-auto">
          <Link
            href="/properties"
            className={cn(
              buttonVariants({ variant: "default" }),
              "w-full sm:w-auto h-11 px-8 rounded-xl font-semibold text-sm shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            )}
          >
            Explore Listings
          </Link>
          <Link
            href="/auth/register"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-full sm:w-auto h-11 px-8 rounded-xl font-semibold text-sm bg-background hover:bg-muted/80 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            )}
          >
            Sign Up Now
          </Link>
        </div>
      </div>
    </section>
  );
}
