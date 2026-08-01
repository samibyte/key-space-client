import Image from "next/image";
import Link from "next/link";
import Logo from "@/components/ui/logo";
import { Star, MapPin, Users, Home, Shield, Award, Sparkles } from "lucide-react";

//Data variants per page 

type PanelVariant = "login" | "register";

interface PanelConfig {
  image: string;
  heading: string;
  subheading: string;
  stats: { label: string; value: string; icon: React.ReactNode }[];
  testimonial: {
    quote: string;
    author: string;
    role: string;
    rating: number;
  };
  features: string[];
}

const configs: Record<PanelVariant, PanelConfig> = {
  login: {
    image: "/auth-login-panel.png",
    heading: "Find your perfect home, effortlessly.",
    subheading:
      "Access thousands of premium verified rentals across the city — all in one place.",
    stats: [
      { label: "Active properties", value: "12K+", icon: <Home className="size-3.5" /> },
      { label: "Happy renters", value: "48K+", icon: <Users className="size-3.5" /> },
      { label: "Cities covered", value: "120+", icon: <MapPin className="size-3.5" /> },
    ],
    testimonial: {
      quote:
        "Found my dream apartment in under 48 hours. The whole process was seamless and stress-free.",
      author: "Maria Chen",
      role: "Tenant · New York",
      rating: 5,
    },
    features: ["Instant booking", "Verified listings", "24/7 support"],
  },
  register: {
    image: "/auth-register-panel.png",
    heading: "List, manage, and grow.",
    subheading:
      "Whether you're a tenant searching or a landlord listing, Rent Nest makes every step effortless.",
    stats: [
      { label: "Avg. days to lease", value: "< 7", icon: <Sparkles className="size-3.5" /> },
      { label: "Landlord rating", value: "4.9★", icon: <Star className="size-3.5" /> },
      { label: "Free to join", value: "100%", icon: <Award className="size-3.5" /> },
    ],
    testimonial: {
      quote:
        "I listed my property and had qualified tenants reaching out within 24 hours. Incredible platform.",
      author: "James Okafor",
      role: "Landlord · London",
      rating: 5,
    },
    features: ["Free listing", "Smart matching", "Analytics dashboard"],
  },
};

// Component 

interface AuthLeftPanelProps {
  variant: PanelVariant;
}

export default function AuthLeftPanel({ variant }: AuthLeftPanelProps) {
  const config = configs[variant];

  return (
    <div className="relative hidden lg:flex flex-col h-full min-h-screen overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0">
        <Image
          src={config.image}
          alt=""
          fill
          className="object-cover object-center"
          priority
          sizes="50vw"
        />
        {/* Premium gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.08_0.03_175/0.85)] via-[oklch(0.08_0.03_175/0.70)] to-[oklch(0.08_0.03_175/0.95)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.12_0.15_168/0.15)] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[oklch(0.08_0.03_175/0.6)] to-transparent" />
      </div>

      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, oklch(0.7 0.10 168) 1px, transparent 1px),
            radial-gradient(circle at 80% 20%, oklch(0.7 0.10 168) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full p-10 xl:p-14">
        {/* Logo with glass effect */}
        <Link
          href="/"
          className="flex items-center gap-3 transition-all hover:scale-[1.02] w-fit group"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
            <Logo className="w-10 relative" />
          </div>
          <span className="text-xl font-semibold tracking-tight text-white/90">
            Rent <span className="text-[oklch(0.78_0.14_168)]">Nest</span>
          </span>
        </Link>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Main copy with animations */}
        <div className="space-y-6 max-w-sm">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-[10px] font-medium text-white/60 tracking-wider uppercase">
              <Sparkles className="size-3" />
              Trusted platform
            </span>
            <h2 className="text-4xl xl:text-5xl font-bold text-white leading-[1.1] tracking-tight">
              {config.heading}
            </h2>
          </div>
          <p className="text-base text-white/60 leading-relaxed">
            {config.subheading}
          </p>
        </div>

        {/* Stats with glassmorphism */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          {config.stats.map((stat, index) => (
            <div
              key={stat.label}
              className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-4 py-3.5 transition-all hover:bg-white/10 hover:scale-[1.02] hover:border-white/20"
            >
              <div className="flex items-center gap-2">
                <span className="text-[oklch(0.78_0.14_168)]/70">
                  {stat.icon}
                </span>
                <p className="text-xl font-bold text-[oklch(0.78_0.14_168)]">
                  {stat.value}
                </p>
              </div>
              <p className="text-[10px] text-white/40 mt-0.5 leading-tight">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Testimonial card with glassmorphism */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-md p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex gap-0.5">
              {Array.from({ length: config.testimonial.rating }).map((_, i) => (
                <Star
                  key={i}
                  className="size-4 fill-[oklch(0.80_0.16_90)] text-[oklch(0.80_0.16_90)]"
                  aria-hidden
                />
              ))}
            </div>
            <span className="text-[10px] text-white/30">Verified</span>
          </div>

          <blockquote className="text-sm text-white/70 leading-relaxed italic">
            &ldquo;{config.testimonial.quote}&rdquo;
          </blockquote>

          <div className="flex items-center gap-3">
            <div className="size-9 rounded-full bg-gradient-to-br from-[oklch(0.65_0.14_168/0.3)] to-[oklch(0.65_0.14_168/0.1)] flex items-center justify-center shrink-0">
              <span className="text-sm font-medium text-[oklch(0.78_0.14_168)]">
                {config.testimonial.author.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-white/90">
                {config.testimonial.author}
              </p>
              <p className="text-xs text-white/40">{config.testimonial.role}</p>
            </div>
          </div>
        </div>

        {/* Feature badges */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {config.features.map((feature) => (
            <span 
              key={feature}
              className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/50"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Bottom trust bar */}
        <div className="mt-6 flex items-center gap-2 text-[10px] text-white/20 tracking-wide uppercase">
          <Shield className="size-3" aria-hidden />
          <span>Protected by 256-bit encryption</span>
          <span className="w-px h-3 bg-white/10" />
          <span>GDPR compliant</span>
        </div>
      </div>
    </div>
  );
}