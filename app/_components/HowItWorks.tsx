import { Search, Send, Clock, CreditCard, Key } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Browse listings",
      desc: "Use advanced filters, galleries, and landlord ratings to find flats matching your lifestyle.",
      icon: <Search className="size-5 text-primary" />,
    },
    {
      num: "02",
      title: "Request Nest",
      desc: "Click 'Request Rental' on any available page, set your move-in date, and send directly.",
      icon: <Send className="size-5 text-primary" />,
    },
    {
      num: "03",
      title: "Landlord Approves",
      desc: "Wait for the landlord to review your request and approve the digital lease terms.",
      icon: <Clock className="size-5 text-primary" />,
    },
    {
      num: "04",
      title: "Secure Payment",
      desc: "Pay your security deposit and first month's rent online via card or mobile wallet (bKash).",
      icon: <CreditCard className="size-5 text-primary" />,
    },
    {
      num: "05",
      title: "Move In",
      desc: "Receive your signed agreement copy, schedule keys handover, and enjoy your new home!",
      icon: <Key className="size-5 text-primary" />,
    },
  ];

  return (
    <section className="bg-muted/40 border-y border-border/40 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Header */}
        <div className="text-center flex flex-col gap-2">
          <span className="text-xs uppercase tracking-widest text-primary font-bold">
            Simplicity Built-In
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            How Rent Nest Works
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
            A fully transparent, automated process keeping tenants and landlords safe at every step.
          </p>
        </div>

        {/* Timeline Layout */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6.5 relative">
          {steps.map((st, i) => (
            <div
              key={st.num}
              className="flex flex-col items-center md:items-start text-center md:text-left gap-4 bg-card border border-border/50 p-6 rounded-3xl relative group hover:border-primary/20 hover:shadow-lg transition-all duration-300"
            >
              {/* Connector line (desktop only) */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-full w-full h-[1.5px] bg-border/80 -translate-y-1/2 -ml-3 z-0 pointer-events-none group-hover:bg-primary/20 transition-colors" />
              )}

              {/* Number Index + Icon layout */}
              <div className="flex items-center justify-between w-full relative z-10">
                <span className="text-stone-300 font-extrabold text-2xl tracking-tighter leading-none">
                  {st.num}
                </span>
                <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  {st.icon}
                </div>
              </div>

              {/* Title & description */}
              <div className="flex flex-col gap-1.5 mt-2 relative z-10 w-full">
                <h3 className="font-extrabold text-foreground text-sm tracking-tight">
                  {st.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {st.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
