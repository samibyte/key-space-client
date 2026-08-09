import { TrendingUp, Coins, FileCheck, ShieldAlert, BadgeCheck } from "lucide-react";

export default function BenefitsSection() {
  const benefits = [
    {
      title: "Build Rent Credit",
      desc: "Every on-time monthly payment made on Rent Nest counts positively towards your rental credit history, helping you secure premium homes easily.",
      icon: <TrendingUp className="size-6 text-emerald-500" />,
      badge: "Credit Booster",
      gradient: "from-emerald-500/10 to-transparent",
    },
    {
      title: "Zero Middleman Fees",
      desc: "Connect and contract directly with verified landlords. No hidden agent commissions or unexpected broker charges, keeping transaction fees at absolute zero.",
      icon: <Coins className="size-6 text-teal-400" />,
      badge: "Pure Savings",
      gradient: "from-teal-500/10 to-transparent",
    },
    {
      title: "Smart Digital Receipts",
      desc: "Instantly generate certified digital rent receipts after each successful transaction. File them easily for office HRA claims and tax declarations.",
      icon: <FileCheck className="size-6 text-sky-500" />,
      badge: "Tax Ready",
      gradient: "from-sky-500/10 to-transparent",
    },
    {
      title: "Secure Deposit Safeguard",
      desc: "Deposits are held safely and protected with concrete, enforceable terms. Simple online checkout ensures speedy returns when lease terms conclude.",
      icon: <ShieldAlert className="size-6 text-red-500" />,
      badge: "100% Protection",
      gradient: "from-red-500/10 to-transparent",
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col gap-12 w-full">
      {/* Header */}
      <div className="text-center flex flex-col gap-2">
        <span className="text-xs uppercase tracking-widest text-primary font-bold">
          Occupant Perks
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          Why Rent with Rent Nest?
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
          We leverage modern technology to provide you with financial utility, complete security, and transparency.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {benefits.map((b) => (
          <div
            key={b.title}
            className="flex flex-col justify-between gap-5 p-6 rounded-3xl border border-border/40 bg-card hover:border-primary/20 hover:shadow-xl transition-all duration-300 relative group overflow-hidden"
          >
            {/* Hover card glow */}
            <div
              className={`absolute -inset-px bg-linear-to-br ${b.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl`}
            />

            <div className="flex flex-col gap-4 relative z-10 w-full">
              {/* Badge + Icon */}
              <div className="flex items-center justify-between">
                <div className="size-11 rounded-2xl bg-muted flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  {b.icon}
                </div>
                <span className="text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {b.badge}
                </span>
              </div>

              {/* Title & Description */}
              <div className="flex flex-col gap-1.5 mt-2">
                <h3 className="font-extrabold text-base text-foreground tracking-tight group-hover:text-primary transition-colors">
                  {b.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {b.desc}
                </p>
              </div>
            </div>

            {/* Checkmark overlay for list structure integrity */}
            <div className="flex items-center gap-1.5 text-primary text-[10px] font-bold mt-2 relative z-10 group-hover:translate-x-1 transition-transform">
              <BadgeCheck className="size-3.5" />
              Included for free
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
