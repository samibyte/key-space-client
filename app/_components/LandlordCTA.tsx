import Link from "next/link";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function LandlordCTA() {
  const benefits = [
    "Zero upfront listing fees or advertising costs",
    "Pre-screened verified tenant background profiles",
    "Digital leases, signatures, and document storage",
    "Automated invoicing & card/mobile wallet payouts",
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="relative rounded-3xl overflow-hidden bg-emerald-950/95 dark:bg-emerald-950/70 border border-emerald-800/30 text-white shadow-2xl p-8 sm:p-12 lg:p-16">
        {/* Glow decorations */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-3xl -z-10" />
        <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Text Content */}
          <div className="flex flex-col gap-6 text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-primary/20 text-emerald-300 border border-emerald-700/30 self-start">
              For Property Owners
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Own Property? <br className="hidden sm:inline" />
              Start Nesting &amp; Earning.
            </h2>
            <p className="text-sm text-emerald-100/80 leading-relaxed max-w-md">
              List your flats, duplexes, or commercial hubs in minutes. Manage everything from screening to digital rent payout collection.
            </p>

            <div className="flex flex-wrap gap-4 mt-2">
              <Link
                href="/auth/register"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "h-11 px-7 rounded-xl font-bold bg-primary hover:bg-primary/95 text-primary-foreground flex items-center gap-1 shadow-md shadow-emerald-950/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
                )}
              >
                List Your Property
                <ChevronRight className="size-4.5" />
              </Link>
              <Link
                href="/about"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-11 px-7 rounded-xl font-bold bg-transparent border-white/20 hover:bg-white/10 hover:text-white hover:scale-[1.02] active:scale-[0.98] transition-all"
                )}
              >
                How Landlord Works
              </Link>
            </div>
          </div>

          {/* Benefits Bullet Grid */}
          <div className="bg-emerald-900/40 backdrop-blur-md rounded-2xl border border-emerald-800/40 p-6 sm:p-8 flex flex-col gap-4">
            <h3 className="font-extrabold text-foreground text-sm tracking-tight text-white mb-2 pb-2 border-b border-emerald-800/30">
              Why Landlords Love Rent Nest
            </h3>
            <ul className="flex flex-col gap-4">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-3.5 text-xs sm:text-sm text-emerald-100/90 leading-tight">
                  <CheckCircle2 className="size-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
