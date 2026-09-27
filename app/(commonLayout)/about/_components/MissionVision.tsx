import { ShieldCheck, Heart, Zap, Sparkles } from "lucide-react";

export default function MissionVision() {
  const values = [
    {
      title: "Trust & Safety First",
      desc: "Every listing is vetted, every landlord is verified, and payments are secured via modern Escrows.",
      icon: <ShieldCheck className="size-5 text-primary" />,
    },
    {
      title: "Frictionless Journeys",
      desc: "Instant search matching, customizable filters, and automatic invoicing remove time wasting.",
      icon: <Zap className="size-5 text-primary" />,
    },
    {
      title: "Community Focused",
      desc: "We promote long-lasting relationships matching the right tenants with the right rental properties.",
      icon: <Heart className="size-5 text-primary" />,
    },
    {
      title: "Innovative Engineering",
      desc: "Employing premium design systems, security features, and cache layers for peak software performance.",
      icon: <Sparkles className="size-5 text-primary" />,
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Heading & Paragraphs */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <span className="text-xs uppercase tracking-widest text-primary font-bold">
            Our Purpose
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Connecting Homes, Building Trust.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Finding a home shouldn&apos;t involve endless phone calls, unverified brokers, and hidden charges. 
            KeySpace was founded to bring simplicity, automation, and transparency under one premium roof.
          </p>
          <div className="h-0.5 w-20 bg-primary/30 rounded" />
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-foreground italic border-l-2 border-primary pl-4 py-1">
              &ldquo;We model a world where settling into your perfect rental unit is as easy as requesting a ride on your phone.&rdquo;
            </p>
          </div>
        </div>

        {/* Right Column: Values Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {values.map((v) => (
            <div
              key={v.title}
              className="p-5 sm:p-6 rounded-2xl border border-border/40 bg-card hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 flex flex-col gap-3"
            >
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                {v.icon}
              </div>
              <h3 className="font-bold text-foreground text-base mt-1">{v.title}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
