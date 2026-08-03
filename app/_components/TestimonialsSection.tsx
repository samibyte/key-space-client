import { Star, ShieldCheck, Quote } from "lucide-react";
import type { PublicStats } from "@/services/property.service";

interface TestimonialsSectionProps {
  stats: PublicStats;
}

export default function TestimonialsSection({ stats }: TestimonialsSectionProps) {
  const testimonials = [
    {
      name: "Adnan Rahman",
      city: "Dhaka",
      initials: "AR",
      quote: "The lease request and digital payment process on Rent Nest saved me weeks of manual search. It is the most structured rental setup in Bangladesh.",
      rating: 5,
    },
    {
      name: "Tasnia Mim",
      city: "Sylhet",
      initials: "TM",
      quote: "Finding a sublet near my university used to be a nightmare of offline brokers. With Rent Nest, I verified and secured my room in just two days.",
      rating: 5,
    },
    {
      name: "Raisul Karim",
      city: "Chittagong",
      initials: "RK",
      quote: "As someone relocating, the ability to sign leases virtually and pay deposit via local mobile wallets is a game-changer. Pure peace of mind.",
      rating: 5,
    },
  ];

  const highlights = [
    { label: "Listed Properties", val: stats.totalProperties },
    { label: "Active Leases", val: stats.activeLeases },
    { label: "Registered Tenants", val: stats.totalTenants },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col gap-12">
      {/* Header */}
      <div className="text-center flex flex-col gap-2">
        <span className="text-xs uppercase tracking-widest text-primary font-bold">
          Renter Stories
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          Trusted by Renters
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
          Hear from tenants who found their perfect nesting spaces with transparent lease flows.
        </p>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6.5">
        {testimonials.map((t) => (
          <div
            key={t.name}
            className="flex flex-col justify-between gap-6 p-6 sm:p-7 rounded-3xl border border-border/50 bg-card/60 backdrop-blur-xs relative overflow-hidden"
          >
            <Quote className="absolute top-4 right-4 size-8 text-primary/5 pointer-events-none" />

            {/* Stars row */}
            <div className="flex items-center gap-0.5">
              {[...Array(t.rating)].map((_, i) => (
                <Star key={i} className="size-4 fill-amber-450 text-amber-450" />
              ))}
            </div>

            {/* Quote text */}
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed italic flex-1">
              &ldquo;{t.quote}&rdquo;
            </p>

            {/* User Meta */}
            <div className="flex items-center gap-3.5 pt-4 border-t border-border/40">
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-sm text-primary shrink-0">
                {t.initials}
              </div>
              <div className="text-left leading-tight">
                <span className="text-sm font-extrabold text-foreground block">
                  {t.name}
                </span>
                <span className="text-[10px] text-muted-foreground font-medium block mt-0.5">
                  Tenant in {t.city}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trust Statistics Strip */}
      <div className="mt-4 p-8 rounded-3xl border border-primary/20 bg-linear-to-br from-primary/5 via-transparent to-transparent flex flex-col md:flex-row items-center justify-between gap-6.5 text-center md:text-left">
        <div className="flex flex-col gap-1 max-w-md">
          <h3 className="font-extrabold text-foreground text-lg flex items-center justify-center md:justify-start gap-2.5">
            <ShieldCheck className="size-5 text-primary shrink-0" />
            100% Lease Protection
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            All rental queries are validated, and contracts are protected using encryption and secure merchant keys.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 shrink-0">
          {highlights.map((h) => (
            <div key={h.label} className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight leading-none">
                {h.val >= 1000 ? `${(h.val / 1000).toFixed(0)}k+` : h.val}
              </span>
              <span className="text-[10px] sm:text-xs text-muted-foreground font-semibold mt-1">
                {h.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
