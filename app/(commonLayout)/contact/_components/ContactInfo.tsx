import { Mail, Phone, MapPin, Clock, MessageCircle, ExternalLink } from "lucide-react";

export default function ContactInfo() {
  const channels = [
    {
      icon: <Mail className="size-5 text-primary" />,
      label: "Email Support",
      value: "support@keyspace.com.bd",
      sub: "We reply within 24 hours",
      href: "mailto:support@keyspace.com.bd",
    },
    {
      icon: <Phone className="size-5 text-primary" />,
      label: "Phone Hotline",
      value: "+880 1800-KEYSPACE-01",
      sub: "Sun – Thu, 9 AM – 6 PM",
      href: "tel:+8801800637801",
    },
    {
      icon: <MessageCircle className="size-5 text-primary" />,
      label: "Live Chat",
      value: "Chat with an agent",
      sub: "Available on working hours",
      href: "#",
    },
    {
      icon: <MapPin className="size-5 text-primary" />,
      label: "Head Office",
      value: "Gulshan-2, Dhaka 1212",
      sub: "Bangladesh",
      href: "https://maps.google.com/?q=Gulshan+2+Dhaka",
    },
  ];

  const hours = [
    { day: "Sunday – Thursday", time: "9:00 AM – 6:00 PM" },
    { day: "Friday", time: "Closed" },
    { day: "Saturday", time: "10:00 AM – 2:00 PM" },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* Left: contact cards */}
      <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
        {channels.map((c) => (
          <a
            key={c.label}
            href={c.href}
            target={c.href.startsWith("http") ? "_blank" : undefined}
            rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="group flex flex-col gap-4 p-6 rounded-3xl border border-border/50 bg-card hover:border-primary/25 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 relative overflow-hidden"
          >
            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary/3 rounded-bl-full group-hover:scale-125 transition-transform duration-300 pointer-events-none" />

            <div className="size-11 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              {c.icon}
            </div>

            <div className="flex flex-col gap-1 flex-1">
              <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">
                {c.label}
              </span>
              <p className="font-extrabold text-foreground text-sm leading-tight group-hover:text-primary transition-colors">
                {c.value}
              </p>
              <p className="text-xs text-muted-foreground">{c.sub}</p>
            </div>

            {c.href.startsWith("http") && (
              <ExternalLink className="size-3.5 text-muted-foreground absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </a>
        ))}
      </div>

      {/* Right: Office Hours card */}
      <div className="flex flex-col gap-5">
        <div className="p-6 rounded-3xl border border-border/50 bg-card flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <Clock className="size-5 text-primary" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold block">
                Office Hours
              </span>
              <p className="font-extrabold text-foreground text-sm leading-tight">
                When we&apos;re available
              </p>
            </div>
          </div>

          <ul className="flex flex-col gap-3">
            {hours.map((h) => (
              <li key={h.day} className="flex items-center justify-between text-xs border-b border-border/40 pb-2.5 last:border-0 last:pb-0">
                <span className="text-muted-foreground font-medium">{h.day}</span>
                <span className={`font-extrabold ${h.time === "Closed" ? "text-destructive/80" : "text-foreground"}`}>
                  {h.time}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tip bubble */}
        <div className="p-5 rounded-3xl border border-primary/15 bg-primary/5 flex flex-col gap-2">
          <p className="text-xs font-bold text-primary">💡 Fastest response</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            For tenant or landlord issues, emailing <span className="font-semibold text-foreground">support@keyspace.com.bd</span> gets you a reply within a few hours on business days.
          </p>
        </div>
      </div>
    </section>
  );
}
