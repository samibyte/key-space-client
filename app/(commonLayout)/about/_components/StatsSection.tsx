import { Building2, Key, Users, Landmark } from "lucide-react";
import type { PublicStats } from "@/services/property.service";

interface StatsSectionProps {
  stats: PublicStats;
}

function formatCount(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(num % 1000 === 0 ? 0 : 1)}k+`;
  }
  return String(num);
}

export default function StatsSection({ stats }: StatsSectionProps) {
  const { totalProperties, activeLeases, totalTenants, totalLandlords } = stats;

  const statItems = [
    {
      label: "Properties Listed",
      value: formatCount(totalProperties),
      desc: "Verified flats & homes",
      icon: <Building2 className="size-5 text-primary" />,
    },
    {
      label: "Active Leases",
      value: formatCount(activeLeases),
      desc: "Nests currently occupied",
      icon: <Key className="size-5 text-primary" />,
    },
    {
      label: "Registered Tenants",
      value: formatCount(totalTenants),
      desc: "Verified active renters",
      icon: <Users className="size-5 text-primary" />,
    },
    {
      label: "Partner Landlords",
      value: formatCount(totalLandlords),
      desc: "Verified property owners",
      icon: <Landmark className="size-5 text-primary" />,
    },
  ];

  return (
    <section className="bg-muted/40 border-y border-border/40 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        {/* Header */}
        <div className="text-center flex flex-col gap-2">
          <span className="text-xs uppercase tracking-widest text-primary font-bold">
            Platform Metrics
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Rent Nest in Numbers
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
            Real-time data aggregated directly from our platform database.
          </p>
        </div>

        {/* Counter Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
          {statItems.map((item) => (
            <div
              key={item.label}
              className="p-6 rounded-2xl border border-border/60 bg-card hover:border-primary/25 hover:shadow-lg hover:shadow-primary/5 transition-all duration-305 flex items-start gap-4"
            >
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                {item.icon}
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider leading-none">
                  {item.label}
                </p>
                <p className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mt-0.5">
                  {item.value}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
